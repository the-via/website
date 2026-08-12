---
id: post_v3_examples
title: Post-V3 Practical Examples
sidebar_label: Post-V3 Practical Examples
---

## Introduction

This page pairs the newer V3 definition features with minimal QMK implementations. The examples use custom channel `0` and these illustrative value IDs:

| Value | ID | Purpose |
| --- | --- | --- |
| `id_layer_threshold` | `1` | A range addressed by an extra layer argument |
| `id_status_text` | `2` | A firmware-backed display label |
| `id_board_variant` | `3` | A dynamic keyboard-name option index |

> **The numeric IDs are examples, not VIA-assigned values.** On custom channel `0`, the firmware author defines the value-ID enum and uses the same numbers in the JSON `content` tuples. The dynamic-name ID is an ordinary custom value ID, just like one used by a custom menu. It does not have to be `3`, `200`, or any other particular number. Built-in QMK menus are different: their channels and value IDs are fixed by the corresponding QMK/VIA implementation.

Adapt the IDs, storage, and feature logic to the keyboard. Keep each value ID's meaning consistent within its channel; one value ID can intentionally serve several controls when extra arguments distinguish them. The [Custom UI](custom_ui) page remains the full command and control reference.

## Firmware-version conditions

Set a monotonically increasing firmware version in the VIA keymap's `config.h`:

```c
#define VIA_FIRMWARE_VERSION 5
```

The reported 32-bit value is available as `id_firmware_version`. A definition can retain both implementations while avoiding reads from the inactive firmware-only branch:

```json
{
  "label": "Advanced",
  "content": [
    {
      "showIf": "{id_firmware_version} < 5",
      "label": "Legacy mode",
      "type": "toggle",
      "content": ["id_legacy_mode", 0, 10]
    },
    {
      "showIf": "{id_firmware_version} >= 5",
      "label": "New mode",
      "type": "toggle",
      "content": ["id_new_mode", 0, 24]
    }
  ]
}
```

Place the condition high enough to cover every command whose numeric ID or meaning changed. The top-level definition property `firmwareVersion` does not replace this runtime value.

## Static and keyboard-provided display labels

For text that never changes, put the text directly in a one-element `content` array. This static form requires no firmware handler:

```json
{
  "label": "Information",
  "type": "label",
  "content": ["Hold the top-left key while connecting to reset EEPROM."]
}
```

For text that can change at runtime, use a custom-value command tuple. This keyboard-provided form requests null-terminated UTF-8 text through the normal custom-value get command:

```json
{
  "label": "Board status",
  "type": "label",
  "content": ["id_status_text", 0, 2]
}
```

The first string, `id_status_text`, is the definition's unique key. Channel `0` and value ID `2` are author-defined example values that must match the firmware handler.

## Dynamic keyboard name

The definition supplies the possible names and a command that returns their zero-based index:

```json
"name": {
  "options": ["Example Board", "Example Board Pro", "Example Board SE"],
  "content": ["id_board_variant", 0, 3]
}
```

Put the safe default name first. VIA uses it if the command is unsupported, fails, or returns an index outside `options`.

## Extended command arguments

Arguments follow `value_id`. Here, eight controls can share the example value ID `1`, while the final tuple element selects a layer:

```json
{
  "label": "Layer 4 threshold",
  "type": "range",
  "options": [0, 255],
  "content": ["id_layer_threshold_4", 0, 1, 4]
}
```

For this tuple, the Raw HID custom-value body is arranged as follows:

```text
[channel_id, value_id, layer_argument, value_payload...]
```

The argument remains present in both get and set requests. The get response must place the returned value after that argument.

## Range-constraint pairing

Constraints are enforced by VIA, but firmware should still validate the received values. This definition keeps the press threshold at least five units above the release threshold and pushes the release value when necessary:

```json
{
  "label": "Release threshold",
  "type": "range",
  "options": [0, 250],
  "content": ["id_release", 0, 30]
},
{
  "label": "Press threshold",
  "type": "range",
  "options": [5, 255],
  "content": ["id_press", 0, 31],
  "constraints": [
    {
      "operator": ">=",
      "reference": "id_release",
      "offset": 5,
      "onViolation": "push"
    }
  ]
}
```

