---
id: specification
title: Specification
sidebar_label: Specification
---

## Name

```json
  "name": "Macropad",
```

The `name` property denotes the name of the keyboard being defined.

## Vendor & Product ID

```json
  "vendorId": "0x5241",
  "productId": "0x1234",
```

The `productId` property corresponds to the usb product id. This combined with the `vendorId` is what is used by VIA to identify the keyboard when it is plugged in.

## Matrix

```json
  "matrix": {"rows": 1, "cols": 6},
```

The `matrix` property defines how many rows and columns the PCB's switch matrix uses. This must match the `MATRIX_ROWS` and `MATRIX_COLS` symbols in the QMK firmware.

## Layouts

```json
  "layouts": {
    ...
    "keymap": [
      [{"c": "#505557", "t": "#d9d7d7", "a": 7}, "0,0", "0,1", "0,2"],
      ["0,3", "0,4", "0,5"]
    ]
    ...
  }
```

The `keymap` property corresponds to the KLE json exported by [KLE](http://keyboard-layout-editor.com) and has the switch row, col defined in the top-left legends and optionally the group number, option number defined in the bottom-right legends. The KLE can support up to 3 different colored keys which is used to identify the alpha, modifier and accent keys which VIA will automatically apply a theme to.

```json
  "layouts": {
    ...
    "labels": [
      "Split Backspace",
      "ISO Enter",
      "Split Left Shift",
      "Split Right Shift",
      ["Bottom Row", "ANSI", "7U", "HHKB", "WKL"]
    ],
    ...
  }
```

The `labels` property is an optional array of `string` or `string[]` and defines the labels for the layout controls.

The order of the labels is important as the implicit index is used to map to the group number e.g. `Split Backspace` corresponds to layout option #0, `ISO` corresponds to layout option #1, etc.

If an item in the `labels` array is a `string`, it is presented as a toggle button, the off state maps to layout option choice #0 (the default), the on state maps to layout option choice #1.

If an item in the `labels` array is a `string[]`, it maps to a select control with the first item in the array being used as the label for the control and the following items being used as labels of layout option choices #0, #1, #2, etc. In the example above, the `Bottom Row` is the label, `ANSI` maps to layout option choice #0, `7U` maps to layout option choice #1, etc.

Documentation explaining how layout options work is [here](layouts).

## Menus

The `menus` element is used to define more menus in VIA. It can contain **one or more** of the following built-in UI definitions:

 - `"qmk_backlight"`
 - `"qmk_rgblight"`
 - `"qmk_backlight_rgblight"`
 - `"qmk_rgb_matrix"`
 - `"qmk_audio"`

**and/or** a definition of custom UI, i.e. explicitly defining all the UI controls required.

For example, a definition enabling the built-in UI for QMK RGB Matrix could be done like so:

```json
"menus": ["qmk_rgb_matrix" ]
```

**or alternatively** defined explicitly using custom UI definitions, like so:

```json
...
"menus": [
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
        ]
      }
    ]
  }
]
```

The complete documentation for custom UI is [here](custom_ui).

If the firmware is using the stock implementation of a feature, i.e. it is enabled in the `info.json` or the `rules.mk` and not customized, then using one of the built-in UI definitions is all that is needed.

The built-in UI definitions are defined the same way as custom UI definitions (i.e. JSON format) and for reference are located here: https://github.com/the-via/keyboards/tree/master/common-menus. They can be used as examples to create custom UI definitions.


## Keycodes

If the definition is for a keyboard that uses QMK lighting, you can optionally enable the lighting keycodes.

```json
  "keycodes": ["qmk_lighting"],
  "menus": ["qmk_rgblight"],
```
