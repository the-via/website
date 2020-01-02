---
id: specification
title: Required Properties
sidebar_label: Required Properties
---

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

The `lighting` property can either a preset: `none`, `qmk_backlight`, `wt_rgb_backlight`, `wt_mono_backlight` or for more advanced usage an object that extends one of those presets.

## Matrix

```json
{
  ...
  "matrix": {"rows": 1, "cols": 6},
  ...
}
```

The `matrix` property defines how many rows and columns the pcb switch matrix uses.

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
  }
  ...
}
```

The keymap property corresponds to the KLE json exported by [KLE](keyboard-layout-editor.com) and has the switch row, col defined in the top-left legends and optionally the group number, option number defined in the bottom-right legends. The KLE can support up to 3 different colored keys which is used to identify the alpha, modifier and accent keys which VIA will automatically apply a theme to.