Use a complete command tuple as `reference` instead of the string key when the same numeric command is addressed by extra arguments. See [Relational constraints](custom_ui#relational-constraints).

## Combined QMK custom-value handler

The following minimal handler implements the dynamic label, dynamic name, and layer-addressed range shown above:

```c
#include "quantum.h"
#include <string.h>

enum custom_value_id {
    id_layer_threshold = 1,
    id_status_text     = 2,
    id_board_variant   = 3,
};

enum custom_channel_id {
    id_custom_channel = 0,
};

static uint8_t layer_thresholds[8] = {0};
static uint8_t board_variant       = 1; // "Example Board Pro"
static bool    board_ready         = true;

static void write_text_response(uint8_t *data, uint8_t length, const char *text) {
    if (length <= 3) {
        return;
    }

    uint8_t available = length - 3;
    uint8_t text_size = strlen(text) + 1; // Include the null terminator.
    uint8_t copy_size = text_size < available ? text_size : available;

    memset(&data[3], 0, available);
    memcpy(&data[3], text, copy_size);
    data[length - 1] = 0; // Keep the response terminated if it was truncated.
}

void via_custom_value_command_kb(uint8_t *data, uint8_t length) {
    // data = [command_id, channel_id, value_id, arguments..., value...]
    uint8_t command_id = data[0];
    uint8_t channel_id = data[1];
    uint8_t value_id   = data[2];

    if (channel_id != id_custom_channel) {
        data[0] = id_unhandled;
        return;
    }

    switch (command_id) {
        case id_custom_get_value:
            switch (value_id) {
                case id_status_text:
                    write_text_response(
                        data,
                        length,
                        board_ready ? "Ready" : "Busy"
                    );
                    return;

                case id_board_variant:
                    data[3] = board_variant;
                    return;

                case id_layer_threshold: {
                    uint8_t layer = data[3]; // The definition's extra argument.
                    if (layer < ARRAY_SIZE(layer_thresholds)) {
                        data[4] = layer_thresholds[layer];
                        return;
                    }
                    break;
                }
            }
            break;

        case id_custom_set_value:
            if (value_id == id_layer_threshold) {
                uint8_t layer = data[3]; // Preserve the argument position.
                uint8_t value = data[4]; // The value follows all arguments.
                if (layer < ARRAY_SIZE(layer_thresholds)) {
                    layer_thresholds[layer] = value;
                    return;
                }
            }
            break;

        case id_custom_save:
            // Persist writable custom values here when required.
            return;
    }

    data[0] = id_unhandled;
}
```

The range remains 8-bit because its maximum is `255`. For a maximum above `255`, the value payload uses high-byte, low-byte order. Production firmware should also validate bounds and persist writable values when handling `id_custom_save`.

## Board-initiated UI synchronization

Call a helper when the board changes a displayed value independently—for example, when a task completes or a physical mode switch changes state. Do not send the report from inside the VIA receive handler.

This helper queues a refresh for the example's value ID `2`, used by the dynamic status label:

```c
#include "quantum.h"

#define UI_SYNC_REQUEST         0x16
#define UI_SYNC_VERSION         0x01
#define UI_SYNC_BY_COMMAND_ID   0x02
#define ID_STATUS_TEXT          2 // Author-defined ID from the example enum.

static bool status_sync_pending = false;

void request_status_sync(void) {
    // Multiple changes before housekeeping runs are coalesced into one request.
    status_sync_pending = true;
}

void housekeeping_task_user(void) {
    if (!status_sync_pending) {
        return;
    }

#ifdef SPLIT_KEYBOARD
    if (!is_keyboard_master()) {
        status_sync_pending = false;
        return;
    }
#endif

    uint8_t report[RAW_EPSIZE] = {0};
    report[0] = UI_SYNC_REQUEST;
    report[1] = UI_SYNC_VERSION;
    report[2] = UI_SYNC_BY_COMMAND_ID;
    report[3] = 1;              // One target.
    report[4] = ID_STATUS_TEXT;

    raw_hid_send(report, sizeof(report));
    status_sync_pending = false;
}
```

For example, board code can update its state and schedule the refresh:

```c
board_ready = true;
request_status_sync();
```

The app waits for active VIA commands to finish and then rereads the matching active controls. For several values, either append more command IDs and increase `count`, target exact channel/command pairs, or request all custom values. See [Board-Initiated Custom UI Synchronization](custom_ui#board-initiated-custom-ui-synchronization) for the complete versioned report format and precedence rules.
