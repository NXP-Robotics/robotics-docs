# Getting ready

Because the MR-MCXN-T1 Hub is intended to demonstrate 100BASE-T1 connectivity, it must be connected to a host system that supports 100BASE-T1 Ethernet. In a typical setup, this may be an MR-NavQ95 running Linux, but other systems such as the MR-VMU-RT1176 running PX4 or Zephyr can also be used. 100BASE-T1 is the physical Ethernet interface; above that layer, it behaves like standard 100BASE-T Ethernet. For development with a PC or another system that only provides RJ45 Ethernet, an adapter such as the RDDRONE-T1ADAPT can convert between standard 100BASE-T and 2-wire 100BASE-T1.

## Kit contents

- MR-MCXN-T1 Hub

## Additional hardware

The following shields are designed to work with the MR-MCXN-T1 Hub:

- MR-MCXN-T1-IO: input/output shield with Dronecode standard connectors
- MR-MCXN-T1-F9P: GPS/GNSS shield with RTK capability
- MR-MCXN-T1-OFL: optical-flow shield with a distance sensor and optical-flow measurement

## Assumptions

Familiarity with 100BASE-T1 Ethernet is helpful but not required.

## Minimum system requirements

Working with the MR-MCXN-T1 Hub requires one of the following host setups:

- A host device or system such as the MR-NavQ95 running ROS 2 and natively supporting 100BASE-T1 Ethernet
- A host device or system running ROS 2 and using an adapter such as the RDDRONE-T1ADAPT to support 100BASE-T1 Ethernet
- A PC together with an RDDRONE-T1ADAPT, which converts between RJ45-based 100BASE-T and 2-wire 100BASE-T1

## Software

Software for the MR-MCXN-T1 Hub and supported shields is provided through the NXP Robotic Platforms SDK. Follow the SDK instructions to prepare the Hub and configure the specific shield being used.

The same enablement is also expected to be visible upstream in Zephyr, including shield overlays for the example shield boards. For more background, see [Software enablement framework](introduction.md#software-enablement-framework) and the [Introduction](introduction.md).

The following software is used with the MR-MCXN-T1 Hub:

- Zephyr development environment
- A PC with ROS 2 Jazzy or later
