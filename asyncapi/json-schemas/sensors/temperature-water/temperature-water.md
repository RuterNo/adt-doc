### Temperature Water Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/temperature_water                                   |
| Schema        | [ temperature-water.json ](json-schemas/sensors/temperature-water/temperature-water.json)                 |
| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata)                                              |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Describes the water temperature in Celsius, measured 1 meter below the water surface. The value should be a float with a
resolution of 1°C or better.

#### Data specification

- Message frequency: 1 message per minute (1/min)
- Unit: Celsius
- Resolution: <= 1°C
- Measurement depth: 1 meter below the water surface
