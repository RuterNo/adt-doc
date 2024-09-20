### Temperature Indoor Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000002                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes the interior temperature of the vehicle.

#### Data specification

- **Frequency:** 6 times per minute (6/min)
- **Unit:** Degrees Celsius (°C)
- **Resolution:** <= 1°C

#### Payload details

- **Name:** Temperature indoor
- **ID:** 01000002

| Sub ID     | Value Type | Description                  |
|:-----------|:-----------|:-----------------------------|
| tempavg    | float      | Average interior temperature |
| tempfront  | float      | Front interior temperature   |
| tempmiddle | float      | Middle interior temperature  |
| temprear   | float      | Rear interior temperature    |