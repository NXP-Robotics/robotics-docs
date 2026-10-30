# MR-NavQ95 overview

The MR-NavQ95 is the vehicle-computer reference design of the NXP Mobile Robotics family. It
provides a single, compact compute platform for drones and mobile robots that combines a
high-performance application processor, a real-time control core, on-device AI acceleration, and
automotive-grade connectivity. The board is intended as a starting point for customers building
their own autonomous-vehicle products: it integrates the main NXP building blocks of a robotics
compute node so that bring-up, perception, and robotics middleware can be evaluated and reproduced
on validated hardware.

At its core is the NXP i.MX 95 applications processor, a heterogeneous multicore SoC built around
six Arm Cortex-A55 application cores, a Cortex-M7 real-time core, and a Cortex-M33 System Manager,
together with the on-chip NXP Neutron neural processing unit (NPU) for machine-learning inference.
The Cortex-A55 cores run the Linux compute stack and robotics middleware, while the Cortex-M7 core
handles hard real-time control, so a single device covers both the application and the real-time
domains of a robot.

## Functional block diagram

<figure>
  <img src="resources/mr-navq95-block-diagram.png" alt="MR-NavQ95 functional block diagram" width="840">
</figure>

Figure 1. MR-NavQ95 functional block diagram

## Main components

The reference design integrates the following main NXP components and interfaces:

- i.MX 95 applications processor (Cortex-A55 compute, Cortex-M7 real-time, Cortex-M33 System Manager, Neutron NPU)
- LPDDR memory, eMMC, octal-SPI flash, and a microSD slot
- NXP wireless connectivity for Wi-Fi, Bluetooth, and Matter
- NXP 802.15.4 radio for Thread and Zigbee
- On-board inertial, magnetometer, and barometric sensors
- Gigabit Ethernet, plus automotive 100BASE-T1 Ethernet through the NXP SJA1110 switch and TJA1120 / TJA1103 PHYs on the T1 expansion board
- Camera expansion board with MIPI CSI-2 inputs
- IO expansion board with CAN-FD, PWM, SPI, I2C, SAI, and quadrature-decoder interfaces for drone and rover control
- Two PCIe M.2 slots for storage or discrete NPU acceleration

NXP also provides the complete hardware Bill of Materials and design files, enabling customers to
evaluate, reproduce, and customize the reference platform for their own products.

For overview information, documentation, software, tools, and ordering details, see the
[MR-NavQ95 product page](https://www.nxp.com/design/design-center/development-boards-and-designs/ai-powered-autonomy-compute-flight-controller:MR-NAVQ95)
on the NXP web site.
