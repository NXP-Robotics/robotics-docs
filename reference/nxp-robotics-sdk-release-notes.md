# NXP Robotic Platforms SDK — Release Notes

This document is the cumulative release notes record for the NXP Robotic Platforms SDK. Each release is
documented as a self-contained entry under [Releases](#releases), with the newest release
first.

---

## About the Robotic Platforms SDK

The NXP Robotic Platforms SDK provides validated software support across NXP robotics hardware platforms,
organized into two software domains:

- Real-time domain — flight and motion-control firmware (PX4 on NuttX, Zephyr RTOS, ESC
  firmware, System Manager, and the real-time control core)
- Compute domain (Linux/Application Processor) — the application-processor software stack
  (Linux BSP, U-Boot, ROS2, camera and vision pipeline, NPU inference, and connectivity)

Each release entry below lists the supported platforms, the capabilities enabled per platform, the
new features introduced, and the known limitations for that specific version.

## How to read this document

- Releases are listed newest-first. The latest release appears immediately below.
- Every release entry follows the same fixed structure, so features and limitations can be compared
  across versions.
- The capability matrix in each entry reflects the state of that release only.

---

## Releases

### v0.7.0

#### Overview

NXP Robotic Platforms SDK v0.7.0 delivers validated software support across four robotics hardware
platforms (MR-NavQ95, MR-VMU-Tropic, MR-MCXN-T1, MR-ESC-AM32), spanning both the
Real-time and Compute domains.

- Quick Start Guides are provided for each supported platform.
- Platform binaries are available for all four supported platforms.
- Test Plan and Test Report are available for this release.

#### Software domains

Real-time domain (PX4, Zephyr, ESC, System Manager)

| Component | Description | Platforms |
| --- | --- | --- |
| PX4 Autopilot (NuttX) | Flight-control stack running on NuttX | MR-NavQ95 (real-time core), MR-VMU-Tropic |
| Zephyr RTOS | Sensor and peripheral firmware, shield-node applications | MR-MCXN-T1 (+ shields), MR-VMU-Tropic |
| Cerebri (CogniPilot) | ZROS integration apps that bridge shield sensors to ROS2 over the T1 link | MR-MCXN-T1 (+ shields) |
| ESC firmware (AM32) | Motor-control firmware; DShot / PWM protocols | MR-ESC-AM32 |
| System Manager | Low-level platform management and resource partitioning | MR-NavQ95 |

Compute domain (Linux / Application Processor)

| Component | Description | Platforms |
| --- | --- | --- |
| Linux BSP | Kernel 6.18.20-2.0.0, device trees, drivers | MR-NavQ95 |
| U-Boot | Bootloader | MR-NavQ95 |
| ROS2 | ROS2 middleware, install scripts, camera / vision nodes | MR-NavQ95 |
| Zenoh transport | Host ↔ board ROS2 connectivity over Zenoh (`rmw_zenoh`), including the ZROS → ROS2 bridge for MR-MCXN-T1 shield nodes over the T1 link | MR-NavQ95, MR-MCXN-T1 |
| Camera / Vision | MIPI-CSI camera pipeline and Vision AI example application | MR-NavQ95 |
| NPU Inference | ARA240 and Neutron NPU inference | MR-NavQ95 |
| Connectivity | SJA1110 Ethernet switch, Wi-Fi / Bluetooth, LTE PCIe modem | MR-NavQ95 |

#### Software components and versions

The following table lists the versions of the main software components integrated in this release.

| Domain | Component | Version | Notes |
| --- | --- | --- | --- |
| — | NXP Robotic Platforms SDK | v0.7.0 | Overall release version |
| Compute | Linux kernel / BSP | 6.18.20-2.0.0 | MR-NavQ95 |
| Compute | Host OS | Ubuntu 24.04 LTS | Application-processor user space (MR-NavQ95) |
| Compute | ROS2 | 0.11.0-1noble.20260903.093452 | ROS2 middleware and nodes |
| Compute | U-Boot | 2026.04 | MR-NavQ95 bootloader |
| Real-time | PX4 Autopilot | 1.17.0 (1cc2589cd20ca0c01d1de63d4287ceeeca52bf71 (MR-VMU-Tropic) / d09136b174db99e598095ce9255c52d203e668df (MR-NavQ95)) | Flight-control stack (MR-NavQ95, MR-VMU-Tropic) |
| Real-time | NuttX RTOS | 12.12.0 | Underlying RTOS for PX4 |
| Real-time | Zephyr RTOS | 4.4.0+ | MR-MCXN-T1 (+ shields), MR-VMU-Tropic |
| Real-time | Cerebri (CogniPilot) | ZROS integration apps | MR-MCXN-T1 shield nodes (OFLO, GNSS, IO) |
| Real-time | ESC firmware (AM32) | 2.20 | MR-ESC-AM32 |
| Compute | eIQ Neutron SDK | 3.1.2 | Neutron NPU inference stack (MR-NavQ95) |
| Compute | Ara SDK | 2.1.1 | ARA240 NPU runtime (rt-ara-sdk, MR-NavQ95) |

#### Supported platforms and capabilities

MR-NavQ95 (i.MX 95 vehicle computer) — Compute and Real-time
- Compute (Linux): Linux BSP 6.18.20-2.0.0; ROS2; MIPI-CSI camera pipeline and Vision AI example app.
- ROS2 connectivity: host ↔ board ROS2 communication over Zenoh (`rmw_zenoh`).
- Connectivity: SJA1110 Ethernet switch; Wi-Fi and Bluetooth; LTE PCIe modem.
- AI / NPU inference: ARA240 and Neutron NPU validated. ARA240 delivers up to approximately
  10× the inference performance of Neutron across YOLOv8 / YOLOX models.
- Real-time: PX4 on NuttX running on the real-time control core.

MR-VMU-Tropic (flight controller) — Real-time
- PX4 NuttX flight stack fully validated.
- All Zephyr peripheral tests fully validated.

MR-MCXN-T1 (+ shield variants) (sensor / IO node) — Real-time (Zephyr / Cerebri) with ROS2 sensor bridging
- Three shield variants validated (GNSS, IO, and OFLO).
- Zephyr peripheral applications for board / peripheral validation.
- Cerebri (CogniPilot) integration apps (OFLO, GNSS, IO) that bridge shield sensors to a
  ROS2 system over Zenoh via the T1 Ethernet link (ZROS → ROS2).

MR-ESC-AM32 (electronic speed controller) — Real-time (ESC firmware)
- Boot and PWM validated.
- DShot300 and DShot600 supported.
- DShot150 and BDShot150 are not supported on MR-ESC-AM32 because the AM32 main code does
  not implement DShot150.

Capability matrix

| Capability | MR-NavQ95 | MR-VMU-Tropic | MR-MCXN-T1 | MR-ESC-AM32 |
| --- | :---: | :---: | :---: | :---: |
| Linux BSP (Compute) | Yes | — | — | — |
| ROS2 | Yes | — | Sensor bridge | — |
| ROS2 over Zenoh (`rmw_zenoh`) | Yes | — | Yes (ZROS → ROS2) | — |
| Camera (MIPI-CSI) | Yes | — | — | — |
| NPU inference (ARA240 and Neutron) | Yes | — | — | — |
| Connectivity (SJA1110 / Wi-Fi+BT / LTE) | Yes | — | — | — |
| PX4 (NuttX) | Yes | Yes | — | — |
| Zephyr RTOS | — | Yes | Yes (3 shields) | — |
| Cerebri (CogniPilot) | — | — | Yes (3 shield apps) | — |
| ESC firmware (DShot / PWM) | — | — | — | Yes (DShot300/600) |

Legend: Yes = enabled and validated · — = not applicable.

#### New features

Compute domain (Linux / Application Processor)
- ROS2 support on MR-NavQ95, including ROS2 install-script integration into the platform
  image and a ROS-ready image variant.
- Host ↔ board ROS2 connectivity over Zenoh (`rmw_zenoh`), including the ZROS → ROS2 bridge that
  carries MR-MCXN-T1 shield-sensor data to a ROS2 system over the T1 Ethernet link.
- MIPI-CSI camera pipeline enabled and validated on MR-NavQ95. Four camera sensors are supported:
  - IMX708 (official Raspberry Pi Camera Module 3) — recommended default choice.
  - IMX477 — when image quality and optics matter most (already supported on FRDM).
  - IMX219 — for lowest-cost platforms (already supported on FRDM).
  - NXP EXPI-OS08A20 — OmniVision OS08A20 8-megapixel color CMOS sensor.
- Vision AI example application with runtime model and camera selection. The Vision AI demo is
  validated with the NXP EXPI-OS08A20 camera.
- NPU inference on both ARA240 and Neutron, with object-detection models (YOLOv8 / YOLOX).
- Connectivity stack: SJA1110 Ethernet switch, Wi-Fi / Bluetooth, and LTE PCIe modem support.
- Platform image composition additions, including a MAVLink router and a Remote-ID transmitter.
- U-Boot board configuration for MR-NavQ95.
- Docker-based build support for the SDK.
- Improved Setup / Quick Start documentation: step-by-step flashing guides, hardware photos,
  boot-switch and power-cycle instructions, and software bill-of-materials in the release images.

Real-time domain (PX4, Zephyr, Cerebri, ESC)
- PX4 flight stack (NuttX) validated on MR-NavQ95 and MR-VMU-Tropic.
- Zephyr RTOS applications validated on MR-VMU-Tropic and on the three MR-MCXN-T1 shield variants
  (GNSS, IO, OFLO).
- Cerebri (CogniPilot) integration apps on MR-MCXN-T1 (OFLO, GNSS, IO) that bridge shield
  sensors to a ROS2 system over Zenoh (ZROS → ROS2) across the T1 link.
- ESC firmware (AM32) with DShot300 / DShot600 and PWM support on MR-ESC-AM32.
- PX4 command-line tooling enhancements (GPIO system command).

Cross-platform / validation
- End-to-end validation across all four supported platforms and both software domains, covering
  BSP, ROS2, camera, connectivity, NPU inference, PX4, Zephyr, and ESC.

#### Known limitations

Limitations are grouped per platform, then split into Hardware and Software gaps.

MR-NavQ95

Hardware
- The current design partitions the Ethernet ENETC interfaces between the M7
  (real-time) and A55 (application) cores; achieving functional-safety compliance may require
  software changes, including redesign of selected components and interfaces. (TARS-400)
- Thermal Management: System designers should account for overall thermal management. In particular,
  Ara240 modules require active cooling and include a separate 5V cooling fan with its own connector.
  When an Ara240 DNPU is running inference workloads, it generates heat that, if not adequately
  managed, can raise the temperature of the i.MX95 on the MR-NavQ95 board. The MPU is configured to
  activate thermal protection at approximately 85 °C, allowing the i.MX95 to reduce its clock
  frequency and prevent overheating. This expected behavior may reduce performance during sustained
  inference workloads when cooling is inadequate.
  System designers are responsible for ensuring adequate thermal management for the intended
  deployment. In enclosed or stationary installations with limited airflow, consider cooling fans or
  other active cooling to provide sufficient airflow and keep the board below its throttling
  threshold, thereby maintaining full inference performance. (TARS-476, TARS-490)
- Ara240 cable adapter for NavQ95: The cooling fan on the current ARA2-M2-16G-GT (Ara240 16 GB M.2
  Module) EVK can be powered from any suitable 5V source in the system. For convenience, a cable
  adapter is available from NXP and listed as an accessory on the MR-NavQ95-KIT webpage.
  P/N: MR-NAVQ95-FANCB

Software
- Linux: device trees do not fully adhere to Linux community standards (e.g. wrong DT node ordering,
  redundant / commented-out nodes left in the DTS).
- U-Boot: no dedicated board support — software currently relies on the MX95-19×19-EVK board
  support; users cannot build U-Boot binaries for MR-NavQ95 without Yocto. (TARS-331)
- U-Boot: GCC 13 (Ubuntu PoC) is incompatible with GCC 15 (Yocto); resolution is to upgrade to
  Ubuntu 26.04 (GCC 15) in a future release. (TARS-270)
- Networking: the SJA1110 switch uses a DSA (Distributed Switch Architecture) conduit, so TCP
  checksum offload is not applied across the `end1` → SJA switch → `trx*` forwarding path; plan for
  this when configuring the Ethernet stack. (TARS-505)
- PX4 / M7: PyOCD flashing of the M7 image is unstable and requires multiple runs. (TARS-326)
- PX4 / M7: flashing the PX4 image with pyOCD interferes with the SPI bus while an MR-MCXN-T1
  (T1) node is connected to the SJA1110 switch — the flash halts during the erase step with a
  "core #0 is not halted" error. Disconnect the T1 node(s) from the SJA1110 switch before flashing
  the M7 PX4 image. (TARS-815)
- PX4 / M7: M7 depends on Linux for its filesystem, leading to delayed boot. (TARS-342)
- PX4 / M7: different software configuration (SHA commit) than the other supported PX4
  platforms. (TARS-343)
- PX4 / M7: The PX4 `reboot` command and A55/Linux reboot recovery are currently not supported —
  the M7 and A55 do not properly re-initialize shared resources after a reboot, so a full
  power-cycle of the SoC is required instead. Enablement of software-triggered reboot recovery is
  planned for a future release.
- System Manager: insecure / improper resource partitioning between M33 / M7 / AP-NS — e.g.
  LPI2C4 is accessible from M33, M7 and AP-NS simultaneously.

MR-VMU-Tropic

Hardware
- UART3 is designated at AUX instead of TELEM as it does not support hardware based flow control as per PX4 specifications.
  (TARS-404)

Software
- No Ethernet driver is available in NuttX for this board revision.

MR-MCXN-T1 and Shields

Hardware
- MR-MCXN-T1-GNSS: shield unusable (shorted out) without removal of DNP resistors. (TARS-396)
- MR-MCXN-T1-GNSS: BMM350 magnetometer Z-axis failure without a hardware rework (resistor addition).
  (TARS-397)

Software
- Magnetometer and barometer sensor data are not available as ROS2 nodes, blocked by I3C bus
  driver, and signals being alternatively allocated to LPUART. Optical-flow and GNSS data
  are available to a ROS2 system via the Cerebri ZROS → ROS2 bridge over the T1 link.
  (TARS-391, TARS-392, TARS-397)

MR-ESC-AM32

Hardware
- Re-configuration of the ESC (for new motors, protocols, etc.) requires reprogramming/configuring a  Pixhawk
  6X-RT controller as a pass-through interface. (TARS-398)

Software
- The AM32 upstream code does not implement the DShot150 / BDShot150 protocol, so likewise these
  cannot be configured on MR-ESC-AM32. (TARS-340)
