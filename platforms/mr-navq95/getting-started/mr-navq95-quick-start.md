# MR-NavQ95 — Deploy and Run Quick Start

The MR-NavQ95 is the i.MX 95 vehicle computer of the NXP Mobile Robotics family. It is
built on the NXP i.MX 95 applications processor, a heterogeneous multicore SoC that
combines six Arm Cortex-A55 application cores, a Cortex-M7 real-time core, and a
Cortex-M33 System Manager, together with the on-chip NXP Neutron neural processing unit
(NPU) for machine-learning inference. On the board this maps to two cooperating domains:
a Cortex-A55 compute domain running Linux (Ubuntu) and a Cortex-M7 real-time domain
running the RTOS/PX4 firmware. For a full board description and functional block diagram,
see the [MR-NavQ95 overview](../overview.md).

Unlike the single-MCU platforms, the MR-NavQ95 requires flashing two images with two
different tools: the Cortex-A Linux `.wic` image with UUU, and the Cortex-M RTOS firmware
with pyOCD. The Cortex-A image is flashed first.

## Get the artifacts first

Every platform assumes the images are already available — either downloaded or built with the SDK:

```sh
# prebuilt (fastest)
west sdk download --platform mr-navq95      # lands in <west topdir>/bin/mr-navq95/

# or build from source
west sdk build    --platform mr-navq95 [...]  # lands in <west topdir>/{build,bin}/...
```

- Docker required. Downloading and building are done inside a Docker container built from the SDK's `Dockerfile` — see the [NXP Robotic Platforms SDK README](https://github.com/NXP-Robotics/robotics-sdk/blob/robotics-0.7.0/README.md) for how to set it up. All `west` commands are assumed to run inside that container.
- The SDK builds/downloads images but does not flash them — deployment is done with each platform's native tool.
- Where do the artifacts land? `<west topdir>` is the west workspace root — the directory containing `.west/`, created by `west init`. The `bin/` directory is created next to the `robotics-sdk/` clone, not inside it:

```
<west topdir>/
├── .west/
├── robotics-sdk/         <- the SDK clone (west init -l)
├── build/                <- west sdk build intermediates
└── bin/mr-navq95/       <- final artifacts land here
```

For MR-NavQ95 the platform is `mr-navq95`. Run `west sdk list` for the authoritative list.

```sh
west sdk download --platform mr-navq95                 # firmware (raw + signed) + linux .wic
# or build from source:
west sdk build    --platform mr-navq95                 # PX4 (default)
west sdk build    --platform mr-navq95 --stack zephyr  # plain Zephyr
```

## What to flash

MR-NavQ95 has two images that are flashed separately, in this order:

| Domain | Image | Artifact (in `bin/mr-navq95/`) | Tool | Target |
|--------|-------|--------------------------------|------|--------|
| 1. Cortex-A (Linux) | Ubuntu root filesystem | `linux/imx-image-robotics-imx95-navq.rootfs.wic.zst` | UUU | eMMC or SD card |
| 2. Cortex-M (RTOS) | Signed M7 firmware | `realtime/nxp_imx95_default.mcuboot.bin` | pyOCD | NOR flash |

> ℹ️ Use the signed `nxp_imx95_default.mcuboot.bin` image for the default TCM-based deployment. MCUboot verifies this image during startup. The `nxp_imx95_ddr.bin` variant is an alternative M7 firmware configuration that runs primarily from external DDR memory instead of TCM and is not packaged as an MCUboot-signed image.
>
> ⚠️ The Cortex-A Linux image must be flashed first; flash the Cortex-M firmware only after the board reaches the Linux login prompt.

## Connect

- USB Type-C from USB1 (J13) — the Serial Download port used by UUU (Cortex-A flashing).
- USB Type-C from DEBUG USB (J10) — exposes two serial consoles (Cortex-A and Cortex-M), 115200 baud, 8N1.
- JTAG probe (NXP MCU-Link or J-Link) on the JTAG connector (J7) — used by pyOCD for Cortex-M flashing.
- 9–52 V DC power supply on the power input connector J9.

Set boot switch SW2 before powering the board (and before attaching any ARA M.2 module, which physically covers SW2). See [MR-NavQ95 Board Overview](../user-manual/hardware.md) for the full `SW2[1:4]` map and connector locations.

## Flash the Cortex-A Linux image (UUU)

1. Download UUU (`uuu` / `uuu.exe`) from the [mfgtools releases](https://github.com/nxp-imx/mfgtools/releases) and place it next to the `.wic` image.
2. Set `SW2[1:4]` = `1001` (Serial Downloader), connect USB1 (J13) + DEBUG USB (J10), apply power, and verify detection:

   ```sh
   ./uuu -lsusb        # expect an NXP i.MX95 device
   ```

3. Flash to eMMC (or SD):

   ```sh
   ./uuu -b emmc_all imx-image-robotics-imx95-navq.rootfs.wic.zst
   # OR
   ./uuu -b sd_all   imx-image-robotics-imx95-navq.rootfs.wic.zst
   ```

   UUU prints `Done` / `Success 1` on completion.

4. Set the boot switches to the flashed media (eMMC = `SW2[1:4]` `0101`, SD = `1101`), power-cycle, and watch both DEBUG-USB consoles at 115200 8N1. Default Linux login: user / user.

See [Flashing the Cortex-A Linux Image](../user-manual/configuring-the-hardware.md#flashing-the-cortex-a-linux-image) for full details.

## Flash the Cortex-M RTOS firmware (pyOCD)

1. Clone the NXP-Robotics pyOCD fork (the i.MX95 target is not in mainline pyOCD):

   ```sh
   git clone https://github.com/NXP-Robotics/pyOCD -b pr-imx95 && cd pyOCD
   ```

2. To install pyOCD:

   ```sh
   # Option 1: install using python virtual environments. If you choose
   # this option, please make sure you always activate the virtual environment
   # before trying to use pyOCD!
   python3 -m venv .venv
   source ./.venv/bin/activate
   python3 -m pip install .

   # Option 2: install using pipx
   sudo apt-get install -y pipx
   # you may need to open a new terminal session for this to take effect!
   pipx ensurepath
   pipx install .
   ```

3. Keep the boot switches on the media you flashed, connect the JTAG probe (J7) + DEBUG USB (J10), apply power, and **wait for the Linux login prompt**.

4. Flash the signed M7 image to NOR:

   ```sh
   pyocd flash -t mimx95_cm7_mx25um --base-address 0x28020000 \
       nxp_imx95_default.mcuboot.bin -f 10m
   ```

   > NOR writes are not fully stable in the current release — retry until pyOCD reports 0 pages programmed (confirms flash matches the binary). The clock can be dropped to `4m` after repeated failures.

5. Reboot; the M7 RTOS shell is reachable from Linux on `/dev/ttynsh`:

   ```sh
   picocom /dev/ttynsh
   ```

See [Flashing the Cortex-M RTOS Firmware](../user-manual/configuring-the-hardware.md#flashing-the-cortex-m-rtos-firmware) for full details, including the CM33-AP fallback.
