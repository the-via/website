---
id: specification
title: Required Properties
sidebar_label: Required Properties
---

VIA needs a graphical representation of your PCB.  This representation is unique to your board and is either checked into https://github.com/the-via/keyboards or is provided by you in the "Design" tab of VIA.

This document describes the format of this JSON configuration file.

Take special notice of the VendorId and the ProductId - they are what VIA reads over USB to discover your JSON file.

Please find example files at https://github.com/the-via/keyboards

## Name

```json
{
  ...
  "name": "RAMA WORKS M6-A",
  ...
}
```

The `name` property denotes the name of the keyboard being defined.

## Vendor & Product ID

```json
{
  ...
  "vendorId": "0x5241",
  "productId": "0x006a",
  ...
}
```

The `productId` property corresponds to the usb product id. This combined with the `vendorId` is what is used by VIA to identify the keyboard when it is plugged in.

## Lighting

```json
{
  ...
  "lighting": "none",
  ...
}
```

The `lighting` property can either a preset: `none`, `qmk_backlight`, `qmk_rgblight`, `qmk_backlight_rgblight`, `wt_rgb_backlight`, `wt_mono_backlight` or for more advanced usage an object that extends one of those presets.

Use `qmk_backlight` if the firmware enables QMK's core backlight feature with `BACKLIGHT_ENABLE=yes`.

Use `qmk_rgblight` if the firmware enables QMK's core RGB Lighting feature with `RGBLIGHT_ENABLE=yes`.

Use `qmk_backlight_rgblight` if the firmware enables both.

Use of `wt_rgb_backlight` and `wt_mono_backlight` is for keyboards that use the lighting code in `/keyboards/wilba_tech` and not intended to be a generalized interface to other custom lighting implementations. A generalized interface is being developed. Keyboards that do not use QMK's core lighting implementations should wait for the generalized interface instead of implementing the current interface.

## Matrix

```json
{
  ...
  "matrix": {"rows": 1, "cols": 6},
  ...
}
```

The `matrix` property defines how many rows and columns the PCB's switch matrix uses. This must match the `MATRIX_ROWS` and `MATRIX_COLS` symbols in the QMK firmware.

## Layouts

```json
{
  ...
  "layouts": {
    ...
    "keymap": [
      [{"c": "#505557", "t": "#d9d7d7", "a": 7}, "0,0", "0,1", "0,2"],
      ["0,3", "0,4", "0,5"]
    ]
    ...
  }
  ...
}
```

The keymap property corresponds to the KLE json exported by [KLE](keyboard-layout-editor.com) and has the switch row, col defined in the top-left legends and optionally the group number, option number defined in the bottom-right legends. The KLE can support up to 3 different colored keys which is used to identify the alpha, modifier and accent keys which VIA will automatically apply a theme to.
