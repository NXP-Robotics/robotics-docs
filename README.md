# NXP Robotic Platforms SDK — Documentation

The NXP Robotic Platforms SDK provides validated software support for NXP's mobile-robotics
platforms — from board bring-up and firmware flashing to on-device AI, connectivity,
and robotics middleware. This portal collects the guides for each supported board.
They are organized per platform, and within each platform grouped by type —
User Manual, Application Note, and Quick Start — so the right document for
the board in use can be found quickly. Topics that apply across
several boards live under [`system/`](system/).

## Start here

- Setting up and building? Host setup, the Docker image, and the `west sdk build` /
  `west sdk download` flow live in the robotics-sdk repository:
  [robotics-sdk README](https://github.com/nxp-robotics/robotics-sdk/blob/robotics-0.7.0/README.md).
- Bringing up a board? Pick a platform below.
- Curious what changed? See the [Release Notes](reference/nxp-robotics-sdk-release-notes.md).

## Platforms

### MR-NavQ95

The i.MX 95 mobile-robotics vehicle computer.

- User Manual
  - [Hardware Overview](platforms/mr-navq95/user-manual/hardware.md)
  - [Get the Cortex-A Linux Image](platforms/mr-navq95/user-manual/get-cortex-a-image.md)
  - [Build the Cortex-A Linux Image](platforms/mr-navq95/user-manual/build-cortex-a-image.md)
  - [Flash the Cortex-A Linux Image](platforms/mr-navq95/user-manual/flash-cortex-a.md)
  - [Get the Cortex-M RTOS Firmware](platforms/mr-navq95/user-manual/get-cortex-m-image.md)
  - [Flash the Cortex-M RTOS Firmware](platforms/mr-navq95/user-manual/flash-cortex-m.md)
  - [Flashing Overview](platforms/mr-navq95/user-manual/flash-image.md)
  - [Device-Tree Overlays](platforms/mr-navq95/user-manual/dtb-overlays.md)
- Application Notes
  - [Camera](platforms/mr-navq95/application-notes/camera/index.md)
  - [Ethernet](platforms/mr-navq95/application-notes/ethernet/index.md)
  - [eIQ Neutron NPU](platforms/mr-navq95/application-notes/eiq-neutron-npu/index.md)
  - [ARA-240 DNPU](platforms/mr-navq95/application-notes/ara-240-dnpu/index.md)
- Middleware
  - [ROS 2 Setup](platforms/mr-navq95/middleware/ros2/ros2-setup.md)
  - [ROS 2 Multinode Communication](platforms/mr-navq95/middleware/ros2/ros2-multinode.md)

### MR-MCXN-T1

- Quick Start
  - [MR-MCXN-T1 Quick Start](platforms/mr-mcxn-t1/getting-started/mr-mcxn-t1-quick-start.md)

### MR-VMU-Tropic

- Quick Start
  - [MR-VMU-Tropic Quick Start](platforms/mr-vmu-tropic/getting-started/mr-vmu-tropic-quick-start.md)
- Flight Stack
  - [PX4 Documentation Reference](platforms/mr-vmu-tropic/flight-stack/px4/px4-documentation.md)

### MR-ESC-AM32

The AM32 electronic speed controller.

- User Manual — _to be added._

## System (cross-platform)

- [System Solution Application Note](system/system-solution-an/index.md)

## Reference

- [Release Notes](reference/nxp-robotics-sdk-release-notes.md)

## Repository layout

| Folder | Contents |
| --- | --- |
| [`platforms/`](platforms/) | Per-board documentation, grouped by document type (user manual, application notes, middleware, flight stack, quick start). |
| [`system/`](system/) | Cross-platform System Solution Application Note and other multi-board topics. |
| [`reference/`](reference/) | Release notes and other reference material. |
