# Installing and configuring software tools


This section describes how to obtain or build the two images the MR-NavQ95 runs — the Cortex-A Linux image and the Cortex-M RTOS firmware — and how to manage the device-tree overlays applied at boot.

## Getting the Cortex-A Linux image

> Host PC: An Ubuntu PC is assumed for all steps on this page.

There are two ways to obtain the Linux image for the MR-NavQ95:

### Option 1: Download the Pre-built Image

Follow the [NXP Robotic Platforms SDK README](https://github.com/nxp-robotics/robotics-sdk/blob/robotics-0.7.0/README.md) to set up the SDK and download the images. The Cortex-A Linux image will be located at:

```
<west_topdir>/bin/navq95/ubuntu/imx-image-robotics-imx95-navq.rootfs-<timestamp>.wic.zst
```

### Option 2: Build from Source (Yocto)

Build the image from source using the Yocto build system. See [Building the Yocto Image for MR-NavQ95](installing-software-tools.md#building-the-cortex-a-linux-image-from-source) for the full build instructions.

The output image will be located in:

```
<yocto_dir>/build/tmp/deploy/images/imx95-navq/imx-image-robotics-imx95-navq.rootfs-<timestamp>.wic.zst
```

---

> Note: The `.wic` image bundles the M7 Cortex-M firmware alongside the Linux root filesystem. By default, the M7 core runs MCUboot loaded directly from the core's TCM. To replace the M7 firmware with a custom RTOS image, see [Flashing the Cortex-M RTOS Firmware](configuring-the-hardware.md#flashing-the-cortex-m-rtos-firmware).

Once the image is available, proceed to [Flashing the Cortex-A Linux Image](configuring-the-hardware.md#flashing-the-cortex-a-linux-image) to flash it to the board.

## Building the Cortex-A Linux image from source

This section describes the steps to build the Yocto image for the MR-NavQ95 platform from source.

### Prerequisites

Before starting, ensure the host machine meets the following requirements:

- OS: Ubuntu 22.04 or later (recommended)
- Disk space: At least 300 GB of free space for a full Yocto build
- RAM: 16 GB minimum recommended

#### 1. Install Required Host Packages

Install the required host packages:

```sh
sudo apt-get install build-essential chrpath cpio debianutils diffstat file gawk \
  gcc git iputils-ping libacl1 libcrypt-dev locales python3 python3-git python3-jinja2 \
  python3-pexpect python3-pip python3-subunit socat texinfo unzip wget xz-utils zstd efitools
```

#### 2. Install the Repo Tool

Install the `repo` tool if not already present:

1. Create a `bin` folder in the home directory and download `repo`:

    ```sh
    mkdir ~/bin
    curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
    chmod a+x ~/bin/repo
    ```

2. Add `~/bin` to the `PATH` by appending the following line to `~/.bashrc`:

    ```sh
    export PATH=~/bin:$PATH
    ```

### Steps

#### 1. Set Up the Yocto Project

Create a working directory, initialize the manifest repository, and sync all required layers:

```sh
mkdir imx-yocto-bsp
cd imx-yocto-bsp
repo init -u https://github.com/nxp-robotics/robotics-linux-manifest.git -b robotics-0.7.0 -m imx-6.18.20-2.0.0_wrynose.xml
repo sync
```

#### 2. Build the Image

Source the release setup script to configure the build environment, then kick off the BitBake build:

```sh
DISTRO=imx-desktop-xwayland MACHINE=imx95-navqdesktop source imx-setup-release.sh -b build
bitbake imx-image-robotics
```

> Note: The build may take a significant amount of time depending on the host machine's resources. The output image will be located in `build/tmp/deploy/images/imx95-navq/`.

Once the build completes, proceed to [Flashing the Cortex-A Linux Image](configuring-the-hardware.md#flashing-the-cortex-a-linux-image) to write the image to the board.

## Getting the Cortex-M RTOS firmware

There are two ways to obtain the M7 RTOS firmware for the MR-NavQ95:

### Option 1: Download the Pre-built Image

Follow the [NXP Robotic Platforms SDK README](https://github.com/nxp-robotics/robotics-sdk/blob/robotics-0.7.0/README.md) to set up the SDK and download the images. The Cortex-M firmware will be located at:

```
<west_topdir>/bin/navq95/realtime/
├── nxp_imx95_default.mcuboot.bin   # TCM image, signed (use this for default deployment)
└── nxp_imx95_ddr.bin               # DDR image, unsigned
```

> Use the signed `nxp_imx95_default.mcuboot.bin` for the default/TCM image — MCUboot verifies it on boot. The DDR image is intentionally unsigned.

### Option 2: Build from Source

Use the NXP Robotic Platforms SDK to build the RTOS firmware from source:

```sh
west sdk build --platform navq95 --stack px4
```

The output firmware will be located in the `build/` directory and also copied to `bin/navq95/realtime/`.

---

Once the firmware is available, proceed to [Flashing the Cortex-M RTOS Firmware](configuring-the-hardware.md#flashing-the-cortex-m-rtos-firmware) to flash it to the board.

## Device-tree overlays in U-Boot

The MR-NavQ95 board uses a single base device tree blob (`imx95-navq.dtb`)
combined with per-connector `.dtbo` overlay files that are applied at boot time by U-Boot.
This design allows cameras, displays, or Ethernet adapters to be swapped on the board's B2B connectors
without rebuilding the kernel.

---

### Overview

At boot, U-Boot:

1. Loads the base DTB from the boot medium into memory at `fdt_addr_r`.
2. Resizes the in-memory DTB to leave room for overlay data.
3. Iterates over the three connector overlay variables (`csi_b2b`, `dsicsi_b2b`, `eth_b2b`).
4. For each variable that is not `none` and not empty, loads the named `.dtbo` file into
   `ov_addr_r` and calls `fdt apply` to merge the overlay into the in-memory DTB.
5. Boots the kernel with the fully patched device tree.

---

### Environment Variables

The relevant variables are defined in
`board/nxp/imx95_evk/imx95_evk.env` under the `CONFIG_TARGET_IMX95_NAVQ` guard.

#### Overlay selection variables

| Variable     | Default value                          | Connector / function            |
|--------------|----------------------------------------|---------------------------------|
| `csi_b2b`    | `imx95-navq-csi-imx219.dtbo`           | Port A — CSI-only (camera)      |
| `dsicsi_b2b` | `imx95-navq-dsicsi-imx219.dtbo`        | Port B — DSI/CSI combo          |
| `eth_b2b`    | `imx95-navq-sja1110a.dtbo`             | Ethernet B2B (SJA1110A switch)  |

Set any variable to `none` (or leave it empty) to skip that overlay entirely.

#### Helper commands

| Command           | What it does                                                     |
|-------------------|------------------------------------------------------------------|
| `apply_one`       | Loads `${ovfile}` using `${get_cmd}`, then calls `fdt apply`     |
| `apply_overlays`  | Sets the FDT address, resizes the blob, then runs `apply_one` for each active connector variable |
| `boot_os`         | Runs `apply_overlays`, then boots the kernel with `booti`        |
| `modules_help`    | Prints the list of available `.dtbo` files for each connector    |

---

### How `apply_overlays` Works

```
apply_overlays=
    fdt addr ${fdt_addr_r};
    fdt resize 0x20000;
    echo "NavQ-B connectors: csi_b2b=${csi_b2b} dsicsi_b2b=${dsicsi_b2b}";
    if test "${csi_b2b}" != none; then if test "${csi_b2b}" != ""; then
        setenv ovfile ${csi_b2b}; run apply_one; fi; fi;
    if test "${dsicsi_b2b}" != none; then if test "${dsicsi_b2b}" != ""; then
        setenv ovfile ${dsicsi_b2b}; run apply_one; fi; fi;
    if test "${eth_b2b}" != none; then if test "${eth_b2b}" != ""; then
        setenv ovfile ${eth_b2b}; run apply_one; fi; fi;
```

For each connector, `apply_one` does:

```
apply_one=
    echo "  overlay: ${ovfile}";
    if ${get_cmd} ${ov_addr_r} ${ovfile}; then
        if fdt apply ${ov_addr_r}; then true;
        else echo "  WARN: failed to apply ${ovfile}"; fi;
    else echo "  WARN: ${ovfile} not found on boot partition"; fi;
```

- `${get_cmd}` is set by the active boot path (`mmcboot` sets it to
  `fatload mmc ${mmcdev}:${mmcpart}`, while `netboot` sets it to `dhcp` or `tftp`).
  This ensures overlay loading works for both MMC and network boot.
- `fdt apply` merges the overlay blob at `ov_addr_r` into the base DTB already
  set active via `fdt addr`. Phandle fixups are performed automatically by U-Boot's
  `fdt_overlay_apply_verbose()` (see `boot/fdt_support.c`).

#### Overlay application sequence

```
mmcboot
  |-- fatload mmc  ->  loadaddr  (kernel Image)
  |-- fatload mmc  ->  fdt_addr_r  (imx95-navq.dtb)
  `-- boot_os
        |-- apply_overlays
        |     |-- fdt addr ${fdt_addr_r}
        |     |-- fdt resize 0x20000
        |     |-- apply_one  (csi_b2b overlay)
        |     |     |-- fatload mmc -> ov_addr_r  (.dtbo)
        |     |     `-- fdt apply ${ov_addr_r}
        |     |-- apply_one  (dsicsi_b2b overlay)
        |     `-- apply_one  (eth_b2b overlay)
        `-- booti ${loadaddr} - ${fdt_addr_r}
```

---

### Selecting a Different Module

From the U-Boot prompt, run `run modules_help` to see all available overlays:

```
=> run modules_help
NavQ-B module selection (one .dtbo per connector):
  csi_b2b    (port A, CSI-only): imx95-navq-csi-{imx219,imx477}.dtbo | none
  dsicsi_b2b (port B, DSI/CSI): imx95-navq-dsicsi-{imx219,imx477,disp-7inch,disp-5inch,lt8912b}.dtbo | none
  current: csi_b2b=imx95-navq-csi-imx219.dtbo dsicsi_b2b=imx95-navq-dsicsi-imx219.dtbo
  example: setenv dsicsi_b2b imx95-navq-dsicsi-disp-7inch.dtbo; saveenv
```

To permanently switch, for example, port B to an imx477 camera:

```
=> setenv dsicsi_b2b imx95-navq-dsicsi-imx477.dtbo
=> saveenv
=> reset
```

To disable a connector overlay (e.g. no camera on port A):

```
=> setenv csi_b2b none
=> saveenv
=> reset
```

---

### Adding a New Overlay

1. Create the DTS overlay source (`.dtso`) for the target
   hardware and build it to produce a `.dtbo` binary.
2. Copy the `.dtbo` file to the FAT boot partition of the eMMC or SD card
   (the same partition that holds `Image` and `imx95-navq.dtb`).
3. At the U-Boot prompt, point the appropriate connector variable to the new file:

   ```
   => setenv csi_b2b imx95-navq-csi-mymodule.dtbo
   => saveenv
   ```

4. Reboot — `apply_overlays` will load and apply the overlay automatically.
