


# ROS2 Setup on NavQ95

## Overview

This guide covers the full ROS2 setup sequence on a NavQ95 platform, from base installation through environment configuration and additional packages. Setup is organized into three steps:

| Step | Script | Purpose | Status |
|------|--------|---------|--------|
| 1 | `install_ros2_base` | ROS2 base installation | Available |
| 2 | `install_ros2_env`  | Environment setup and RMW configuration | Available |
| 3 | `install_ros2_pkgs` | NavQ95-specific ROS2 packages | Available |

> Note: `imx-image-robotics` ships without ROS2 pre-installed. Installing ROS2 after deployment aligns with the upstream ROS2 installation model for Ubuntu-based systems.

---

## Prerequisites

- `imx-image-robotics` deployed and booted on the NavQ95.
- The platform must have internet access so that apt can reach `packages.ros.org`.

---

## Quick Install
> Note: Please execute the following sequence of steps to ensure full versions compatibility.

```bash
# Step 1 — ROS2 base installation (latest upstream version)
install_ros2_base

# Step 2 — Environment setup and RMW configuration (latest upstream version)
install_ros2_env -l

# Step 3 — NavQ95-specific ROS2 packages (latest upstream versions)
install_ros2_pkgs -l ros-jazzy-demo-nodes-cpp ros-jazzy-rosbag2

# Step 4 — NavQ95-specific ROS2 packages (pinned version)
install_ros2_pkgs px4_msgs
```

Installed versions:

- ROS2 base: `ros-jazzy-ros-base - latest available version`
- ROS2 environment: `ros-jazzy-rmw-zenoh-cpp - latest available version`
- ROS2 packages:
    - `ros-jazzy-demo-nodes-cpp - latest available version`
    - `ros-jazzy-rosbag2 - latest available version`
    - `px4_msgs - default fixed release/1.17`

Both `install_ros2_env` and `install_ros2_pkgs` support all of the following flags, while `install_ros2_base` only supports the `[-i]` `[-h]` flags. — run `<script_name> -h` for details:

```
<script_name> [-i] [-l] [-h]

  (no flags)  Non-interactive: run all steps unattended, installs fixed version(s)
  -i          Interactive: prompt [Y/n] before each step
  -l          Latest: install latest upstream packages (ignoring pinned ROS_FIXED_VERSION)
  -h          Show this help and exit

Flags can be combined, e.g.: <script_name> -i -l
```

---

## Installation — ROS2 Base

### Overview

`install_ros2_base` installs `ros-jazzy-ros-base` following the official ROS 2 Jazzy deb installation steps. It always installs the latest upstream version if ROS2 is not already installed — no version pinning or `apt-mark hold` is applied.

> Note: If `ros-jazzy-ros-base` is already installed, the script detects it automatically. If the installed version matches the latest, the install step is skipped. If it is older, the script prompts for an upgrade (auto-upgrade after 10 seconds).

It also installs `ros-dev-tools` and reports the active ROS2 distro, middleware, and installed package version.

### Option A: Automated

Run on the platform:

```bash
install_ros2_base
```

Expected output on success:

```
ROS2 Jazzy base installer -- mode: non-interactive, version: latest upstream

=== Step 1/7: Set locale (UTF-8) ===
...
=== Step 7/7: Report installation ===
ROS_DISTRO = jazzy
middleware name    : rmw_fastrtps_cpp
ros-jazzy-ros-base installed version: <version>

SUCCESS. All steps completed.
NOTE: ROS2 is not yet active in this shell. Run: source /opt/ros/jazzy/setup.bash
```

On failure, if a shell command exits with a non-zero status (e.g. apt update fails due to no network), the script exits immediately and prints:

```
ERROR: Installation aborted at line <N>. Fix the issue above and re-run the script.
Tip: use -i for step-by-step control (prompt before each step).
```

Fix the reported issue and re-run. The script is idempotent — safe to re-run. Use `-i` to step through and skip already-completed steps:

```bash
install_ros2_base -i
```

### Option B: Manual

Follow the official ROS 2 Jazzy installation guide:
https://docs.ros.org/en/jazzy/Installation/Ubuntu-Install-Debs.html

### Verification

After completing the base installation:

```bash
source /opt/ros/jazzy/setup.bash
printenv | grep ROS_DISTRO                          # -> ROS_DISTRO=jazzy
dpkg-query -W -f='${Version}\n' ros-jazzy-ros-base  # -> <version>
ros2 doctor --report | grep -i "middleware name"    # -> rmw_fastrtps_cpp (default)
```

### Troubleshooting

