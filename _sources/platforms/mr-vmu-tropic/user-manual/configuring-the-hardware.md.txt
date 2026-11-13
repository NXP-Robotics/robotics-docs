# Configuring the hardware


The MR-VMU-Tropic is flashed in two stages: the PX4 bootloader is programmed once to the external QSPI flash with a debug probe, after which the PX4 application is updated over USB without a probe.

## Chip Fuse Programming

This step is not required for EVK boards, as their fuses are already programmed.

A newly manufactured board, or any board containing a new unprogrammed processor, requires the device fuses to be programmed as part of initial bring-up. Fuse configuration and the associated programming procedure are covered in the [Programming boot configuration fuses on MR-VMU-Tropic](../application-notes/fuse-programming/index.md) application note.

## Programming the bootloader (first time)

On a blank board, use a LinkServer-compatible probe (MCU-Link) on the Dronecode debug connector to program the bootloader, and optionally a first application image, to fixed offsets in the RT1064 QSPI flash region. This route is used for the initial bring-up and for recovering a bricked board.

## Updating the PX4 application (routine)

Once the bootloader is present, the PX4 firmware is delivered as a `.px4` container and uploaded over USB, with no debug probe required. The board's PX4 bootloader accepts the upload when the board is reconnected; both QGroundControl and the PX4 command-line uploader drive this automatically. This is the day-to-day update path.

## Recovery

The QSPI flash can be fully erased with the debug probe before a clean re-flash.

The exact LinkServer commands, flash offsets, PX4 upload steps, and the Zephyr sample images are listed in the [Deploy and Run Quick Start](../getting-started/mr-vmu-tropic-quick-start.md).

## Running the flight stack

The MR-VMU-Tropic runs the PX4 flight stack on the NuttX RTOS. Once the board is flashed, PX4 is configured and operated through QGroundControl in the same way as any other PX4 vehicle management unit: airframe selection, sensor calibration, radio and flight-mode setup, and parameter tuning.

The board's communication and actuation interfaces used by the flight stack — telemetry, GPS and safety, RC / ELRS inputs, CAN-FD / DroneCAN, 100BASE-T1 Ethernet, and the ESC outputs — are described in the [Hardware Overview](hardware.md) and the [MR-VMU-Tropic Hardware Architecture and Reference Design](../application-notes/hardware-overview/index.md).

For the PX4 build, boot, and usage details, see the [PX4 documentation reference](../flight-stack/px4/px4-documentation.md).
