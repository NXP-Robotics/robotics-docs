

# ROS2 Multinode on NavQ95

## Overview

This guide covers ROS2 communication between NavQ95 and other platforms in a multi-node setup. It describes the supported topologies, the required configuration, and how to verify the communication.

## Topology

```
                              ┌───────────────────────────────────────────────────────────┐
                              │                                                     NAVQ95│
                              │ ┌───────────────────────────────────────────────────────┐ │
                              │ │                                             NAVQ95-A55│ │
┌───────────────┐             │ │ ┌────────────────┐                 ┌────────────────┐ │ │
│    MCXN-T1    │             │ │ │                │                 │   ROS2 CLI     │ │ │
│   zenoh-pico  │──[A]─TCP─────>│ │  zenohd (RTR)  │──[B]─TCP───────>│  rmw-zenoh-cpp │ │ │
│               │──[C]─TCP─┐  │ │ │                │                 │                │ │ │
└───────────────┘          │  │ │ └────────────────┘                 └────────────────┘ │ │
                           │  │ └───────────────────────────────────────────────────────┘ │
                           │  │                                                           │
                           │  │                                    ┌────────────────────┐ │
                           │  │                                    │           NAVQ95-M7│ │
                           │  │                                    │ ┌────────────────┐ │ │
                           │  │                                    │ │  PX4           │ │ │
                           └──────────────────────────────────────>│ │ zenoh-pico     │ │ │
                              │                                    │ │                │ │ │
                              │                                    │ └────────────────┘ │ │
                              │                                    └────────────────────┘ │
                              └───────────────────────────────────────────────────────────┘
                              [A] [B] - Zenoh over TCP (client/server mode)
                              [C]     - Zenoh over TCP (peer to peer mode)
```

## Architecture

