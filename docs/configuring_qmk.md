---
id: configuring_qmk
title: Configuring QMK
sidebar_label: Configuring QMK
---

## Overview

VIA works by communicating with the firmware that is running on the device and sending it commands across USB. Enabling the VIA feature in QMK enables both the ability to communicate with the VIA Configurator and the ability to store keymaps and other settings.

- Create a `via` keymap directory and files within that are separate from the default keymap
- Make changes to the keyboard's `info.json` and `rules.mk` to make the firmware compatible

## Create a `via` Keymap Directory and Files in QMK Source

VIA compatible firmware must be a separate QMK build target from the default keymap. Create a `via` keymap directory, e.g. `keyboards/<keyboardname>/keymaps/via`

For acceptance into the upstream QMK repository this folder must be named `via`, but that is not an absolute requirement for your copy of the repository. It is possible to add VIA support to any keymap with the correct configuration.

## Create a `rules.mk` in `keyboards/<keyboard_name>/keymaps/via`

In most cases this file will only require:

    VIA_ENABLE = yes

Make sure `yes` is lowercase. `YES` will not enable VIA and you will be most confused.

This will enable dynamic keymaps, raw HID message handling and bootmagic lite.

‘Bootmagic Lite’ is the ability to hold down Esc (or some other key) while plugging in the keyboard to both jump to bootloader and reset the EEPROM. Thus if for some reason the EEPROM contains data that is out of sync with the firmware, and things aren’t working as expected (e.g. garbage keycodes in VIA), the device can be ‘factory reset’. It also makes redundant the need for a ‘QK_BOOT’ keycode in the keymap.

Do not put `VIA_ENABLE = yes` in the keyboard directory’s `rules.mk`. This configuration should only be added to VIA-specific keymaps, not enabled by default at the keyboard level.

## Create a `keymap.c` or `keymap.json` in `keyboards/<keyboardname>/keymaps/via`

The keymap in the `via` keymap folder should use a `LAYOUT_*()` macro that allows all the electrical positions to be mapped, even if that layout isn't physically possible.

By default, dynamic keymaps have 4 layers. These will be automatically populated with `KC_TRNS` keycodes as necessary, so there is no need to create additional blank layers in your keymap.

There typically is no need to use a `config.h` in the `via` keymap directory.

> Q: Can I use more or less than 4 layers?
>
> A: Yes, if it can fit in the EEPROM space. This is advanced usage and requires understanding how dynamic keymaps works and overriding the default settings.

## Changes to keyboard directory’s `info.json`

### Change `usb.vid` and `usb.pid`

There is a high probability that these values are the defaults from the QMK new keyboard script or were copied from another keyboard implementation and left unchanged, e.g:

    "usb": {
        "vid": "0xFEED",
        "pid": "0x0000",
    }

VIA Configurator uses these to identify the device, so they must be unique to the device.

Note that multiple versions/revisions of a keyboard PCB can use the same vendor/product if they function identically from VIA Configurator’s point of view, i.e. they have the same (or compatible) physical key layout and switch matrix topology and the same “layout macro” (mapping physical key layout to switch matrix layout) is used. VIA Configurator doesn’t care which I/O pins are being used, it just reads/writes keycodes to the dynamic keymaps stored in switch matrix addressing. As such, please consider carefully whether you actually need to create more than one vendor/product ID pair for multiple versions of the same keyboard PCB.

It is recommended to choose a value of `vid` that unique to the keyboard PCB’s designer/vendor, i.e. it will be the same for all keyboards with a common parent directory.

For example, keyboards in `/keyboards/wilba_tech` use:

    "vid": "0x6582"

After choosing a `vid` value, search for this value in all `info.json` files to ensure it is unique. To confirm your search is working correctly, the `info.json` being changed should be in the search results.

A suggested method of choosing a unique `vid` is choosing two letters from the keyboard’s designer/vendor name and using the two 8-bit ASCII values of these letters.

For example, keyboards in `/keyboards/kingly_keys` will all use:

    "vid": "0x4B4B"

The ASCII value of the letter “K” is 4B. Thus **K**ingly **K**eys becomes 0x4B4B.

Choose a `pid` that is unique for all keyboards using the same `vid`. They can simply be numbered sequentially, e.g. 0x0001, 0x0002.

> Q: Wouldn’t it be better if all VIA compatible keyboards used the same vendor/product IDs (perhaps an officially licenced one) and then VIA queries to get the device identity?
>
> A: Yes, it would be slightly better, but this method continues QMK’s unofficial use of arbitrary vendor/product IDs and doesn’t introduce another unique ID.

