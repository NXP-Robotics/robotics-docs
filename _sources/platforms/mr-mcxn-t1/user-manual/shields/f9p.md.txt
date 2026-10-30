# MR-MCXN-T1-F9P GPS/GNSS RTK shield

The MR-MCXN-T1-F9P is a GPS/GNSS shield for the MR-MCXN-T1 Hub, built around a u-blox F9P receiver with Real-Time Kinematic (RTK) capability. It lets the node provide high-accuracy positioning data to a flight controller, companion computer, or ROS 2 system over the 100BASE-T1 Ethernet fabric.

## MR-MCXN-T1-F9P hardware overview

> Note: The detailed hardware overview for this shield — board description, antenna requirements, connectors, and pinouts — is still being prepared and will be added here.

## MR-MCXN-T1-F9P setup and configuration

The shield is enabled through the NXP Robotic Platforms SDK. The MR-MCXN-T1-F9P maps to the `gnss` application and its matching shield overlay, which the SDK injects automatically when building for this configuration. See the [MR-MCXN-T1 Deploy and Run Quick Start](../../getting-started/mr-mcxn-t1-quick-start.md) for the build and flash workflow.

> Note: GNSS/RTK setup, antenna connection, and configuration guidance for this shield is still being prepared and will be added here.
