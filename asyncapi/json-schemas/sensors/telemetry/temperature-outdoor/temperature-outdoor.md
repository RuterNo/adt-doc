### Temperature Outdoor Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000009                                       |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Measures the external temperature around the vehicle.

#### Data specification

- **Frequency:** Once per minute (1/min)
- **Unit:** Degrees Celsius (°C)
- **Resolution:** <= 1°C

#### Payload details

- **Name:** Temperature outdoor
- **ID:** 01000009

| Sub ID | Name                | Value Type | Description                      |
|:-------|:--------------------|:-----------|:---------------------------------|
| N/A    | Temperature outdoor | float      | External temperature measurement |