No internet access — the platform requires internet access to reach `packages.ros.org`. Verify connectivity before running any script:

```bash
curl -I https://packages.ros.org
```

Re-running after a failure — all scripts are idempotent, safe to re-run after fixing the reported issue. Use `-i` to be prompted before each step:

```bash
install_ros2_base -i
# Answer [Y/n] before each step; press Enter to run, n to skip
```

---

## Installation — ROS2 Environment

### Overview

`install_ros2_env` configures the ROS2 Jazzy environment for the NavQ95 by:

1. Installing `ros-jazzy-rmw-zenoh-cpp` (Zenoh RMW middleware).
2. Generating a persistent ROS2 environment config file (`~/.ros2rc`) that sources ROS2 Jazzy and sets `RMW_IMPLEMENTATION=rmw_zenoh_cpp`.
3. Reporting the installed versions and active configuration.

### Option A: Automated

Run on the platform:

```bash
install_ros2_env
```

The script installs the following NavQ95-validated fixed version of `ros-jazzy-rmw-zenoh-cpp` (arm64):

```
ros-jazzy-rmw-zenoh-cpp=0.2.9-1noble.20260612.051449
```

To install a specific build, override the fixed version before running:

```bash
export ZENOH_FIXED_VERSION=<version>
install_ros2_env
```

To install the latest upstream version instead, use the `-l` (latest) flag — it will ignore the pinned `ZENOH_FIXED_VERSION`:

```bash
install_ros2_env -l
```

The generated `~/.ros2rc` file activates ROS2 Jazzy and selects the Zenoh RMW:

```bash
# Activate ROS2 Jazzy
source /opt/ros/jazzy/setup.bash

# Use Zenoh as the RMW implementation
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
```

To change the output path, override `ROS2RC_PATH` before running:

```bash
export ROS2RC_PATH=/custom/path/ros2rc
install_ros2_env
```

Expected output on success:

```
ROS2 Jazzy env configurator -- mode: non-interactive, version: fixed ros-jazzy-rmw-zenoh-cpp (<version>)

=== Step 1/3: Install ros-jazzy-rmw-zenoh-cpp (fixed <version>) ===
...
ros-jazzy-rmw-zenoh-cpp set on hold.

=== Step 2/3: Generate ros2rc environment config ===
Generating /home/<user>/.ros2rc ...
ros2rc written to /home/<user>/.ros2rc

=== Step 3/3: Report installation ===
ROS_DISTRO            = jazzy
RMW_IMPLEMENTATION    = rmw_zenoh_cpp
ros-jazzy-rmw-zenoh-cpp installed version: <version>
ros2rc path           = /home/<user>/.ros2rc

SUCCESS. All steps completed.
To activate the ROS2 Zenoh environment, run:
  source /home/<user>/.ros2rc

To activate automatically on every login, add it to the shell startup script:
  echo "source /home/<user>/.ros2rc" >> ~/.bashrc
```

On failure, the script exits immediately and prints:

```
ERROR: Installation aborted at line <N>. Fix the issue above and re-run the script.
Tip: use -i for step-by-step control (prompt before each step).
```

Fix the reported issue and re-run. The script is idempotent — safe to re-run. Use `-i` to step through and skip already-completed steps:

```bash
install_ros2_env -i
```

### Option B: Manual

Install the Zenoh RMW package manually:

```bash
sudo apt update
sudo apt install ros-jazzy-rmw-zenoh-cpp=<version>
sudo apt-mark hold ros-jazzy-rmw-zenoh-cpp
```

Then create `~/.ros2rc`:

```bash
cat > ~/.ros2rc <<'EOF'
# ros2rc -- NavQ95 ROS2 environment configuration
source /opt/ros/jazzy/setup.bash
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
EOF
chmod 644 ~/.ros2rc
```

### Verification

After completing the environment setup:

```bash
source ~/.ros2rc
printenv | grep RMW_IMPLEMENTATION                              # -> RMW_IMPLEMENTATION=rmw_zenoh_cpp
dpkg-query -W -f='${Version}\n' ros-jazzy-rmw-zenoh-cpp        # -> <version>
```

### Troubleshooting

`/opt/ros/jazzy/setup.bash` not found — the ROS2 base installation must be completed first:

```bash
install_ros2_base
```

Re-running after a failure — the script is idempotent, safe to re-run after fixing the reported issue. Use `-i` to be prompted before each step:

```bash
install_ros2_env -i
# Answer [Y/n] before each step; press Enter to run, n to skip
```

---

## Installation — ROS2 Packages

### Overview

