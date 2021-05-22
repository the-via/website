---
id: configuring_qmk
title: Configuring QMK
sidebar_label: Configuring QMK
---

## Overview

VIA works by communicating with the firmware that is running on the device and sending it commands across USB. Enabling the VIA feature in QMK is enabling both the ability to communicate with the VIA Configurator and the ability to store keymaps and other settings.

- Create a `via` keymap directory and files within to make a VIA enabled firmware different to the default
- Make changes to the keyboard's `config.h` and `rules.mk` to make the firmware compatible

## Create a `via` Keymap Directory and Files in QMK Source

In order to allow VIA compatible firmware to be a separate QMK build target from the default, create a `via` keymap directory e.g. `keyboards/<keyboardname>/keymaps/via`

## Create a `rules.mk` in `keyboards/<keyboard_name>/keymaps/via`

In most cases this will only require:

    VIA_ENABLE = yes

This will enable dynamic keymaps, raw HID message handling and bootmagic lite.

Note: ‘bootmagic lite’ is highly recommended to the point of being essential. ‘bootmagic lite’ is the ability to hold down Esc (or some other key) while inserting USB cable to both jump to bootloader and reset the EEPROM. Thus if for some reason the EEPROM contains data that is out of sync with the firmware, and things aren’t working as expected (e.g. garbage keycodes in VIA), the device can be ‘factory reset’. It also makes redundant the need for a ‘RESET’ keycode in the keymap. The VIA implementation in QMK overrides the default ‘bootmagic_lite()’ but the only difference is additionally invalidating VIA’s EEPROM memory.

The keyboard’s own `rules.mk` should be compatible with the VIA-specific firmware and so nothing else is needed.

Currently, VIA is incompatible with features that change the integer values of `enum quantum_keycodes`, i.e. that optionally add enum values to `enum quantum_keycodes` and change the sequential assignment of integer values to enum names. As such, the following features must be disabled for VIA support, until this issue is fixed (i.e. a refactor of `enum quantum_keycodes`):

- LEADER_ENABLE
- FAUXCLICKY_ENABLE
- MIDI_ENABLE
- BLUETOOTH_ENABLE
- KEY_LOCK_ENABLE
- TERMINAL_ENABLE

## Create a `keymap.c` in `keyboards/<keyboardname>/keymaps/via`

