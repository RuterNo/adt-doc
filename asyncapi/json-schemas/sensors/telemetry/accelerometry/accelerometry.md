### Accelerometry Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000008                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes the vehicle's acceleration in three dimensions.

#### Data Specifications

- **Message frequency:** 6 times per minute (6/min)
- **Bandwidth:** ≥ 100 Hz
- **Unit:** g (gravity)
- **Resolution:** ≤ 0.01 g

#### Payload details

- **Name:** Accelerometry
- **ID:** 01000008

| Sub Id | Value Type | Description                 |
|:------:|:----------:|-----------------------------|
|  xmin  |   float    | Minimum X-axis acceleration |
|  xmax  |   float    | Maximum X-axis acceleration |
|  xavg  |   float    | Average X-axis acceleration |
|  ymin  |   float    | Minimum Y-axis acceleration |
|  ymax  |   float    | Maximum Y-axis acceleration |
|  yavg  |   float    | Average Y-axis acceleration |
|  zmin  |   float    | Minimum Z-axis acceleration |
|  zmax  |   float    | Maximum Z-axis acceleration |
|  zavg  |   float    | Average Z-axis acceleration |
