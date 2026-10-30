# MR-VMU-Tropic — Deploy and Run Quick Start

MR-VMU-Tropic is a PX4/NuttX flight controller on an i.MXRT1064. Flash the bootloader and the application to external QSPI flash with LinkServer (MCU-Link). The two images go to fixed offsets in the RT1064 flash region.

## Get the artifacts first

Every platform assumes the images are already available — either downloaded or built with the SDK:

```sh
# prebuilt (fastest)
west sdk download --platform mr-vmu-tropic      # lands in <west topdir>/bin/mr-vmu-tropic/

# or build from source
west sdk build    --platform mr-vmu-tropic [...]  # lands in <west topdir>/{build,bin}/...
```

- Docker required. Downloading and building are done inside a Docker container built from the SDK's `Dockerfile` — see the [robotics-sdk README](https://github.com/nxp-robotics/robotics-sdk/blob/robotics-0.7.0/README.md) for how to set it up. All `west` commands are assumed to run inside that container.
- The SDK builds/downloads images but does not flash them — deployment is done with each platform's native tool.
- Where do the artifacts land? `<west topdir>` is the west workspace root — the directory containing `.west/`, created by `west init`. The `bin/` directory is created next to the `robotics-sdk/` clone, not inside it:

```
<west topdir>/
├── .west/
├── robotics-sdk/         <- the SDK clone (west init -l)
├── build/                <- west sdk build intermediates
└── bin/mr-vmu-tropic/       <- final artifacts land here
```

For MR-VMU-Tropic the platform is `mr-vmu-tropic`. Run `west sdk list` for the authoritative list.

## Artifacts

- `<west topdir>/bin/mr-vmu-tropic/nxp_mr-tropic_bootloader.bin` — bootloader (@ `0x70000000`)
- `<west topdir>/bin/mr-vmu-tropic/nxp_mr-tropic_default.bin` — application firmware (@ `0x70020000`)
- `<west topdir>/bin/mr-vmu-tropic/nxp_mr-tropic_default.px4` — PX4 firmware container (for QGroundControl / PX4 uploader)

## Flash with LinkServer

Use this route for the initial bring-up — it programs the PX4 bootloader (needed only once, on a blank board) and, optionally, a first application image directly to QSPI. Once the bootloader is present, prefer the [PX4 firmware upload](#flash-the-px4-application-recommended) route below for routine application updates.

1. Flash the bootloader (first time / blank board)

   ```sh
   LinkServer flash MIMXRT1064xxxxA:EVK-MIMXRT1064 load \
       --addr 0x70000000 nxp_mr-tropic_bootloader.bin
   ```

2. Flash the application

   ```sh
   LinkServer flash MIMXRT1064xxxxA:EVK-MIMXRT1064 load \
       --addr 0x70020000 nxp_mr-tropic_default.bin
   ```

3. Reset & run

   Reset the board; the bootloader chainloads the app at `0x70020000`.

## Flash the PX4 application (recommended)

Once the PX4 bootloader is on the board, PX4 firmware is delivered as a `.px4` container (`nxp_mr-tropic_default.px4`) and uploaded over USB — no debug probe needed. The board's PX4 bootloader accepts the upload when the board is (re)connected; the uploader waits for it and resets automatically.

- With QGroundControl (easiest):
  1. Open QGroundControl → Vehicle Setup → Firmware.
  2. Unplug the board, then plug it back in over USB when prompted.
  3. Choose Advanced settings → Custom firmware file, select `nxp_mr-tropic_default.px4`, and let QGroundControl flash and reboot the board.

- With the PX4 command-line uploader (from a PX4-Autopilot source tree, useful for CI/scripting):

  ```sh
  python3 src/drivers/bootloaders/scripts/px_uploader.py \
      --port /dev/ttyACM0 nxp_mr-tropic_default.px4
  ```

  Replace `/dev/ttyACM0` with the board's serial port (`COMx` on Windows). Unplug/replug the board when the uploader reports it is waiting for the bootloader.

> ℹ️ The `.px4` container carries the same signed application as `nxp_mr-tropic_default.bin`; use the `.px4` upload path for day-to-day PX4 updates and the LinkServer `.bin` path only when it is necessary to (re)install the bootloader or recover a bricked board.

## Erase all flash (recovery)

```sh
LinkServer flash MIMXRT1064xxxxA:EVK-MIMXRT1064 erase
```

Use this to wipe the QSPI flash before a clean re-flash.

## Zephyr

The MR-VMU-Tropic platform also publishes Zephyr sample images for board bring-up and peripheral checks:

```
<west topdir>/bin/mr-vmu-tropic/zephyr/<sample>/zephyr.bin
```

where `<sample>` is any one of `hello_world`, `gpio`, `bmi08x_icm45686`, `bmm350`, `bmp390`, `pwmLED`, `can`, `sdcard`, `dhcpv4_client`, `usb`, `watchdog`, `rtc`.

Flash one with the same LinkServer command, at the flash base:

```sh
LinkServer flash MIMXRT1064xxxxA:EVK-MIMXRT1064 load \
    --addr 0x70000000 zephyr.bin
```
