# Remote ID Transmitter

Remote ID Transmitter is a built-in Linux application used to continuously broadcast identification and flight data.
Remote ID broadcast is a standard in its own right and is required on most drones.

For more information, see the [ARK Electronics RemoteIDTransmitter project](https://github.com/ARK-Electronics/RemoteIDTransmitter).

## Usage

The Remote ID Transmitter (rid-transmitter) is preinstalled on the Linux image. It must be connected to a PX4 instance. This document uses PX4 SITL (simulated); the same steps may apply to PX4 running on the Cortex-M7 core.
The broadcast signal can be received using a phone with a mobile app such as [Drone Scanner](https://play.google.com/store/apps/details?id=cz.dronetag.dronescanner&hl=en_US) or with BLE sniffers.

### 1. PX4 SITL

In this setup, PX4 runs in simulation on a separate Linux PC (x86 architecture). The same steps may apply when installing directly on the board.
The board and the PC must be discoverable to each other over the network.

#### a. Installation

```bash
sudo apt update && sudo apt install -y git
git clone https://github.com/PX4/PX4-Autopilot.git --recursive
cd PX4-Autopilot
bash ./Tools/setup/ubuntu.sh --no-nuttx
PX4_HOME_LAT=44.4351428 PX4_HOME_LON=26.0537122 PX4_HOME_ALT=80 make px4_sitl sihsim_quadx
```

If errors are encountered: OSRF repo "NOSPLIT / no longer signed" -> switch to HTTPS & Other dependencies

```bash
sudo rm -f /etc/apt/sources.list.d/gazebo-stable.list
sudo apt clean
sudo rm -rf /var/lib/apt/lists/*osrfoundation* /var/lib/apt/lists/partial/*
sudo wget https://packages.osrfoundation.org/gazebo.gpg -O /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] https://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list

sudo apt install -y \
  gz-jetty libunwind-dev cppzmq-dev \
  libopencv-dev libeigen3-dev protobuf-compiler \
  libgstreamer-plugins-base1.0-dev gstreamer1.0-plugins-base \
  gstreamer1.0-plugins-good gstreamer1.0-plugins-bad \
  gstreamer1.0-plugins-ugly gstreamer1.0-libav \
  libimage-exiftool-perl libxml2-utils dmidecode pkg-config bc

sudo apt update
```

#### b. Running

The coordinates can be changed as needed; those below are the coordinates of the Bucharest NXP site.

```bash
rm -rf build/px4_sitl_default
PX4_HOME_LAT=44.4351428 PX4_HOME_LON=26.0537122 PX4_HOME_ALT=80 make px4_sitl sihsim_quadx
```

MAVLink setup, required each time PX4 starts:

```bash
pxh> mavlink start -x -u 14555 -r 100000 -m onboard -o 14553 -t <BOARD-IP>
pxh> mavlink stream -r 5 -s OPEN_DRONE_ID_LOCATION -u 14555
pxh> mavlink stream -r 5 -s OPEN_DRONE_ID_SYSTEM   -u 14555
pxh> commander takeoff
```

### 2. RID-Transmitter

The commands below must be run as the root user (the Bluetooth and apt commands require it).

#### a. Setup
```bash
mkdir -p /opt/ark/share/rid-transmitter/
nano /opt/ark/share/rid-transmitter/config.toml
```

Text:
```bash
bluetooth_device  = "hci0"
connection_url    = "udpin://0.0.0.0:14553"
manufacturer_code = "MFR1" 
serial_number     = "950009500NXP" # any code is acceptable, provided it has the same length
```

#### b. Running

```bash
modprobe btnxpuart
hciconfig hci0 up
rid-transmitter
```
Expected startup output:

```
UAS Serial Number: MFR1...
Waiting for MAVSDK connection: udpin://0.0.0.0:14553
Connected to autopilot
```

The broadcast uses BLE Coded PHY. If a phone is used to listen for the broadcast, it might capture only the first message, depending on its Bluetooth capabilities, as not all phones support receiving on BLE Coded PHY.

In that case, the source code must be modified. See the next section.

### 3. Compiling rid-transmitter to broadcast on another BLE PHY

The steps below describe how to compile the application modified to broadcast on 1M PHY, which all Bluetooth devices support.

The steps below are for compiling on the board. Compilation can also be performed with the Yocto toolchain on an external computer; this document does not cover cross compilation.

#### a. MAVSDK 
```bash
cd /home/user/
git clone --recursive https://github.com/mavlink/MAVSDK.git -b v3.12.0
cd MAVSDK
cmake -Bbuild/default -H. -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_MAVSDK_SERVER=OFF \
      -DCMAKE_INSTALL_PREFIX=/usr/local/MAVSDK/install
cmake --build build/default -j$(nproc)
cmake --build build/default --target install
```

#### b. BlueZ 

```bash
cd /home/user/
wget https://mirrors.edge.kernel.org/pub/linux/bluetooth/bluez-5.72.tar.xz
tar xf bluez-5.72.tar.xz
mkdir -p /usr/include/bluetooth
cp bluez-5.72/lib/*.h /usr/include/bluetooth/

cd ~/bluez-5.72
echo '#define VERSION "5.72"' > config.h
gcc -c -fPIC -O2 -I. -Ilib lib/bluetooth.c lib/hci.c lib/sdp.c lib/uuid.c
ar rcs /usr/lib/libbluetooth.a bluetooth.o hci.o sdp.o uuid.o
mkdir -p /usr/local/lib/pkgconfig
nano /usr/local/lib/pkgconfig/bluez.pc
```

Text:
```bash
prefix=/usr
exec_prefix=${prefix}
libdir=${prefix}/lib
includedir=${prefix}/include

Name: BlueZ
Description: Bluetooth protocol stack for Linux
Version: 5.72
Libs: -L${libdir} -lbluetooth
Cflags: -I${includedir}
```

After saving the file:
```bash
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH
pkg-config --modversion bluez
```

#### c. RemoteID Transmitter

```bash
cd /home/user
git clone --recursive https://github.com/ARK-Electronics/RemoteIDTransmitter.git
cd RemoteIDTransmitter
```

Modify the sources:

1. First modification:

File: `src/Bluetooth/Bluetooth.cpp`, `le_set_extended_advertising_parameters()`

The struct initialiser sets LE 1M, but two lines afterwards override it:

```cpp
buf[20] = 0x03; // Primary_Advertising_PHY: 3 = LE Coded
buf[22] = 0x03; // Secondary_Advertising_PHY: 3 = LE Coded
```

Change both to `0x01`:

```bash
sed -i 's/buf\[20\] = 0x03;/buf[20] = 0x01;/; s/buf\[22\] = 0x03;/buf[22] = 0x01;/' \
  src/Bluetooth/Bluetooth.cpp
```

2. Second modification:

File: `src/Transmitter/Transmitter.cpp`, `run_state_machine()`
The transmit state machine alternates the advertising mode every 200 ms:

```c
uint64_t loop_rate_ms = 200;
...
_toggle_legacy = !_toggle_legacy;
if (_toggle_legacy) {
    _bluetooth->enable_legacy_advertising();
} else {
    _bluetooth->enable_le_extended_advertising();
}
```

Change `_toggle_legacy = !_toggle_legacy;` to `_toggle_legacy = true;`
___

Build:
```bash
cmake -Bbuild -H. -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_C_FLAGS="-Wno-error=stringop-truncation"
cmake --build build -j$(nproc)
```

The new rid-transmitter can now be executed (ensure the config.toml file is present):
```bash
setcap 'cap_net_raw,cap_net_admin+eip' build/rid-transmitter
./build/rid-transmitter --config /opt/ark/share/rid-transmitter/config.toml
```
