# Configuring the hardware


A typical hardware configuration incorporates the MR-MCXN-T1 Hub (with the chosen shield fitted), a power supply, and a 100BASE-T1 Ethernet host. The Hub is powered and connected over a single connector that carries both raw battery power and the 2-wire 100BASE-T1 link to the host.

- Fit the required shield (MR-MCXN-T1-IO, MR-MCXN-T1-F9P, or MR-MCXN-T1-OFL) onto the Hub.
- Connect the Hub to a 100BASE-T1 host (for example, an MR-NavQ95 running ROS 2) or to a PC through an RDDRONE-T1ADAPT adapter.
- Apply power within the supported input range.

For connector locations and pinouts, see the [MR-MCXN-T1 Hub hardware reference](hardware.md).

## Installing and configuring software tools

Software for the MR-MCXN-T1 Hub and supported shields is provided through the NXP Robotic Platforms SDK, which uses the Zephyr development environment on the MCU. Follow the SDK instructions to install the toolchain, build the firmware for the chosen shield, and flash the Hub.

For the end-to-end build and flash workflow, see the [MR-MCXN-T1 Deploy and Run Quick Start](../../getting-started/mr-mcxn-t1-quick-start.md).