`install_ros2_pkgs` installs a set of NavQ95-specific ROS2 packages on top of the ROS2 base and environment setup. Each package is installed at a NavQ95-validated fixed version and held to prevent unintended upgrades.

Packages installed:

```
ros-jazzy-demo-nodes-cpp      (0.33.11-1noble.20260612.180159)   # demo nodes (talker/listener)
ros-jazzy-rosbag2             (0.26.11-1noble.20260612.202546)   # record and play back topics
px4_msgs                      (release/1.17)                     # PX4 uORB message definitions
```

> Prerequisite: ROS2 base must be installed first (`install_ros2_base`). Some packages may also require the ROS2 environment setup (`install_ros2_env`).

> Note: `px4_msgs` build scope. `px4_msgs` is built from source on the board. By default, only the message definitions required by the T1 usecase (`DistanceSensor.msg` and `Sensor*.msg`) are compiled, instead of the full set of 200+ messages. This reduces build time by roughly 90%, down to about 3 minutes (versus 30-60 minutes for the full set). Use the `--all-px4-msgs` flag to build every message definition instead.

### Install

Run on the platform:

```bash
install_ros2_pkgs
```

Each package is installed at its fixed version and held via `apt-mark hold` to prevent unintended upgrades.

To install a specific build, override the fixed version before running (one variable per package, `ROS2PKG_<ID>_VERSION`):

```bash
export ROS2PKG_<ID>_VERSION=<version>
install_ros2_pkgs
```

To install the latest upstream versions instead, use the `-l` (latest) flag — it will ignore the fixed versions:

```bash
install_ros2_pkgs -l
```

To build `px4_msgs` with every message definition (instead of only the T1-required subset), use the `--all-px4-msgs` flag:

```bash
install_ros2_pkgs --all-px4-msgs
```

By default all packages are installed; pass package names to install only a subset. Examples:

```bash
install_ros2_pkgs                          # install all packages
install_ros2_pkgs ros-jazzy-rosbag2        # install only the named package
install_ros2_pkgs -i                       # prompt before each package
install_ros2_pkgs -i -l px4_msgs           # flags and packages combine
install_ros2_pkgs --all-px4-msgs           # build all px4_msgs messages
```

Run `install_ros2_pkgs -h` to see the available packages and usage.

On success, the script prints each package it installed, a version report, and any post-install usage tips, ending with a `SUCCESS` line:

```
ROS2 Jazzy package installer -- mode: <mode>, version: <version-mode>

=== Install <package-name> (<version-mode>) ===
...

=== Report installation ===
<package-name> installed version: <version>

SUCCESS. All packages completed.

=== Usage: <package-name> ===
<post-install usage tips>
```

On failure it aborts immediately and prints the failing step. Fix the reported issue and re-run — the script is idempotent. Use `-i` to be prompted before each package:

```bash
install_ros2_pkgs -i
```

### Verification

Confirm each package is installed at the expected version:

```bash
dpkg-query -W -f='${Version}\n' <package-name>
```

For a functional check, follow the usage tips printed by the script at the end of the installation.

### Troubleshooting

Re-running after a failure — the script is idempotent, safe to re-run after fixing the reported issue. Use `-i` to be prompted before each package:

```bash
install_ros2_pkgs -i
# Answer [Y/n] before each package; press Enter to run, n to skip
```

---

## Known issues

Some of the ROS2 components containing fixed versions in the scripts are obsolete and failing to install, for full compatibility please execute the scripts as instructed in the quick install section and check which versions have been tested in the build release notes.

---

## Version History

| Version | Description |
|---------|-------------|
| v7 | `install_ros2_base`: remove fixed-version and `apt-mark hold`; script installs latest version<br>`install_ros2_env`, `install_ros2_pkgs`: add note to use `-l` flag as fixed versions are no longer available for installation |
| v6 | `install_ros2_pkgs`: `px4_msgs` now builds only T1-required messages (`DistanceSensor`, `Sensor*`) by default. Add `--all-px4-msgs` flag to build all messages |
| v5 | `install_ros2_base`: add early version conflict check; `apt-mark hold` only applied in fixed-version mode |
| v4 | `install_ros2_pkgs`: NavQ95-specific ROS2 packages (available) |
| v3 | `install_ros2_base`: add Overview section |
| v2 | `install_ros2_env`: environment setup and Zenoh RMW configuration (available) |
| v1 | Doc restructure (platform terminology, quick install)<br>`install_ros2_base`: add `-l` (latest) and `-h` flags |
| v0 | Initial release — `install_ros2_base` (base ROS2 installation) |
