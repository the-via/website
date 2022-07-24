---
id: custom_ui
title: Custom UI
sidebar_label: Custom UI
---

## Introduction

The `menus` element is used to define the UI (aka. menus) in VIA. It can contain **one or more** of the following built-in UI definitions:

 - `"via/keymap"`
 - `"via/layouts"`
 - `"via/macros"`
 - `"core/qmk_backlight"`
 - `"core/qmk_rgblight"`
 - `"core/qmk_rgb_matrix"`
 - `"core/qmk_audio"`

**and/or** defining the custom UI.

For example, a definition enabling the built-in UI for QMK RGB Matrix could be done like so:

```json
...
"menus": [
  "via/keymap",
  "via/layouts",
  "via/macros",
  "via/save_load",
  "core/qmk_rgb_matrix"
],
...
```

**or alternatively** defined explicitly using custom UI definitions, like so:

```json
...
"menus": [
  "via/keymap",
  "via/layouts",
  "via/macros",
  "via/save_load",
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
      },
      ...
    ]
  },
  ...
],
...
```

The `"via/keymap"`, `"via/layouts"` and `"via/macros"` strings enable the built-in UI of VIA. They may also be conditionally hidden depending on keyboard defition and firmware.

The `"core/qmk_backlight"`, `"core/qmk_rgblight"`, `"core/qmk_rgb_matrix"` and `"core/qmk_audio"` strings enable the built-in UI definitions that match the default implementation of VIA protocol handlers in QMK, with respect to `channel_id`, `value_id`, etc.

