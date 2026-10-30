# ARA-240 DNPU with MR-NavQ95 Setup Guide

This guide provides the steps to setup and run the ARA-240 DNPU with MR-NavQ95. It provides the steps for:

- Hardware setup
- Setting up the ARA SDK and eIQ AAF Connector, which is a REST-based server for LLM inference
- Downloading and preparing models (CNNs and LLMs)

## Prerequisites

Hardware:

- MR-NavQ95 board
- ARA-240 M.2 Module
- Fan port to USB adapter
- 64 GB or greater SD card recommended
- Internet access for the board

Software:

- `imx-6.18.20-2.0.0-navq` image

## Hardware Setup

1. Connect ARA-240 to top M.2 slot on MR-NavQ95.
2. The MR-NavQ95 does not have a fan port available for the ARA-240 fans. Currently, recommendation is to use a USB adapter and plug the fans in a separate USB port. Alternatively, one of the CAN ports in the CAN expansion board can be used with an adapter.

## Software setup

1. Flash the resulted image to the SD card using `uuu` normally and boot.
2. After login, check that the ARA has been successfully initialized by the image by running the following command:

   ```bash
   sudo chip_info.sh
   ```

   Output should contain a table. Note the firmware version (raw) value.

3. If the firmware version (raw) is not `131072` or higher (like in the above screenshot where it is `65794`), run the following commands to flash the new firmware:

   ```bash
   sudo program_flash.sh
   reboot
   ```

4. Run the following command to complete installation of the ARA module and resize the rootfs partition to the entire size of the SD card:

   ```bash
   sudo /usr/share/rt-sdk-ara240/install.sh
   ```

## Run CNNs (yolov8 or yolox)
> Note: Internet access is required for the next step.
1. Run the following command to download the yolov8 or yolox models locally:
   ```bash
   sudo fetch_models --repo-id nxp/YOLOv8
   sudo fetch_models --repo-id nxp/YOLOX-Detection-Ara240
   ```

2. Use the built-in performance script to check the inference performance of a downloaded modelL
   ```bash
   sudo run_model_perf.sh
   ```

3. For a more complex example, follow the readme at <https://github.com/nxp-imx-support/ara2-vision-examples> to install and run the vision examples.


## Run LLMs
> Note: Internet access is required for the next steps.
1. Run the following command to install the eIQ AAF Connector:

   ```bash
   sudo aaf-connector
   ```

2. Run the following command to download the Qwen2.5-7B model from NXP Huggingface. Available models are listed at <https://huggingface.co/nxp>

   ```bash
   sudo fetch_models --repo-id nxp/Qwen2.5-7B-Instruct-Ara240
   ```

   > Note: Internet access is no longer required from this point on.

3. Applications use the `/var/run/proxy.sock` file to communicate with the lower-level ARA-240 runtime stack. Use the following command to change permissions, allowing user-space applications to read and write to the file:

   ```bash
   sudo chmod a+rw /var/run/proxy.sock
   ```

4. Start the eIQ AAF Connector:

   ```bash
   aaf-connector &
   ```

5. Load the downloaded model with the following command:

   ```bash
   curl -X 'POST' 'http://127.0.0.1:8000/v1/models' \
     -H 'accept: application/json' \
     -H 'Content-Type: application/json' \
     -d '{"name": "Qwen2.5-7B-Instruct"}'
   ```

6. Test that everything is working with the following inference request:

    ```bash
    curl -H 'Content-Type: application/json' \
      -d '{ "model":"Qwen2.5-7B-Instruct","messages":[{"role":"user", "content":"Who are you?"}]}' \
      -X POST 0.0.0.0:8000/v1/chat/completions
    ```

## Available Models

NXP publishes a curated collection of models precompiled for the ARA-240 DNPU (CNNs such as YOLOv8/YOLOX and LLMs such as Qwen2.5) on Hugging Face. Use it to discover which models are available and how to fetch them with `fetch_models --repo-id nxp/<model>`:

- ARA240 model collection: <https://huggingface.co/collections/nxp/ara240-models>

## Further Documentation
1. Ara Software Release Notes (RN00459, Rev 2.1): <a href="../../../../release-notes/ara-software-release-notes-rn00459-2.1.pdf">ara-software-release-notes-rn00459-2.1.pdf</a>
2. Ara Runtime SDK documentation: <https://github.com/nxp-imx/rt-sdk-ara2/tree/main#-getting-started>
3. Ara Vision Examples: <https://github.com/nxp-imx-support/ara2-vision-examples>
4. Ara SDK for Model Compilation: <https://www.nxp.com/design/design-center/software/embedded-software/ara-software-development-kit:ARA-SDK>
5. eIQ AAF Connector: <https://github.com/nxp-imx-support/eiq-aaf-connector>
