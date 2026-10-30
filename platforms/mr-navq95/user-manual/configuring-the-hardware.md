# Configuring the hardware


The MR-NavQ95 has two types of images that can be flashed separately:

| Domain | Description | Guide |
|--------|-------------|-------|
| Cortex-A Linux image | Full Linux root filesystem written to eMMC or SD card using UUU | [Flashing the Cortex-A Linux Image](configuring-the-hardware.md#flashing-the-cortex-a-linux-image) |
| Cortex-M RTOS firmware | M7 RTOS firmware written to NOR flash using pyOCD | [Flashing the Cortex-M RTOS Firmware](configuring-the-hardware.md#flashing-the-cortex-m-rtos-firmware) |

> The Cortex-A must be flashed first, prior to flashing the Cortex-M.

For boot switch settings and connector locations, see [MR-NavQ95 Board Overview](hardware.md).

## Flashing the Cortex-A Linux image

This section describes how to flash the Linux image to the MR-NavQ95 eMMC or SD card using the NXP Universal Update Utility (UUU).

For boot switch settings and connector locations, see [MR-NavQ95 Board Overview](hardware.md).

---

### Prerequisites

Before flashing, obtain the Linux image as described in [Getting the Cortex-A Linux Image](installing-software-tools.md#getting-the-cortex-a-linux-image).

---

### Steps

#### 1. Download UUU

Download the latest UUU executable from the [mfgtools GitHub releases page](https://github.com/nxp-imx/mfgtools/releases):
- Windows: download `uuu.exe`
- Linux: download `uuu`

For convenience, place the UUU executable in the same directory as the `.wic` image.

#### 2. Prepare the Board

1. Connect a USB Type-C cable from USB1 (J13) on the MR-NavQ95 to the host PC. J13 is the Serial Download port used by UUU.
2. Connect a USB Type-C cable from DEBUG USB (J10) on the MR-NavQ95 to the host PC. This exposes two serial consoles, which are needed in step 4 to monitor the boot output.
3. Set the boot switches to Serial Downloader mode:
   `SW2[1:4]` = `1001`
4. Connect a 9–52 V DC power supply to the power input connector J9.
5. Verify the board is detected by UUU:

    ```sh
    ./uuu -lsusb
    ```

    An NXP i.MX95 device should be listed. If the device is not detected, check the USB cable and boot switch settings.

#### 3. Flash the Image

Navigate to the directory containing the `.wic` image and run UUU:

```sh
# Flash to eMMC
./uuu -b emmc_all imx-image-robotics-imx95-navq.rootfs-<timestamp>.wic.zst
# OR
# Flash to SD card
./uuu -b sd_all imx-image-robotics-imx95-navq.rootfs-<timestamp>.wic.zst
```

When flashing completes successfully, UUU will print `Done` and `Success 1`.

#### 4. Boot the Board

1. Set the boot switches to match the flashed media:
   - eMMC boot: `SW2[1:4]` = `0101`
   - SD card boot: `SW2[1:4]` = `1101`
2. The DEBUG USB port exposes two serial consoles — one for the Cortex-A (Linux) and one for the Cortex-M (RTOS). Open both on the host PC at 115200 baud, 8N1.
3. Power-cycle the board and monitor the boot output in both consoles.

Default Linux login: user / user

## Flashing the Cortex-M RTOS firmware

This section describes how to flash the M7 RTOS firmware to NOR flash on the MR-NavQ95 using the NXP-Robotics pyOCD fork.

For boot switch settings and connector locations, see [MR-NavQ95 Board Overview](hardware.md).

---

### Prerequisites

- Cortex-A image: The Cortex-A Linux image must be flashed to the board before flashing the Cortex-M firmware. See [Flashing the Cortex-A Linux Image](configuring-the-hardware.md#flashing-the-cortex-a-linux-image).
- Host PC: Ubuntu is required to run pyOCD. Other Linux distributions may work but are not tested.
- JTAG probe: A JTAG debug probe (e.g. NXP MCU-Link or J-Link) must be connected between the host PC and the MR-NavQ95 JTAG connector before flashing.
- Firmware image: Obtain the RTOS firmware as described in [Getting the Cortex-M RTOS Firmware](installing-software-tools.md#getting-the-cortex-m-rtos-firmware).

---

### Steps

#### 1. Install the pyOCD Fork

The i.MX95 target is not available in mainline pyOCD. Install the NXP-Robotics fork on the host PC:

```sh
git clone https://github.com/NXP-Robotics/pyOCD -b pr-imx95 && cd pyOCD

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

> Tested on Python 3.10 (Python 3.9 also works).

#### 2. Prepare the Board

1. Set the boot switches to the boot mode corresponding to the device where the Cortex-A image was written (eMMC or SD).
2. Connect a USB Type-C cable from DEBUG USB (J10) on the MR-NavQ95 to the host PC. This exposes two serial consoles - one for Cortex-A, one for Cortex-M.
3. Connect the JTAG probe between the host PC and the MR-NavQ95 JTAG connector (J7).
4. Apply 9–52 V DC to the power input connector J9.
5. Open both serial consoles and wait for the board to reach the Linux login prompt before proceeding.

#### 3. Flash the M7 Image to NOR

Run the following command on the host PC:

```sh
pyocd flash -t mimx95_cm7_mx25um --base-address 0x28020000 \
    nxp_imx95_default.mcuboot.bin -f 10m
```

| Parameter | Value |
|-----------|-------|
| Target | `mimx95_cm7_mx25um` |
| NOR base address | `0x28020000` |
| Flash clock | `10m` (10 MHz) |

> Note: Writing to NOR flash is not fully stable in the current release. Retry the `pyocd flash` command until pyOCD reports it programmed 0 pages, which confirms the flash contents match the binary.

> Note: The flash clock speed can be reduced from 10 MHz down to 4 MHz (4m) if multiple (> 5) failures occur.

> Note: In the unlikely event where the flashing fails with `flash init timed out [__main__]` multiple times, flashing using the CM33 AP may be attempted by following these steps:

> 1. Reboot the NavQ95 platform in Serial Downloader Mode, see [Serial Downloader mode (configuring-the-hardware.md#flashing-the-cortex-a-linux-image)]

> 2. Write the image to NOR FLASH  via the M33 core with `pyocd flash -t mimx95_cm33_mx25um --base-address 0x28020000 nxp_imx95_default.mcuboot.bin -f 10m`

> 3. Apply the same limitations as explained for the the CM7 direct write related to stability

#### 4. Reboot the Board and Open the M7 Console

After reboot, the M7 RTOS shell is accessible from Linux on `/dev/ttynsh` via the serial console:

```sh
picocom /dev/ttynsh
```
com /dev/ttynsh
```