The `keymap.c` in the `via` keymap directory should have a default keymap with the same number of layers as is being used for dynamic keymaps (by default, this is 4). This is so that the dynamic keymaps are initially loaded with sensible default keycodes (mostly `KC_TRNS`), rather than random values. It should use a `LAYOUT_*()` macro that is able to set the "default keymap" (as defined in `<keyboard.json>` to the correct default keycodes.
There typically is no need to use a `config.h` in the `via` keymap directory. Any settings required for VIA should be put in the keyboard directory’s `config.h`

> Q: Can I use more or less than 4 layers?
>
> A: Yes, if it can fit in the EEPROM space. This is advanced usage and requires understanding how dynamic keymaps works and overriding the default settings.

## Changes to keyboard directory’s `rules.mk`

In order to make VIA support not enabled by default (i.e. so dynamic keymaps is not enabled for QMK Configurator builds, or power users’ compiled QMK firmware), do not put `VIA_ENABLE = yes` in the keyboard directory’s `rules.mk`. Instead, only put this in the `via` keymap directory’s `rules.mk`

You may want to consider enabling bootmagic lite (i.e. change to `BOOTMAGIC_ENABLE = lite`). This will automatically be enabled for VIA-enabled builds, but it is useful for VIA-disabled builds so that the device can be switched into bootloader mode without requiring a `RESET` keycode or pressing the reset button on the PCB.

You may want to consider turning on link time optimization `LTO_ENABLE = yes` to reduce firmware size.

Disabling Mouse Keys `MOUSEKEY_ENABLE = no` will also reduce firmware size.

## Changes to keyboard directory’s `config.h`

### Change `VENDOR_ID`, `PRODUCT_ID`

There is a high probability that these values are the defaults from the QMK new keyboard script or were copied from another keyboard implementation and left unchanged, e.g:

    #define VENDOR_ID 0xFEED
    #define PRODUCT_ID 0x0000

VIA Configurator uses these to identify the device, so they must be unique to the device.

Note that multiple versions/revisions of a keyboard PCB can use the same vendor/product if they function the same from VIA Configurator’s point of view, i.e. they have the same (or compatible) physical key layout and switch matrix topology and the same “layout macro” (mapping physical key layout to switch matrix layout) is used. VIA Configurator doesn’t care which I/O pins are being used, it just reads/writes keycodes to the dynamic keymaps stored in switch matrix addressing. As such, please consider carefully whether you actually need to create more than one vendor/product ID pair for multiple versions of the same keyboard PCB.

It is recommended to choose a value of `VENDOR_ID` that unique to the keyboard PCB’s designer/vendor, i.e. it will be the same for all keyboards with a common parent directory.

For example, keyboards in `/keyboards/wilba_tech` use:

    #define VENDOR_ID       0x6582 // wilba.tech

After choosing a `VENDOR_ID` value, search for this value in all `config.h` files to ensure it is unique. To confirm your search is working correctly, the `config.h` being changed should be in the search results.

A suggested method of choosing a unique `VENDOR_ID` is choosing two letters from the keyboard’s designer/vendor name and using the two 8-bit ASCII values of these letters.

For example, keyboards in `/keyboards/kingley_keys` will all use:

    #define VENDOR_ID 0x4B4B // “KK” = Kingley Keys

Choose a `PRODUCT_ID` that is unique for all keyboards using the same `VENDOR_ID`. They can simply be numbered sequentially, e.g. 0x0001, 0x0002.

> Q: Wouldn’t it be better if all VIA compatible keyboards used the same vendor/product IDs (perhaps an officially licenced one) and then VIA queries to get the device identity?
>
> A: Yes, it would be slightly better, but this method continues QMK’s unofficial use of arbitrary vendor/product IDs and doesn’t introduce another unique ID.

### Change `PRODUCT`

The text defined by the `PRODUCT` symbol in `config.h` is what will appear in the list of devices (for example, in the ‘Bluetooth & other devices’ page of Windows, and in a notification when the device is first connected and being ‘installed’).

It is highly recommended that the value of `PRODUCT` is changed to be a combination of designer/vendor and the device name. For example:

    #define MANUFACTURER    wilba.tech
    #define PRODUCT         wilba.tech WT60-D
    #define DESCRIPTION     wilba.tech WT60-D

VIA Configurator will in future switch to using the value of `PRODUCT` when displaying the device’s name, rather than the name in the `<keyboard_name>.json`. This will allow firmware level customization.

Note that spaces are allowed.

### Change `BOOTMAGIC_LITE_ROW`, `BOOTMAGIC_LITE_COLUMN` (optional)

VIA implementation will enable bootmagic lite since it is practically essential. If the Esc key (or top left key) of the keyboard is not at matrix position (0,0), then explicitly set `BOOTMAGIC_LITE_ROW` and `BOOTMAGIC_LITE_COLUMN` in `config.h`. For consistency, it should be set to the top left key of the keyboard, even if this is not the Esc key (e.g. left side numpad keyboards, 40% and smaller keyboards, etc). Always test this works before submitting the PR to QMK.

## VIA settings in `config.h`

The VIA implementation in QMK will automatically define its own settings for EEPROM usage, the number of layers used for dynamic keymaps, etc. Unless the keyboard requires loading/saving its own state to EEPROM outside of QMK’s core EEPROM usage, there is no need to override the default settings in `config.h`

However, if you are doing something advanced and require changing VIA’s settings, do this in the keyboard level’s `config.h`. Keyboards that use EEPROM for backlight or rotary encoder handling can use code in `via.h` for builds with or without VIA support.

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

Unless a keyboard is implementing it's own storage of state, there is no need to set anything, by enabling VIA, the defaults are set to use EEPROM memory as above. By default, dynamic keymaps are configured to use 4 layers, and the remaining EEPROM memory (up to 1K) is used for macros.
