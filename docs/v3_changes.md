---
id: v3_changes
title: VIA Version 3 Changes
sidebar_label: VIA Version 3 Changes
---

## Introduction

In VIA Version 1,the UI and the keyboard definitions were entirely self-contained (i.e. hard-coded). Adding new keyboards requires changing code and rebuilding/releasing the app.

VIA Version 2 moved the keyboard definitions into externally defined files, which are stored in a GitHub repository. The keyboard definitions are served to the VIA client at run-time. This allowed anyone to add new keyboards to VIA without requiring changing the source and rebuilding/releasing the app.

VIA Version 2 keyboard definitions include layout options and control of lighting, but definitions were restricted to the existing UI elements.

VIA Version 3 is a refactoring of how the UI works in VIA, to allow fully customized UI within VIA to control firmware parameters like lighting, but also **any custom feature** implemented in the firmware, either in QMK Core or at the keyboard level. It works by defining what UI elements VIA should show, and binding those UI elements to IDs, which VIA will use in communication with the firmware.

## Keyboard Definition Changes for VIA V2 to V3

This describes the changes made between V2 and V3.

### Lighting

The `lighting` element is deprecated and replaced by specifying **one or more** of the following in the `menus` element:

 - `"core/qmk_backlight"`
 - `"core/qmk_rgblight"`
 - `"core/qmk_rgb_matrix"`

**and/or** defining the custom UI in the `menus` element.

Example:

```json
"menus": [
    "via/keymap",
    "via/layouts",
    "via/macros",
    "via/save_load",
    "core/qmk_rgb_matrix"
]
```

Additionally, `"via/qmk_lighting"` should be added to the `keycodes` element to explicitly enable the QMK keycodes for lighting.

Example:

```json
"keycodes": ["via/keycodes", "via/qmk_lighting"]
```

The above additions are all that is required to enable the UI for controlling the stock lighting features of QMK.

### Menus

The `menus` element is new in V3, and used to define the UI (aka. menus) in VIA. It replaces how lighting control is defined, and allows for defining other run-time parameters of a keyboard firmware.

For example, a keyboard definition for a keyboard that uses the QMK RGB Matrix feature would have the following `menus` element:

```json
"menus": [
    "via/keymap",
    "via/layouts",
    "via/macros",
    "via/save_load",
    "core/qmk_rgb_matrix"
]
```

However, the `menus` element can contain a complete definition of custom UI, allowing full customization of the lighting page, or other custom feature requiring control by VIA.

For example, the item `"core/qmk_rgb_matrix"` in the `menus` element above could be replaced with the equivalent custom UI definition to control the QMK RGB Matrix feature, such as:

```json
"menus": [
    "via/keymap",
    "via/layouts",
    "via/macros",
    "via/save_load",
    [
        {
        "label": "Lighting",
        "content": [
            {
            "label": "Backlight",
            "content": [
                {
                "label": "Brightness",
                "type": "range",
                "options": [0, 255],
                "content": ["id_qmk_rgb_matrix_brightness", 3, 1]
                },
                ...
```

The use of `"core/qmk_backlight"`, `"core/qmk_rgblight"` and `"core/qmk_rgb_matrix"` in the `menus` element causes VIA to use the default UI definition that matches the firmware that is built when enabling these features. Firmware authors can replace these with custom UI definitions that are identical, and then change them to match changes made to the firmware.

