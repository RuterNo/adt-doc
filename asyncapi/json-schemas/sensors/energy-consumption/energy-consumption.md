### Accumulated Energy Consumption Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/energy_consumption                                  |
| Schema        | [ energy-consumption.json ](json-schemas/sensors/energy-consumption/energy-consumption.json)              |
| Maintainer    | PTA Backoffice                                                                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA Backoffice                                                                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Energy consumption in kilowatt-hours (kWh), including all onboard systems such as HVAC. The value should always
accumulate over time.

#### Message Specifications

- **Message frequency:** Once per minute (every 60 seconds)
- **Unit:** kWh
