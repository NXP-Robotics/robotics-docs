# Introduction

The MR-NavQ95 is the vehicle-computer reference design of the NXP Mobile Robotics family. It combines a high-performance application processor, a real-time control core, on-device AI acceleration, and automotive-grade connectivity on a single compact board, providing the compute and perception functions of a drone or mobile robot. The board is intended as a validated starting point that customers can evaluate, reproduce, and adapt for their own vehicles.

At its core is the NXP i.MX 95 applications processor, a heterogeneous multicore SoC built around Arm Cortex-A55 application cores, a Cortex-M7 real-time core, and a Cortex-M33 System Manager, together with the on-chip NXP Neutron neural processing unit (NPU). The Cortex-A55 cores run the Linux compute stack and robotics middleware, while the Cortex-M7 core handles hard real-time control.

This user manual describes how to obtain or build the Cortex-A Linux image and the Cortex-M RTOS firmware, how to flash them, and how to manage device-tree overlays. The connector pinouts and on-board devices are documented in the [Hardware Overview](hardware.md); the hardware architecture is described in the [MR-NavQ95 Hardware Architecture and Reference Design](../application-notes/hardware-overview/index.md).

## Radio Equipment Directive compliance information

The radiating device on the MR-NAVQ95-KIT board is the NXP LBES5PL2EL, a 2.4/5 GHz dual-band 1x1 Wi-Fi 6, Bluetooth/Bluetooth Low Energy, and 802.15.4 tri-radio solution. Table 1 provides the following information per Article 10.8 of the Radio Equipment Directive 2014/53/EU:

- Frequency bands in which the equipment operates
- The maximum RF power transmitted

Table 1. MR-NAVQ95-KIT specifications

| Part number | RF technology | Frequency ranges (EU) | Maximum transmitted power |
|---|---|---|---|
| MR-NAVQ95-KIT | Wi-Fi (802.11b/g/n/ax) | 2400 MHz - 2483.5 MHz | +21 dBm |
| MR-NAVQ95-KIT | Wi-Fi (802.11a/n/ac/ax) | 5150 MHz - 5350 MHz, 5470 MHz - 5725 MHz | +21 dBm |
| MR-NAVQ95-KIT | Bluetooth / Bluetooth Low Energy | 2400 MHz - 2483.5 MHz | +19 dBm |
| MR-NAVQ95-KIT | 802.15.4 (Thread / Zigbee) | 2400 MHz - 2483.5 MHz | +21 dBm |

EUROPEAN DECLARATION OF CONFORMITY

(Simplified DoC per Article 10.9 of the Radio Equipment Directive 2014/53/EU). This apparatus, namely the MR-NAVQ95-KIT, conforms to the Radio Equipment Directive 2014/53/EU. The full EU Declaration of Conformity for this apparatus is available at [European Union Declaration of Conformity for MR-NAVQ95-KIT](https://www.nxp.com/design/design-center/development-boards-and-designs/ai-powered-autonomy-compute-flight-controller:MR-NAVQ95).

## NXP Robotic Platforms SDK and upstream open-source software

NXP embraces an open-source development model and actively participates in the communities behind the software used by this product. The NXP Robotic Platforms SDK provides a curated and validated set of software components, tools, and documentation that have been tested together on this hardware platform.

NXP regularly contributes improvements and fixes back to upstream repositories. Because contributions are made on a scheduled basis, the latest upstream code and the version included in the NXP Robotic Platforms SDK may not always be identical. The SDK release is recommended for users seeking a tested and supported configuration, while advanced users may choose to work directly with the upstream project and its latest features.
