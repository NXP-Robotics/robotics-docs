# Using a Cellular Modem on MR-NAVQ95

This application note explains how to connect and use a WWAN cellular
modem on the MR-NAVQ95 board's M.2 Key-B slot. It first covers the
hardware architecture and general considerations that apply to any
M.2 Key-B modem, then walks through a bring-up example using the
Quectel RM520N-EU (5G Sub-6 module).

## 1. Hardware architecture

MR-NAVQ95 exposes two M.2 sockets: a Key-M slot (NPU accelerator
cards) and a Key-B slot dedicated to WWAN modems. The Key-B slot
is located on the back of the main board and is electrically
wired as a single-lane PCIe interface (PCIe x1) off the i.MX 95.

A nano-SIM slot is available on the board for the WWAN module.

### 1.1 What to consider when selecting an M.2 Key-B modem

1. Interface type. The slot only wires a PCIe lane and the usual
   M.2 sideband control signals; it does not carry USB.

   > Attention! On MR-NAVQ95, the M.2 Key-B connector's USB
   > signal pins are not wired to the SoC. Some WWAN modules —
   > including the Quectel RM520N-EU used as the example below — ship
   > from the factory configured to use their USB interface by
   > default. Such a module will not be usable in this slot until
   > it has been explicitly reconfigured for PCIe operation (see
   > section 2.1 for the RM520N-EU procedure). Always check and, if
   > needed, reconfigure the module's default interface mode
   > before installing it on MR-NAVQ95.
2. Form factor. The socket is a multi-mount M.2 socket for Key-B
   (or B+M) cards — it is not limited to a single card length. Check
   the schematic and confirm the specific module's
   length/mounting-hole position is supported by the socket footprint
   before selecting it.

## 2. Example: Quectel RM520N-EU

The RM520N-EU is a 5G Sub-6 M.2 Key-B module that supports both USB
and PCIe interfaces, shipping configured for USB mode by default.
Once switched to PCIe mode (see section 2.1) and installed, it is
supported out of the box on the NXP Robotics Linux image for
MR-NAVQ95: the module is detected automatically at
boot and exposed to userspace via ModemManager, without any
additional configuration on the board itself.

### 2.1 One-time module configuration: switching to PCIe mode

Before the module can be used in the MR-NAVQ95 M.2 Key-B slot, it
must be switched from its default USB mode to PCIe mode. This is a
one-time configuration step, done outside of MR-NAVQ95 on a Windows
or Linux PC, and requires:

- A USB-to-M.2 (Key-B) adapter, to connect the module to the PC over
  USB.
- The Quectel USB driver for the module, installed on the PC.
  Download the driver from the
  [Quectel product page](https://www.quectel.com/product/5g-rm520n-series/).
- A serial terminal application (e.g. PuTTY, Tera Term) to send AT
  commands to the module.

Step 1 — Install the Quectel driver. Install the Quectel USB
driver for the RM520N-EU on the PC. Once the driver is installed, the
module enumerates as a set of serial ports.

Step 2 — Connect the modem to the PC. Insert the modem into the
USB-to-M.2 adapter, then insert the adapter into a USB port of the
PC.

Step 3 — Open a serial session to the module's AT command port
at 115200 baud, 8N1, no flow control.

Step 4 — Query the current interface mode (optional, to confirm
the module is currently in USB mode):
```
AT+QCFG="data_interface"
```
Default response: `+QCFG: "data_interface",0,0` (USB mode).

Step 5 — Switch the module to PCIe mode:

```
AT+QCFG="data_interface",1,0
```
1 = network data via PCIe;
0 = diagnostic port stays on USB

Once switched, the module retains the PCIe configuration in its own
non-volatile storage, so this step only needs to be done once per
module, before it is installed in the MR-NAVQ95 M.2 Key-B slot.

### 2.2 Verifying the modem is detected

- Power off the board.
- Insert the modem into the M.2 Key-B connector (J16).
- Connect the antennas to the modem.
- Insert a nano-SIM into the SIM slot (J5).
- Power on the board.

The modem should be visible on the PCIe bus and reported by
ModemManager:

```
user@imx95-navq:~# lspci -d 17cb:0308
0001:01:00.0 Unassigned class [ff00]: Qualcomm Technologies, Inc Device 0308

user@imx95-navq:~# mmcli -L
    /org/freedesktop/ModemManager1/Modem/0 [generic] RM520N-EU
```

Note: It may take a few seconds for the ModemManager to detect the
modem.

Disable the SIM PIN (one-time per SIM):

```
sudo mmcli -i 0 --pin=<PIN> --disable-pin
```

### 2.3 Connecting to the network

Once the modem is detected, use ModemManager's `mmcli` to check
status and bring up a data connection:

```
mmcli -m 0
mmcli -m 0 --simple-connect="apn=<your-apn>"
successfully connected the modem
```

Depending on the APN and network configuration, the resulting
network interface (`wwan0`) can then be configured with the
carrier-provided IP settings, or managed automatically by
NetworkManager.

### 2.4 Propagate the settings to the network adapter (wwan0)

```
user@imx95-navq:~$ sudo nmcli connection add type gsm ifname "*" con-name quectel apn <your-apn>
Connection 'quectel' (426eda0c-d93f-4746-aca3-8caf3481c24c) successfully added.

user@imx95-navq:~$ nmcli con show
NAME                UUID                                  TYPE      DEVICE     
quectel             426eda0c-d93f-4746-aca3-8caf3481c24c  gsm
       wwan0mbim0 
lo                  86eac6be-dcd5-46c2-aace-9f70549148db  
loopback  lo         
Wired connection 1  ce584b2c-9584-33b3-a787-a9863fa15037  ethernet  --         
Wired connection 2  0694ee2b-c10a-34ff-854b-d7e2014f4e9e  ethernet  --         
wired               f42fc16a-9c44-43dd-b15d-fb7243d80177  ethernet  --   
```

### 2.5 Test the internet connection
```
user@imx95-navq:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: end0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc mq state DOWN group default qlen 1000
    link/ether 6a:8c:01:b4:6b:81 brd ff:ff:ff:ff:ff:ff
    altname enP2p0s0f0
3: end1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 5a:88:b5:a5:f8:c7 brd ff:ff:ff:ff:ff:ff
    altname enP2p0s16f0
4: wwan0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/[519] 
    inet 10.131.84.97/30 brd 10.131.84.99 scope global noprefixroute wwan0
       valid_lft forever preferred_lft forever

user@imx95-navq:~$ sudo ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=114 time=54.4 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=114 time=62.1 ms
```