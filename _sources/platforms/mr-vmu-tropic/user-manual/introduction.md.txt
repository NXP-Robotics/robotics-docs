# Introduction

The MR-VMU-Tropic is the flight-controller (vehicle management unit) reference design of the NXP Mobile Robotics family. It is a PX4 / NuttX autopilot built around an NXP i.MX RT1064 crossover MCU, providing the real-time flight-control and I/O functions of a drone or mobile robot. The board is intended as a validated flight-controller starting point that customers can evaluate, reproduce, and adapt for their own vehicles.

The i.MX RT1064 is an NXP crossover MCU based on an Arm Cortex-M7 core with integrated flash and an on-chip real-time clock. It runs the PX4 flight stack on the NuttX RTOS and drives the motor outputs, sensor interfaces, and communication links required for autonomous flight and motion control.

This user manual describes the board hardware, how to prepare the firmware images, how to flash the board, and how to run the flight stack. The connector pinouts and on-board devices are documented in the [Hardware Overview](hardware.md); the hardware architecture is described in the [MR-VMU-Tropic Hardware Architecture and Reference Design](../application-notes/hardware-overview/index.md).

## NXP Robotic Platforms SDK and upstream open-source software

NXP embraces an open-source development model and actively participates in the communities behind the software used by this product. The NXP Robotic Platforms SDK provides a curated and validated set of software components, tools, and documentation that have been tested together on this hardware platform.

NXP regularly contributes improvements and fixes back to upstream repositories. Because contributions are made on a scheduled basis, the latest upstream code and the version included in the NXP Robotic Platforms SDK may not always be identical. The SDK release is recommended for users seeking a tested and supported configuration, while advanced users may choose to work directly with the upstream project and its latest features.
