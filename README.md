# NXP Robotics SDK — Documentation

The NXP Robotics SDK provides validated software support for NXP's mobile-robotics
platforms — from board bring-up and firmware flashing to on-device AI, connectivity,
and robotics middleware. This portal collects the guides for each supported board.
They are organized per platform, and within each platform grouped by type —
Overview, User Manual, Application Notes, Middleware, Flight Stack, and Quick Start —
so the right document for the board in use can be found quickly. Topics that apply
across several boards live under [`system/`](system/).

## Start here

- Setting up and building? Host setup, the Docker image, and the `west sdk build` /
  `west sdk download` flow live in the robotics-sdk repository:
  [robotics-sdk README](https://github.com/nxp-robotics/robotics-sdk/blob/robotics-0.7.0/README.md).
- Bringing up a board? Pick a platform below.
- Curious what changed? See the [Release Notes](reference/nxp-robotics-sdk-release-notes.md).

## Platforms

### MR-NavQ95

The i.MX 95 mobile-robotics vehicle computer.

- [Overview](platforms/mr-navq95/overview.md)
- Quick Start
  - [MR-NavQ95 Quick Start](platforms/mr-navq95/getting-started/mr-navq95-quick-start.md)
- User Manual
  - [Introduction](platforms/mr-navq95/user-manual/introduction.md)
  - [Finding platform resources](platforms/mr-navq95/user-manual/finding-resources.md)
  - [Getting ready](platforms/mr-navq95/user-manual/getting-ready.md)
  - [Hardware Overview](platforms/mr-navq95/user-manual/hardware.md)
  - [Installing and configuring software tools](platforms/mr-navq95/user-manual/installing-software-tools.md)
  - [Configuring the hardware](platforms/mr-navq95/user-manual/configuring-the-hardware.md)
  - [Abbreviations](platforms/mr-navq95/user-manual/abbreviations.md)
  - [References](platforms/mr-navq95/user-manual/references.md)
- Application Notes
  - [Hardware Architecture and Reference Design](platforms/mr-navq95/application-notes/hardware-overview/index.md)
  - [Camera](platforms/mr-navq95/application-notes/camera/index.md)
  - [Ethernet](platforms/mr-navq95/application-notes/ethernet/index.md)
  - [eIQ Neutron NPU](platforms/mr-navq95/application-notes/eiq-neutron-npu/index.md)
  - [ARA-240 DNPU](platforms/mr-navq95/application-notes/ara-240-dnpu/index.md)
  - [Cellular Modem](platforms/mr-navq95/application-notes/modem/index.md)
  - [Remote ID Transmitter](platforms/mr-navq95/application-notes/remote-id-transmitter/bluetooth-remote-id-transmitter.md)
- Middleware
  - [ROS 2 Setup](platforms/mr-navq95/middleware/ros2/ros2-setup.md)
  - [ROS 2 Multinode Communication](platforms/mr-navq95/middleware/ros2/ros2-multinode.md)

### MR-VMU-Tropic

The i.MX RT1064 flight management unit.

- [Overview](platforms/mr-vmu-tropic/overview.md)
- Quick Start
  - [MR-VMU-Tropic Quick Start](platforms/mr-vmu-tropic/getting-started/mr-vmu-tropic-quick-start.md)
- User Manual
  - [Introduction](platforms/mr-vmu-tropic/user-manual/introduction.md)
  - [Finding platform resources](platforms/mr-vmu-tropic/user-manual/finding-resources.md)
  - [Getting ready](platforms/mr-vmu-tropic/user-manual/getting-ready.md)
  - [Hardware Overview](platforms/mr-vmu-tropic/user-manual/hardware.md)
  - [Configuring the hardware](platforms/mr-vmu-tropic/user-manual/configuring-the-hardware.md)
  - [Abbreviations](platforms/mr-vmu-tropic/user-manual/abbreviations.md)
  - [References](platforms/mr-vmu-tropic/user-manual/references.md)
- Application Notes
  - [Hardware Architecture and Reference Design](platforms/mr-vmu-tropic/application-notes/hardware-overview/index.md)
  - [Programming Boot Configuration Fuses](platforms/mr-vmu-tropic/application-notes/fuse-programming/index.md)
- Flight Stack
  - [PX4 Documentation Reference](platforms/mr-vmu-tropic/flight-stack/px4/px4-documentation.md)

### MR-MCXN-T1

The MCXN947 intelligent T1 sensor/IO node.

- [Overview](platforms/mr-mcxn-t1/overview.md)
- Quick Start
  - [MR-MCXN-T1 Quick Start](platforms/mr-mcxn-t1/getting-started/mr-mcxn-t1-quick-start.md)
- User Manual
  - [Introduction](platforms/mr-mcxn-t1/user-manual/introduction.md)
  - [Finding platform resources](platforms/mr-mcxn-t1/user-manual/finding-resources.md)
  - [Getting ready](platforms/mr-mcxn-t1/user-manual/getting-ready.md)
  - [Hardware Overview](platforms/mr-mcxn-t1/user-manual/hardware.md)
  - [Configuring the hardware](platforms/mr-mcxn-t1/user-manual/configuring-the-hardware.md)
  - [Abbreviations](platforms/mr-mcxn-t1/user-manual/abbreviations.md)
  - [References](platforms/mr-mcxn-t1/user-manual/references.md)
- Application Notes
  - [Hardware Architecture and Reference Design](platforms/mr-mcxn-t1/application-notes/hardware-overview/index.md)
  - [Zenoh Communication](platforms/mr-mcxn-t1/application-notes/zenoh/index.md)

### MR-ESC-AM32

The MCXA133 AM32-based electronic speed controller.

- [Overview](platforms/mr-esc-am32-mcxa133/overview.md)
- Quick Start
  - [MR-ESC-AM32 Quick Start](platforms/mr-esc-am32-mcxa133/getting-started/mr-esc-am32-mcxa133-quick-start.md)
- User Manual
  - [Introduction](platforms/mr-esc-am32-mcxa133/user-manual/introduction.md)
  - [Finding platform resources](platforms/mr-esc-am32-mcxa133/user-manual/finding-resources.md)
  - [Getting ready](platforms/mr-esc-am32-mcxa133/user-manual/getting-ready.md)
  - [Hardware Overview](platforms/mr-esc-am32-mcxa133/user-manual/hardware.md)
  - [Board components](platforms/mr-esc-am32-mcxa133/user-manual/board-components.md)
  - [Firmware features](platforms/mr-esc-am32-mcxa133/user-manual/firmware-features.md)
  - [Installing and configuring software tools](platforms/mr-esc-am32-mcxa133/user-manual/installing-software-tools.md)
  - [Configuring the hardware](platforms/mr-esc-am32-mcxa133/user-manual/configuring-the-hardware.md)
  - [Abbreviations](platforms/mr-esc-am32-mcxa133/user-manual/abbreviations.md)
  - [References](platforms/mr-esc-am32-mcxa133/user-manual/references.md)
- Application Notes
  - [Hardware Architecture and Reference Design](platforms/mr-esc-am32-mcxa133/application-notes/hardware-overview/index.md)

## System (cross-platform)

- [System Level Integration Guide](system/system-solution-an/index.md)

## Reference

- [Release Notes](reference/nxp-robotics-sdk-release-notes.md)

## Repository layout

| Folder | Contents |
| --- | --- |
| [`platforms/`](platforms/) | Per-board documentation, grouped by document type (overview, user manual, application notes, middleware, flight stack, quick start). |
| [`system/`](system/) | Cross-platform System Level Integration Guide and other multi-board topics. |
| [`reference/`](reference/) | Release notes and other reference material. |
| [`cheatsheets/`](cheatsheets/) | Printable board cheat sheets referenced from the hardware overviews. |
| [`release-notes/`](release-notes/) | Bundled component release notes (for example, the ARA software release notes). |
