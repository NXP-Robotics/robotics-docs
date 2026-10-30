# Introduction

An electronic speed controller (ESC) is a (relatively) high-voltage/high-current electronic device used to control the angular speed (measured in rotations per minute, RPM) and torque of a DC electric motor.

The MR-ESC-AM32 is NXP's implementation of the open-source AM32 (Alka Motors) electronic speed controller (ESC), built with NXP devices and compatible with the original design. It is based on the MCXA133 microcontroller.

AM32 is open-source GPL-3.0 brushless motor controller (ESC) firmware for Arm Cortex-M MCUs, designed for multirotor drones, fixed-wing aircraft, and ground vehicles such as buggies, rovers, and crawlers. It is intended to be controlled by a flight controller, such as the MR-VMU-RT1176 or MR-VMU-TROPIC, rather than used as a standalone controller.

The design includes an addressable RGB LED and solder pads for adding additional LEDs. This is useful on drones where the ESC and lighting are both located at the vehicle corners, allowing the LEDs to indicate status or orientation.

## NXP Robotic Platforms SDK and upstream open-source software

NXP embraces an open-source development model and actively participates in the communities behind the software used by this product. The NXP Robotic Platforms SDK provides a curated and validated set of software components, tools, and documentation that have been tested together on this hardware platform.

NXP regularly contributes improvements and fixes back to upstream repositories. Because contributions are made on a scheduled basis, the latest upstream code and the version included in the NXP Robotic Platforms SDK may not always be identical. The SDK release is recommended for users seeking a tested and supported configuration, while advanced users may choose to work directly with the upstream project and its latest features.