ROS2 multinode communication on NavQ95 is based on [Zenoh](https://zenoh.io/) as the underlying transport. The key components are:

- zenohd — the Zenoh router. Acts as the central broker: all participants connect to it and it routes messages between them.
- rmw_zenoh_cpp — the ROS2 RMW (ROS Middleware) implementation that bridges ROS2 nodes to the Zenoh transport. ROS2 nodes are unaware of Zenoh — `rmw_zenoh_cpp` handles the translation transparently.
- zenoh-pico — a lightweight Zenoh client library targeting resource-constrained platforms. Supports multiple physical transports (TCP, serial, and others).

The topology described in this guide uses Zenoh over TCP as the transport between MCXN-T1 and NavQ95, with `zenohd` and ROS2 CLI running on the NavQ95 A55, and PX4 running on the NavQ95 M7. Interoperability is possible because `zenoh-pico` publishes messages in the same wire format that `rmw_zenoh_cpp` expects — no dedicated translation layer is required on any of the participants.

---

## Enabling and Validating MCXN-T1 → NavQ95 A55 Communication

### Prerequisites

- NavQ95 with `imx-image-robotics` image deployed and booted
- MCXN-T1 with GNSS, OFLO, or IO application flashed
- Both connected to the same network over T1 Ethernet

---

### Configuration

Step 1 — NavQ95 A55: ROS2 setup

> Important: The complete ROS2 setup for the NavQ95 A55 is documented in [ROS2 Setup](./ros2-setup.md).

ROS2 Jazzy and the Zenoh RMW must be installed and configured on the NavQ95 A55 before enabling multinode communication.

For this topology the one package that must be present is `px4_msgs` — the ROS2 message definitions for the PX4 topics published by MCXN-T1 (i.e. OFLO sensor), needed on the A55 side to subscribe to these topics. The full package set is not required — install just this one with:

```bash
install_ros2_pkgs px4_msgs
```

The branch installed must match the message definitions on the MCXN-T1. To use a different branch than the default, override it before running:

```bash
export ROS2PKG_PX4_MSGS_VERSION=<px4_msgs-release-branch>
install_ros2_pkgs px4_msgs
```

> Note: The `px4_msgs` build may take several minutes on the NavQ95 A55.

Step 2 — NavQ95 A55: configure T1 Ethernet interface

The T1 Ethernet link between MCXN-T1 and NavQ95 does not use DHCP — a static IP address must be assigned manually to the NavQ95 A55 interface.

```bash
sudo ip addr add <NAVQ95_IP>/<PREFIX> dev <eth_iface>
sudo ip link set <eth_iface> up
```

Known issues:

If MCXN-T1 is connected to one of the `trx1-trx6` interfaces via `end1` through the SJA-switch path, apply the following fixes:

- Prevent NetworkManager from managing the SJA switch interfaces (avoids it overwriting the configured IP addresses):

```bash
# Create 99-trx-unmanaged.conf file and fill-in the following
sudo tee /etc/NetworkManager/conf.d/99-trx-unmanaged.conf > /dev/null <<'EOF'
[device-trx-unmanaged]
match-device=interface-name:trx1;interface-name:trx2;interface-name:trx3;interface-name:trx4;interface-name:trx5;interface-name:trx6
managed=0
EOF

# Reload NetworkManager to apply
sudo systemctl reload NetworkManager
```

- Disable TX checksum offload on `end1` to force software checksumming (TCP checksum offload is not properly applied on the SJA-switch path):

```bash
sudo ethtool -K end1 tx off
```

> Note: The static IP configuration and the TX checksum offload setting are lost on reboot.

Step 3 — MCXN-T1: configure zenoh-pico endpoint

The zenoh-pico client on MCXN-T1 runs in client mode and must connect to the `zenohd` router running on the NavQ95 A55. Configure the endpoint to `<NAVQ95_IP>:7447`.

For example, configure MCXN-T1 `zenoh_px4` publisher:

```bash
# Configure zenoh_px4 to connect to the NavQ95 A55 Zenoh router
zenoh_px4 config net client <NAVQ95_IP>:7447

# Restart zenoh_px4 to apply the configuration
zenoh_px4 restart
```

MCXN-T1 Configuration Reference

For more details on MCXN-T1 configuration and application-specific IP addresses, refer to the [MCXN-T1 Zenoh guide](../../../mr-mcxn-t1/application-notes/zenoh/index.md).

---

### Validation

Terminal 1 — NavQ95 A55: start zenohd

```bash
source ~/.ros2rc
ros2 run rmw_zenoh_cpp rmw_zenohd
```

Terminal 2 — MCXN-T1: start publishing (if not already running)

Start the zenoh-pico application on MCXN-T1. If using `zenoh_px4`, the endpoint was already configured in Step 3 — simply start or restart the application.

Terminal 3 — NavQ95 A55: subscribe

```bash
source ~/.ros2rc
source ~/ros2_ws/install/setup.bash
```

Confirm MCXN-T1 topics are visible on the NavQ95 A55 subscriber:

```bash
ros2 topic list
# Example output for OFLO sensor:
#   /fmu/in/distance_sensor
#   /fmu/in/sensor_optical_flow
```

Inspect topic details:

```bash
# Example output for OFLO sensor:
ros2 topic info /fmu/in/sensor_optical_flow
# Type: px4_msgs/msg/SensorOpticalFlow
# Publisher count: 1
# Subscription count: 0
```

Subscribe to a specific field (continuous):

```bash
# Example output for OFLO sensor:
ros2 topic echo /fmu/in/sensor_optical_flow px4_msgs/msg/SensorOpticalFlow --field quality
# quality: 91
# ---
# quality: 91
# ---
```

Receive a single full message:

```bash
# Example output for OFLO sensor:
ros2 topic echo /fmu/in/sensor_optical_flow px4_msgs/msg/SensorOpticalFlow --once
# ---
# timestamp: 4371636200
# timestamp_sample: 4371636200
# device_id: 0
# pixel_flow:
# - 0.0
# - 1.0
# delta_angle:
# - 0.0
# - 0.0
# - 0.0
# delta_angle_available: false
# distance_m: 0.0
# distance_available: false
# integration_timespan_us: 0
# quality: 91
# error_count: 0
# max_flow_rate: 0.0
# min_ground_distance: 0.0
# max_ground_distance: 0.0
# mode: 3
# ---
```

Pass criteria: `ros2 topic echo` prints decoded messages from MCXN-T1. No errors in the zenohd log.

---

## Enabling and Validating MCXN-T1 → NavQ95 M7 Communication

In this topology MCXN-T1 communicates directly with PX4 running on the NavQ95 M7 core over a peer-to-peer Zenoh link (no router involved). The MCXN-T1 node acts as the listener and PX4 connects to it.

For the full configuration and validation steps, refer to [Scenario 2 — MR-MCXN-T1 node (peer) / PX4 (peer)](../../../mr-mcxn-t1/application-notes/zenoh/index.md#scenario-2-mr-mcxn-t1-node-peer-px4-peer) in the MCXN-T1 Zenoh guide.

---

## Version History

| Version | Description |
|---------|-------------|
| v2 | Add MCXN-T1 → NavQ95 M7 topology; update diagram, multi-sensor prerequisites, MCXN-T1 config reference |
| v1 | Install `px4_msgs` via `install_ros2_pkgs`; merge px4_msgs into the ROS2 setup step |
| v0 | Initial release — MCXN-T1 → NavQ95 A55 communication over TCP (Zenoh) |