These built-in UI definitions are defined the same way as custom UI definitions (i.e. JSON format) and for reference are located [here](https://github.com/the-via/keyboards/tree/master/common-menus). They can be used as examples to create custom UI definitions.

## Structure

A custom UI definition (as a child element of `menu`) consists of a single top-level menu element with `label` and `content` elements.

A top-level menu element must contain one or more sub-menu elements as an array in `content`.

Each sub-menu element consists of a `label` and `content` element, and must contain one or more UI control elements as an array in the `content` element. 

Each UI control element must have `label`, `type` and `content` elements.

Thus the "tree" has a maximum depth of three: top-level menu, sub-menu and UI control, and the type of entity is inferred from the depth.

## Top Level Menus and Sub-Menus

Each element in the `menus` element defines a top-level menu, either a built-in one or a custom defined one. When custom defined, `label` defines the name displayed in the top left menu of the VIA app, and `content` is an array of sub-menu elements.

The following example defines:
 - the common VIA top level menus `Keymap`, `Layouts`, `Macros` and `Save + Load`
 - a top level menu `Lighting` with sub-menus `Underglow` and `Indicators`
 - a top level menu `Display` with sub-menus `General` and `Advanced`

```json
...     
"menus": [
  "via/keymap",
  "via/layouts",
  "via/macros",
  "via/save_load", 
  {
    "label": "Lighting",
    "content": [
      {
        "label": "Underglow",
        ...
      },
      {
        "label": "Indicators",
        ...
      }
    ]
  },
  {
    "label": "Display",
    "content": [
      {
        "label": "General",
        ...
      },
      {
        "label": "Advanced",
          ...
      }
    ]
  }
],
...
```

VIA will then display `Lighting` and `Display` in the top left menu, and then display the sub-menus in the bottom left, like this:

![Top Level Menus](/img/custom_ui_top_level_menus.png)

**Note: Top-level menus should be consistent across all keyboards in VIA.**

For example, all custom UI defined for any kind of lighting should use a top-level menu called `Lighting`, and then the sub-menus should be named with the specifics of that lighting, such as `Underglow`, `Buttglow®`, `Backlight`, `Indicators`.

Other top-level menus should be similarly generalized, such as `Audio`, `Display`, `Encoders`, etc.

Multiple top-level menus with the same name will merge to become a single top-level menu. This allows multiple built-in UI definitions and/or custom UI definitions to share the same menu heirarchy. For example, `"core/qmk_backlight"` and `"core/qmk_rgblight"` both define UI under a top-level menu `Lighting`, so when combined, there will be only one `Lighting` menu with sub-menus `Backlight` and `Underglow`.

In the case where a built-in definition requires some changes to match the firmware, the built-in definition can be inserted in place in the `menus` element and modified. In most cases, the default handlers in the firmware can be used.

Examples of this are:
 - Replacing the sub-menu name `Underglow` with a different name
 - Configuring the set of lighting effects (e.g. changing the array of string/number pairs)
 - Adding a new sub-menu and controls to match keyboard-level code which overrides the default behaviour (e.g. customized indicators)

This is facilitated by the use of `channel_id` in the set/get custom value commands. See [#Channels](#channels)

## UI Controls

### Definition

The sub-menu element has a `content` element, which is an array of UI control elements. Each UI control element must have `label`, `type` and `content` elements.

Example:

```json
...  
"menus": [
  "via/keymap",
  "via/layouts",
  "via/macros",
  "via/save_load", 
  {
    "label": "Lighting",
    "content": [
      {
        "label": "Underglow",
        "content": [
          {
            "label": "Brightness",
            "type": "range",
            "options": [0, 255],
            "content": ["id_qmk_rgblight_brightness", 2, 1]
          },
          {
            "label": "Effect",
            "type": "dropdown",
            "content": ["id_qmk_rgblight_effect", 2, 2],
            "options": [
              ["All Off", 0],
              ["Solid Color", 1],
              ["Breathing 1", 2],
              ...
            ]
          },
          ...
        ]
      }
    ]
  },
  ...
]
...
```

`label` defines the text label on the left of the control

`type` defines the type of control. Valid values are `range`, `dropdown`, 

`options` defines the possible values of the control (the numerical range, or string/integer values)

`content` defines the binding of the control to the `channel_id` and `value_id` used in the VIA protocol. These values are preceeded by a `value_key` string that is used by VIA. The `value_key` should match the name of the enum value in the firmware for uniqueness and readability. It must be unique for all UI controls in a UI definition.

For example:
```json
{
  "label": "Brightness",
  "type": "range",
  "options": [0, 255],
  "content": ["id_qmk_rgblight_brightness", 2, 1]
},
```
... defines a range (slider) UI control, labelled `Brightness`, with a range of 0 to 255. It will be using `channel_id` of `2` and `value_id` of `1` in the VIA protocol to set/get the value in the firmware. It has a `value_key` of `"id_qmk_rgblight_brightness"` because the `value_id` of `1` matches the integer value of `id_qmk_rgblight_brightness` in enum `id_qmk_rgblight` in the firmware code.

### Toggle Control

The toggle control is a toggle switch that controls a boolean (on/off) value.

![Custom UI Toggle Control](/img/custom_ui_toggle_control.png)

```json
{
  "label": "God Mode",
  "type": "toggle",
  "content": ["id_god_mode", 0, 1]
}
```

The default value data is one byte, either `0` or `1`. The `options` element can be used to define the two values if required, using an array of two values.

### Range Control

The range control is a slider that controls a numeric value. The `options` element defines the range limits, e.g. `"options": [0, 255],`. The value data is either one or two bytes depending on the range.

![Custom UI Range Control](/img/custom_ui_range_control.png)

```json
{
  "label": "Audacity",
  "type": "range",
  "options": [0, 255],
  "content": ["id_audacity", 0, 2]
}
```

### Dropdown Control

The dropdown control is a drop-down menu of strings, which maps to an integer value. The `options` element defines an array of string/integer pairs, e.g.

![Custom UI Dropdown Control](/img/custom_ui_dropdown_control.png)

```json
{
  "label": "Date Format",
  "type": "dropdown",
  "options": [
    ["yyyy-mm-dd", 0],
    ["dd/mm/yyyy", 1],
    ["mm/dd/yyyy", 2]
  ],
  "content": ["id_date_format", 0, 5]
}
```

### Color Control

The color control is a swatch of color showing the current color value, which pops up a color picker when clicked. It allows selection of hue and saturation values only, since brightness is usually controlled separately in lighting code.

![Custom UI Color Control](/img/custom_ui_color_control.png)

```json
{
  "label": "Color",
  "type": "color",
  "content": ["id_qmk_rgblight_color", 2, 4]
}
```

### Keycode Control

The keycode control allows display and editing of a QMK keycode. Firmware writers can use this for custom rotary encoder handling or any other way of triggering keycode events.

![Custom UI Keycode Control](/img/custom_ui_keycode_control.png)

```json
{
  "label": "Head Slam",
  "type": "keycode",
  "content": ["id_head_slam", 0, 6]
}
```

### Showing/Hiding Controls

Sometimes good UI design requires only showing a control when another control is in a given state. For example, a dropdown control for a "mode" and only showing controls which are used in that "mode".

The `showIf` element can be used to show one (or more) UI controls only if the expression evaluates true.

The built-in UI for `qmk_rgblight` shows an example of `showIf`. The `Effect Speed` and `Color` are only shown for some `Effect` values. Note how the value of a dropdown control evaluates to the number value of the string/number pair.

Example:

```json
"content": [
  ...
  {
    "label": "Effect",
    "type": "dropdown",
    "content": ["id_qmk_rgblight_effect", 2, 2],
    "options": [
      ["All Off", 0],
      ["Solid Color", 1],
      ["Breathing 1", 2],
      ["Breathing 2", 3],
      ["Breathing 3", 4],
      ["Breathing 4", 5],
      ...
    ]
  },
  {
    "showIf": "{id_qmk_rgblight_effect} >= 2",
    "label": "Effect Speed",
    "type": "range",
    "options": [0, 3],
    "content": ["id_qmk_rgblight_effect_speed", 2, 3]
  },
  {
    "showIf": "{id_qmk_rgblight_effect} > 0",
    "label": "Color",
    "type": "color",
    "content": ["id_qmk_rgblight_color", 2, 4]
  }
  ...
]
```

Alternatively, the `showIf` element can "contain" one or more UI controls, which are only shown if the expression evaluates true. 

For example, the following will only display the `Audacity` and `Tenacity` range controls if the `God Mode` toggle is on.

```json
...
{
  "label": "God Mode",
  "type": "toggle",
  "content": ["id_god_mode", 0, 1]
},
{
  "showIf": "{id_god_mode} == 1",
  "content": [
    {
      "label": "Audacity",
      "type": "range",
      "options": [0, 255],
      "content": ["id_audacity", 0, 2]
    },
    {
        "label": "Tenacity",
        "type": "range",
        "options": [0, 255],
        "content": ["id_tenacity", 0, 3]
    }
  ]
},
...
```

The expression evaluator uses operators such as `==`, `!=`, `<`, `<=`, `>`, `>=`, `||`, `&&`, `!`, `(`, `)`. Values are referenced by enclosing their key string in `{` and `}`.

### Array Values

Sometimes firmware has a set of the same type of values, for which enumerating each in an enum, and using a range of `value_id` values, is not elegant.

In this situation, **one or more numbers** can be added after the `value_id` in the `content` element, These can be used for any purpose in the firmware, such as an index to an array.

Example:

```json
...
"content": ["id_some_value_array[0]", 9, 99, 0]
...
```

For example, to control 3 color values, rather than defining 3 enum values in firmware, a single enum value `id_buttglow_color` can be used, a single integer value used for `value_id`, and a value index appended in the UI control definition, as follows: 

```json
...
{
  "label": "Color 1",
  "type": "color",
  "content": ["id_buttglow_color[0]", 0, 4, 0]
},
{
  "label": "Color 2",
  "type": "color",
  "content": ["id_buttglow_color[1]", 0, 4, 1]
},
{
  "label": "Color 3",
  "type": "color",
  "content": ["id_buttglow_color[2]", 0, 4, 2]
},
...
```

Note that the `value_key` (the string in `content`) must be unique per UI control, so for array values, include the array index in the string.

See [Handling Array Values](#handling-array-values)

## Firmware Implementation

Custom UI is handled in firmware by handling three commands of the VIA protocol:

 - `id_custom_set_value`
 - `id_custom_get_value`
 - `id_custom_save`

When enabling VIA and a feature (like lighting) in QMK Core, by default, the command handlers that match the built-in UI definitions will be compiled. Firmware authors who do not add or extend a feature do not need to write handlers of the above commands.

The following describes how to implement handlers for the above commands, in keyboard level code, to match the custom UI definitions in VIA.

### Channel ID

`id_custom_set_value` and `id_custom_get_value` commands use a `channel_id` for routing commands to handlers for that feature, and a `value_id` to identify the value.

`channel_id` is a qualifier to `value_id`, allowing multiple enums with overlapping integer ranges to be used, rather than a single enum that must be the superset of all values for all features.

The built-in UI definitions use `channel_id` values that match the default values in firmware. When using custom UI definitions, the `channel_id` values can be defined to anything on both sides (QMK and VIA).

`id_custom_save` command uses a `channel_id` to signal saving the current state of values associated with that channel. See [Saving Values](#saving-values)

### Value ID

When implementing a new feature, either in QMK Core or at the keyboard level, define a new enum for the possible `value_id` values, explicitly assigning integer values starting with `1`.

For example:

```c
enum via_buttglow_value {
    id_buttglow_brightness   = 1,
    id_buttglow_effect       = 2,
    id_buttglow_effect_speed = 3,
    id_buttglow_color        = 4
};
```

### Command Handlers

`via_custom_value_command()` (in `via.c`) has the default handling of custom value commands for QMK Core modules like lighting. It will use the `channel_id` to route the commands to handlers specific to that feature. If the `channel_id` in the command does not match the channels it is enabled to handle, it will call `via_custom_value_command_kb()`, allowing keyboard level code to handle the commands for that `channel_id`.

Thus, overriding `via_custom_value_command_kb()` in the keyboard level code allows firmware authors to write a command handler to set/get the values defined by the custom UI definition in VIA.

In the simple case of implementing a few keyboard specific custom values, it is recommended to use a `channel_id` of `0`, which won't conflict with the channels being handled in `via.c`, as these start with `1`. However, firmware authors could choose to use multiple `channel_id` values, to support multiple features.

It is possible to combine the default command handlers for a QMK feature (using the default `channel_id`) with a command handler for a keyboard specific feature. For example, a firmware author could use the built-in UI for RGB Matrix on channel `4`, and implement `via_custom_value_command_kb()` to only handle commands on channel `0`.

In the rare case of needing to subvert/extend/replace the default custom value handling of a QMK feature, `via_custom_value_command()` itself can be overridden and reimplemented in keyboard level code, handling the default `channel_id` for a QMK feature.

The following is an example of implementing `via_custom_value_command_kb()`. It routes the three commands to functions to handle each command, this avoids nested switch/case statements and improves readability.

```c
void via_custom_value_command_kb(uint8_t *data, uint8_t length) {
    uint8_t *command_id              = &(data[0]);
    uint8_t *custom_value_channel_id = &(data[1]);
    uint8_t *custom_value_data       = &(data[2]);

    // Buttglow is on channel 0
    if ( *custom_value_channel == 0 ) {
        switch ( *command_id )
        {
            case id_custom_set_value:
            {
                buttglow_config_set_value(custom_value_data);
                break;
            }
            case id_custom_get_value:
            {
                buttglow_config_get_value(custom_value_data);
                break;
            }
            case id_custom_save:
            {
                buttglow_config_save();
                break;
            }
            default:
            {
                // Unhandled message.
                *command_id = id_unhandled;
                *custom_value_data = *custom_value_data; // force use of variable
                break;
            }
        }
        return;
    }

    // Return the unhandled state
    *command_id = id_unhandled;
    
    // DO NOT call raw_hid_send(data,length) here, let caller do this
}
```

The following is an example of implementing the set/get command handlers specific to a feature - switch on possible values and set/get the values to/from a global struct which stores the state being used by the feature. Triggering update functions on state change can be optionally added.

```c
void buttglow_config_set_value( uint8_t *data )
{
    uint8_t *value_id = &(data[0]);
    uint8_t *value_data = &(data[1]);
    switch ( *value_id )
    {
        case id_buttglow_brightness:
        {
            g_buttglow_config.brightness = *value_data;
            break;
        }
        ...
    }
}

void buttglow_config_get_value( uint8_t *data )
{
    uint8_t *value_id = &(data[0]);
    uint8_t *value_data = &(data[1]);
    switch ( *value_id )
    {
        case id_buttglow_brightness:
        {
            *value_data = g_buttglow_config.brightness;
            break;
        }
        ...
    }
}

void buttglow_config_save(void)
{
    eeprom_update_block( &g_buttglow_config,
        ((void*)BUTTGLOW_CONFIG_EEPROM_ADDR),
        sizeof(buttglow_config) );
}
```

### Saving Values

The `id_custom_save` command is sent after one or more `id_custom_set_value` commands have been sent, and after a small delay. It is used to allow the firmware to defer writing to EEPROM and respond to set value commands quickly. This also reduces the number of redundant writes to EEPROM, especially when users are changing values quickly in VIA, like when using a color picker. The `channel_id` of the `id_custom_save` command will be the same value as used in the `id_custom_set_value` commands which preceeded it, thus a handler to write all current values to EEPROM for a given feature can be called and bound per channel.

### Handling Array Values

The following is an example of a custom UI control using an array value, the array index is after the `value_id`, thus it is in `value_data[0]` and the actual value starts at `value_data[1]`, whereas for non-array values, the value starts at `value_data[0]`.

```c
void buttglow_config_set_value( uint8_t *data )
{
    uint8_t *value_id = &(data[0]);
    uint8_t *value_data = &(data[1]);
    switch ( *value_id )
    {
        case id_buttglow_color: // == 4
        {
            uint8_t index = value_data[0]; // == 0,1,2
            if ( index >= 0 && index < 3 )
            {
                g_buttglow_config.color[index].h = value_data[1];
                g_buttglow_config.color[index].s = value_data[2];
            }
        }
        ...
    }
}
```

See [Array Values](#array-values)