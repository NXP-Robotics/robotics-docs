# MR-ESC-AM32 — Deploy and Run Quick Start

MR-ESC-AM32 is an [AM32](https://github.com/am32-firmware/AM32) BLDC ESC running on an MCXA133 MCU. Flash the bootloader and the application with LinkServer (MCU-Link-MR) or Segger J-Link, then configure the ESC over a pass-through serial link.

## Get the artifacts first

Every platform assumes the images are already available — either downloaded or built with the SDK:

```sh
# prebuilt (fastest)
west sdk download --platform mr-esc-am32-mcxa133      # lands in <west topdir>/bin/mr-esc-am32-mcxa133/

# or build from source
west sdk build    --platform mr-esc-am32-mcxa133 [...]  # lands in <west topdir>/{build,bin}/...
```

- Docker required. Downloading and building are done inside a Docker container built from the SDK's `Dockerfile` — see the [NXP Robotic Platforms SDK README](https://github.com/NXP-Robotics/robotics-sdk/blob/robotics-0.7.0/README.md) for how to set it up. All `west` commands are assumed to run inside that container.
- The SDK builds/downloads images but does not flash them — deployment is done with the board's native tool.
- Where do the artifacts land? `<west topdir>` is the west workspace root — the directory containing `.west/`, created by `west init`. The `bin/` directory is created next to the `robotics-sdk/` clone, not inside it:

```
<west topdir>/
├── .west/
├── robotics-sdk/         <- the SDK clone (west init -l)
├── build/                <- west sdk build intermediates
└── bin/mr-esc-am32-mcxa133/       <- final artifacts land here
```

For MR-ESC-AM32 the platform is `mr-esc-am32-mcxa133`. Run `west sdk list` for the authoritative list.

## What to flash

The AM32 stack produces two images. The bootloader is programmed once; during normal development only the application image needs to be updated. On a blank device both images must be flashed (bootloader + application) together.

The AM32 version is kept in the filename, so the exact version suffix depends on the release that is built or downloaded:

| Image | Artifact (in `bin/mr-esc-am32-mcxa133/`) |
|-------|------------------------------------------|
| AM32 bootloader | `AM32_A153_BOOTLOADER_PB2_V18.hex` |
| AM32 application | `AM32_FRDM_A153_2.20.hex` |

`.bin` and `.elf` variants are collected alongside each `.hex`. The `.hex` files carry their own load addresses, so no explicit flash address is needed when flashing them.

> ℹ️ The version suffix (`_V18`, `_2.20` above) tracks the AM32 release; substitute the version that was actually built or downloaded in the flash commands below. Run `west sdk list` and inspect `bin/mr-esc-am32-mcxa133/` for the exact filenames present.


> ℹ️ At this time the bootloader must not be trusted to load a new main-application firmware into flash; it is used to load configuration parameters into the MCXA EEPROM/flash. Always re-flash the application image directly with LinkServer or J-Link.

## Connect

- MCU-Link-MR / MCU-Link-Pro (or Segger J-Link) to the ESC's SWD debug connector — used for flash.
  > ⚠️ The NXP MCU-Link-MR cable differs from the J-Link cable: NXP requires pin 3 NOT connected (connectors are otherwise identical). Using the wrong cable will fail to connect.
- For ESC configuration, a flight controller flashed in pass-through mode exposes the ESC as a USB/serial port on the host PC (see the Configure the ESC section below).

## Flash with LinkServer

Device name: `MCXA133` (interface SWD, speed 4000 kHz).

1. Flash the bootloader (first time / blank device)

   ```sh
   LinkServer flash MCXA133 load AM32_A153_BOOTLOADER_PB2_V18.hex
   ```

2. Flash the application

   ```sh
   LinkServer flash MCXA133 load AM32_FRDM_A153_2.20.hex
   ```

   On Windows the LinkServer path is e.g. `C:\NXP\LinkServer_<ver>\LinkServer.exe`.

3. Reset & run

   Reset the ESC; the bootloader chainloads the AM32 application.

## Flash with Segger J-Link (alternative)

Run `JLink.exe -CommanderScript temp.jlink`, where `temp.jlink` contains:

```
device MCXA133
si SWD
speed 4000
connect
r
h
erase
loadfile AM32_FRDM_A153_2.20.hex
r
g
exit
```

Repeat with `loadfile AM32_A153_BOOTLOADER_PB2_V18.hex` to program the bootloader on a blank device.

## Configure the ESC

The ESC needs calibration/config to match the motor and the flight controller / RC receiver.

1. Flash a flight controller in pass-through mode so the ESC enumerates as a USB/serial port on the PC.
2. Open the [AM32 web configurator](https://am32.ca/configurator) (or use `SerialPortConnector.exe`) and connect to that port.
3. If a config error appears after a full-erase flash, load the default configuration and save to flash, then set the relevant parameters — e.g. motor KV (motor-dependent, ~960) and input signal DShot or PWM.
4. Make sure the flight controller / RC receiver output signal matches the ESC's configured input:
   - Configure the FC to send PWM or DShot from QGroundControl, or set the signal in the TX unit for a direct RC-receiver connection.

> ⚠️ Watch connector polarity when switching between the i.MX RT1176 VMU (GND pin on the top side) and an RC RX unit (GND may be on the bottom side).