### Change `keyboard_name`

The value of `keyboard_name` in `info.json` is what will appear in the list of devices (for example, in the ‘Bluetooth & other devices’ page of Windows, and in a notification when the device is first connected and being ‘installed’).

    "keyboard_name": "WT60-D"

VIA Configurator will switch to using the value of `keyboard_name` when displaying the device’s name in the future, rather than using the name in the VIA layout definition. This will allow firmware level customization.

Note that spaces are allowed.

### Set `bootmagic.matrix` (optional)

If the Esc key (or top left key) of the keyboard is not at matrix position (0,0), then explicitly set its matrix position in `info.json` at the keyboard level.

    "bootmagic": {
        "matrix": [3, 4]
    }

For consistency, it should be set to the top left key of the keyboard, even if this is not the Esc key (e.g. left side numpad keyboards, 40% and smaller keyboards, etc). Always test this works before submitting the PR to QMK.

You may want to consider enabling bootmagic lite at the keyboard level (i.e. adding `"bootmagic": true` to the `features` list in `info.json`). This will automatically be enabled for VIA-enabled builds, but it is still useful for VIA-disabled builds so that the device can be switched into bootloader mode without requiring a `QK_BOOT` keycode or pressing the reset button on the PCB.

## VIA settings in `config.h`

The VIA implementation in QMK will automatically define its own settings for EEPROM usage, the number of layers used for dynamic keymaps, etc. Unless the keyboard requires loading/saving its own state to EEPROM outside of QMK’s core EEPROM usage, there is no need to override the default settings.

However, if you are doing something advanced and require changing VIA’s settings, add a `config.h` to the `via` keymap directory.

### `VIA_EEPROM_LAYOUT_OPTIONS_SIZE`

`VIA_EEPROM_LAYOUT_OPTIONS_SIZE` controls the size of EEPROM memory to store layout options (1-4 bytes, default 1). The number of bits to store one layout option is the number of bits to store the largest choice number, i.e. 1 bit for 2 choices, 2 bits for 3-4 choices, 3 bits for 5-8 choices, 4 bits for 9-16 choices. You only need to override this in `config.h` if you need more than 8 bits total.

### `VIA_EEPROM_CUSTOM_CONFIG_SIZE`

`VIA_EEPROM_CUSTOM_CONFIG_SIZE` controls the size of EEPROM memory to store keyboard specific configuration, such as lighting settings, rotary encoder settings, display settings. It defaults to 0 bytes. Keyboard level code can use `VIA_EEPROM_CUSTOM_CONFIG_ADDR` as the start address of EEPROM reserved for its use.

## EEPROM Memory Usage

When VIA is enabled, EEPROM memory is assigned as:

- QMK Core
- VIA (`VIA_EEPROM_MAGIC_ADDR` to `VIA_EEPROM_CUSTOM_CONFIG_ADDR-1`)
- Custom Config (`VIA_EEPROM_CUSTOM_CONFIG_ADDR` to `VIA_EEPROM_CUSTOM_CONFIG_ADDR+VIA_EEPROM_CUSTOM_CONFIG_SIZE-1`)
- Dynamic Keymaps (`DYNAMIC_KEYMAP_EEPROM_ADDR` to `DYNAMIC_KEYMAP_MACRO_EEPROM_ADDR-1`)
- Macros (`DYNAMIC_KEYMAP_MACRO_EEPROM_ADDR` to `DYNAMIC_KEYMAP_MACRO_EEPROM_ADDR+DYNAMIC_KEYMAP_MACRO_EEPROM_SIZE-1`)

Unless a keyboard is implementing its own storage of state, there is no need to set anything. By enabling VIA, the defaults are set to use EEPROM memory as above. By default, dynamic keymaps are configured to use 4 layers, and the remaining EEPROM memory (up to 1K) is used for macros.

## Running out of space?

Keyboards with many features and/or large keymaps may fail to compile with VIA support if there is not enough flash memory or EEPROM available.

Reducing the number of dynamic keymap layers available will lower EEPROM usage and firmware size. This can be accomplished by setting `dynamic_keymap.layer_count` appropriately in `info.json`:

    "dynamic_keymap": {
        "layer_count": 3
    }

To reduce firmware size, consider turning on link time optimization by adding `LTO_ENABLE = yes` to the keymap directory's `rules.mk` file. This may have unexpected side effects on keyboards using ARM processors, so test thoroughly with it enabled and disabled.

If link time optimization doesn't get the job done or exposes buggy behavior, you may have to disable QMK features. More advice on this can be found [in QMK's documentation](https://docs.qmk.fm/#/squeezing_avr).
