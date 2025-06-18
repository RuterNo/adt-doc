### Temperature Outdoor Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/temperature_outdoor                                 |
| Schema        | [ temperature-outdoor.json ](json-schemas/sensors/temperature-outdoor/temperature-outdoor.json)           |
| Maintainer    | PTA Backoffice                                                                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA Backoffice                                                                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Measurement of the external temperature around the vehicle.

#### Message Specifications

- **Message frequency:** Once per minute (every 60 seconds)
- **Unit:** Degrees Celsius (°C)
- **Resolution:** <= 1°C
