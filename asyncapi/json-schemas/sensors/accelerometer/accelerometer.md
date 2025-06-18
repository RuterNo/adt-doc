### Accelerometer Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/accelerometer                                       |
| Schema        | [ accelerometer.json ](json-schemas/sensors/accelerometer/accelerometer.json)                             |
| Maintainer    | PTA Backoffice                                                                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA Backoffice                                                                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Expects a message that provides aggregated acceleration measurements over a 10-second interval. Each payload must
include the **minimum**, **maximum**, and **average** acceleration values along the X, Y, and Z axes.

#### Message Specifications

- **Message Frequency:** 6 messages per minute (every 10 seconds)
- **Unit:** All acceleration values are reported in **g** (1 g ≈ 9.81 m/s²)
- **Sampling Bandwidth:** ≥ 100 Hz
- **Resolution:** ≤ 0.01 g

#### Expected Orientation

By default, the schema assumes the accelerometer is mounted so that:

- **X-axis** points **forward** (toward the vehicle’s front)
- **Y-axis** points **left** (toward the vehicle’s left side)
- **Z-axis** points **up** (toward the vehicle’s roof)

If no orientation override fields are present, consumers should interpret the numerical values according to these
defaults.

#### Orientation Overrides

Producers may optionally set `xOrientation`, `yOrientation` or `zOrientation`, each of which must be one of the six
values: **F** (forward), **B** (backward), **L** (left), **R** (right), **U** (up) or **D** (down). If none are
provided, the system assumes `xOrientation = "F"`, `yOrientation = "L"`, and `zOrientation = "U"`.

For a valid override, exactly one axis must be aligned along the forward/backward direction (F or B), exactly one along
the up/down direction (U or D), and exactly one along the left/right direction (L or R). In other words, among the three
fields there must be one value from { F, B }, one from { U, D }, and one from { L, R }. Any other combination is
considered invalid and must be corrected before publishing.
