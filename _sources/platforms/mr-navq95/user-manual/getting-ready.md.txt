# Getting ready


Working with the MR-NavQ95 requires the board, a host PC, a debug probe, and the images produced or downloaded through the NXP Robotic Platforms SDK.

## Kit contents

- MR-NavQ95 vehicle-computer board

## Additional hardware

- A JTAG debug probe (NXP MCU-Link or J-Link) for programming the Cortex-M RTOS firmware
- A USB Type-C cable for the serial-download port (USB1 / J13)
- A USB Type-C cable for the debug console (DEBUG USB / J10)
- A 9 V to 52 V DC power supply (3S to 12S battery) for the power input connector (J9)

## Assumptions

Familiarity with embedded Linux, U-Boot, and flashing tools is helpful but not required.

## Minimum system requirements

- An Ubuntu PC is assumed for all host-side steps.
- For building the Linux image from source: Ubuntu 22.04 or later, at least 300 GB of free disk space, and 16 GB of RAM (minimum recommended).

## Software

The images and build tooling are provided through the NXP Robotic Platforms SDK, which runs inside a Docker container. The SDK produces the Cortex-A Linux image and the Cortex-M RTOS firmware for the board.
