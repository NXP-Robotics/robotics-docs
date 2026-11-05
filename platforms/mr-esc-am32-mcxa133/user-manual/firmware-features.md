# Firmware features

## Motor control

- Sensorless 6-step (trapezoidal) commutation — BEMF zero-cross detection for rotor position.
- Sinusoidal startup mode — smooth, reliable spin-up for larger/heavier motors.
- Linear throttle response — optimized for FPV and precision flight.
- Variable PWM frequency — tunable dead-time and switching rate for different motor/ESC hardware.

The hardware includes provisions for Hall sensor feedback, but Hall sensor feedback is not currently supported in software.

## Input protocols

| Protocol | Notes |
|----------|-------|
| Servo PWM | Standard RC 1000–2000 µs |
| DShot 300 | Digital, packet-based |
| DShot 600 | Higher speed digital |
| Bi-directional DShot | Returns RPM telemetry to the flight controller via GCR encoding |

## Telemetry output

- KISS standard ESC telemetry — single-wire serial: temperature, voltage, current, RPM, consumption.
- Bi-directional DShot — eRPM embedded in the DShot response frame (no extra wire needed).

## Configuration and updates

- Firmware upgradeable via:
  - Betaflight passthrough (no programmer needed)
  - Single-wire serial (USB-serial adapter)
  - NXP passthrough image for the RT1176 VMU
- Configurators:
  - [AM32 Web Configurator](https://am32.ca/) (browser-based)
  - Desktop app (Windows/Linux)
  - [ESC Configurator](https://esc-configurator.com/) (third-party, web serial)

## Bootloader

- A separate bootloader is required for initial flashing (via ST-LINK / GD-LINK / AT-LINK).
- After that, all updates go over the signal wire — no programmer needed.
