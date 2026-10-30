# Introduction


This user manual covers the MR-MCXN-T1 Hub and the following add-on boards:

- MR-MCXN-T1-IO: input/output shield with Dronecode standard connectors
- MR-MCXN-T1-F9P: GPS/GNSS shield with RTK capability
- MR-MCXN-T1-OFL: optical-flow shield with a distance sensor and optical-flow measurement

## MR-MCXN-T1 Hub

The MR-MCXN-T1 node board, also referred to as the MR-MCXN-T1 Hub, is a compact, open hardware reference design for distributed sensing, connectivity, and edge processing in mobile robotics systems. It is based on the cost-effective MCXN947 microcontroller and is intended to act as an intelligent 100BASE-T1 Ethernet sensor and actuator node. Supported example shield designs are provided to demonstrate several I/O use cases.

The design demonstrates the convenience of a single-connector sensor node that carries both raw battery power and 2-wire 100BASE-T1 Ethernet to a compact edge device. This simplifies distributed sensor placement on a robot by reducing wiring, keeping local processing close to the sensor, and sending data to a flight controller, companion computer, or ROS 2 system over Ethernet.

The design intent is to provide a seamless Ethernet-connected node for roboticists using ROS 2, and it can be thought of as the physical embodiment of a ROS 2 node.

## NXP Robotic Platforms SDK and upstream open-source software

NXP embraces an open-source development model and actively participates in the communities behind the software used by this product. The NXP Robotic Platforms SDK provides a curated and validated set of software components, tools, and documentation that have been tested together on this hardware platform.

NXP regularly contributes improvements and fixes back to upstream repositories. Because contributions are made on a scheduled basis, the latest upstream code and the version included in the NXP Robotic Platforms SDK may not always be identical. The SDK release is recommended for users seeking a tested and supported configuration, while advanced users may choose to work directly with the upstream project and its latest features.

## Software enablement framework

The software enablement framework uses Zephyr on the MCU and separates local driver work from ROS-oriented data exchange. It provides a path for sensor and actuator data to move between the MR-MCXN-T1 node and a ROS 2-based host system over 100BASE-T1 Ethernet.

### ZROS library

NXP is introducing ZROS as a new open-source library that provides the ROS-oriented topic layer on the MCU. It supports preparing, formatting, inspecting, and exchanging sensor or actuator data in a way that feels similar to working with ROS 2 topics on a Linux host. It also includes an efficient zero-copy buffer mechanism.

#### Data representation

ZROS uses FlatBuffers (FBS) internally for efficient MCU-side data handling. For ROS 2 interoperability, ZROS can statically pack this data into the CDR representation generated from the ROS 2 IDL definitions. Users normally work through this default ROS 2-compatible path. Customers requiring high performance scenarios can use FlatBuffers instead.

### Zenoh-pico

Zenoh-pico provides the transport and routing layer used to move data between the MCU node and the rest of the robotics system.

### Developer focus

With this framework in place, the MCU developer can focus primarily on writing the sensor or actuator drivers and moving the required data to or from the specific device.