The built-in UI definitions are located in the repository [here](https://github.com/the-via/keyboards/tree/master/common-menus).

The complete documentation for custom UI is [here](custom_ui).

### Firmware Version

```json
"firmwareVersion": 0
```

`firmwareVersion` is a way to version custom UI definitions. This new element ensures that VIA and the firmware are both using the same definition of custom UI (i.e. the `menus` element). If a feature is added or changed in the keyboard firmware, VIA will be able to detect when it is communicating with firmware built before this.

Firmware authors can increment the `VIA_FIRMWARE_VERSION` symbol in the QMK source code and the `firmwareVersion` in the VIA keyboard definition at the same time. `firmwareVersion` is optional, and will default to 0 if not present, matching the default `VIA_FIRMWARE_VERSION` in QMK. As such, most firmware authors may never need to set this element if they never change the features of the firmware.

Note that `firmwareVersion` is different to the VIA protocol version (`VIA_PROTOCOL_VERSION` in QMK), which ensures that VIA and the firmware are both using the same definition of command IDs and command paramters. For example. the change from V2 to V3 definitions is an example of how the VIA protocol version is used. 

## QMK Changes for VIA V2 to V3

VIA V2 definitions are used for QMK firmware built with VIA Protocol 10 or less.
VIA V3 definitions are used for QMK firmware built with VIA Protocol 11 or greater.

VIA will continue to function with existing firmware that was built with VIA Protocol 10 or less, by using the VIA V2 definition.

All V2 definitions were converted to equivalent V3 definitions in the repository, so that firmware built using VIA Protocol 11 will function as expected.

The following describes the changes in QMK between VIA Protocol 10 and 11.

### Commands

The commands for setting/getting lighting values have been replaced with commands for setting/getting "custom" values. Custom values can be for lighting or any other feature.

This in VIA Protocol 10:
```c
enum via_command_id {
    ...
    id_lighting_set_value                   = 0x07,
    id_lighting_get_value                   = 0x08,
    id_lighting_save                        = 0x09,
    ...
}
```
Is now this in VIA Protocol 11:
```c
enum via_command_id {
    ...
    id_custom_set_value                     = 0x07,
    id_custom_get_value                     = 0x08,
    id_custom_save                          = 0x09,
    ...
}
```

The "arguments" for these commands have changed between VIA Protocol 10 and VIA Protocol 11.

In VIA Protocol 10, the `id_lighting_set_value` and `id_lighting_get_value` commands were followed by the ID of the value to set/get (which could be of enum `via_lighting_value`), then followed by the value data.

In VIA Protocol 11, the `id_custom_set_value` and `id_custom_get_value` commands are followed by a `channel_id`, then followed by the ID of the value to set/get, which could be of:

 - enum `via_qmk_backlight_value`
 - enum `via_qmk_rgblight_value`
 - enum `via_qmk_rgb_matrix_value`
 - enum `via_qmk_audio_value`
 - enums for other features in QMK
 - enums defined at the keyboard level

`channel_id` serves two main purposes.

First, it acts as a qualifier to `value_id`, allowing multiple enums with overlapping integer ranges to be used, rather than a single enum that must be the superset of all values for all features, which was a limitation of VIA Protocol 10. This makes it modular and extendable. When a new feature is added to QMK which could be controlled by VIA, a new default `channel_id` value can be defined, a new enum of possible `value_id` can be defined, set/get value command handlers implemented, and default UI defined in VIA, all without affecting the existing ID ranges and command handlers.

Secondly, it supports easy routing of set/get value commands for a feature to appropriate handlers for that feature. This allows firmware authors to easily use any of the default handlers with no extra coding required, and optionally use `channel_id` value to route some commands to the default handler, and some commands to a custom handler at the keyboard level. For example, a keyboard with RGB lighting and an OLED display can use the default handler for QMK RGBLIGHT, and route commands for OLED control to a custom handler at the keyboard level.

In the VIA keyboard definition, when defining UI controls in the `menu` element, each UI control has a `content` element which binds that control to a `channel_id` and `value_id`.

```json
"label": "Backlight",
"content": [
    {
    "label": "Brightness",
    "type": "range",
    "options": [0, 255],
    "content": ["id_qmk_rgb_matrix_brightness", 3, 1]
    },
```

In this example, `3` is the `channel_id` (which matches the channel in QMK) and `1` matches enum value `id_qmk_rgb_matrix_brightness` in enum `via_qmk_rgb_matrix_value`. The string `"id_qmk_rgb_matrix_brightness"` is the `value_key`, used by VIA as a unique key.

### Keyboard Values

Keyboard values are used for getting/setting core VIA features like layout options. In VIA Protocol 11, two new values were added:

```c
enum via_keyboard_value_id {
    ...
    id_firmware_version    = 0x04,
    id_device_indication   = 0x05
};
```

`id_firmware_version` is used to get the firmware version, see #Firmware Versioning. It returns `VIA_FIRMWARE_VERSION` to VIA, for use in ensuring a match between the VIA keyboard definition and the firmware's handling of custom UI (aka. the `menus` element).

`id_device_indication` is set by VIA to allow the device to indicate that it is being configured. This is a refactoring of how VIA V2 would cause a keyboard with RGB backlighting to flash on/off when it became the keyboard being configured, which was done by sending `id_lighting_set_value` commands. This feature was refactored to be device agnostic. The default handler `via_set_device_indication()` will toggle any enabled QMK lighting feature and/or trigger audio playback. It can be overridden and customized at the keyboard level.
