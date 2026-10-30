# Getting ready

Before flashing and running the MR-VMU-Tropic, prepare the firmware images and the tools used to deploy them.

## Firmware images

The firmware for the MR-VMU-Tropic is provided through the NXP Robotic Platforms SDK, which builds and downloads the images inside a Docker container. The SDK produces three artifacts for the board:

- a bootloader image,
- the PX4 application firmware (a raw binary), and
- the PX4 firmware container that QGroundControl and the PX4 uploader accept.

In addition, the SDK publishes a set of Zephyr sample images for board bring-up and peripheral checks.

Obtaining or building the images with the SDK is covered in the [Deploy and Run Quick Start](../getting-started/mr-vmu-tropic-quick-start.md).

## Tools

- A LinkServer-compatible debug probe (MCU-Link) for the initial bootloader programming over the Dronecode debug connector.
- QGroundControl, or the PX4 command-line uploader, for routine PX4 application updates over USB.
- A USB-C cable for the console and PX4 firmware uploads.

The debug connector and USB-C port locations are shown in the [Hardware Overview](hardware.md#power-and-debug).
