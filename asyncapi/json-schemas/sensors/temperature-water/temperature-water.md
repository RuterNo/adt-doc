### Temperature Water Message

| Field         | Value                                                                                                    |
|---------------|----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/temperature/water                                          |
| Schema        | [ temperature-water.json ](json-schemas/sensors/temperature-water/temperature-water.json)                |
| Producer      | PTO                                                                                                      |
| Consumer      | Ruter BO                                                                                                 |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes the water temperature in Celsius, measured 1 meter below the water surface. The value should be a float with a
resolution of 1°C or better.

#### Data specification

- Message frequency: 1 message per minute (1/min)
- Unit: Celsius
- Resolution: <= 1°C
- Measurement depth: 1 meter below the water surface
