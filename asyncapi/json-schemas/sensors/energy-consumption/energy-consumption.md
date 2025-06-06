### Accumulated Energy Consumption Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/energy_consumption                                          |
| Schema        | [ energy-consumption.json ](json-schemas/sensors/energy-consumption/energy-consumption.json)              |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Energy consumption in kilowatt-hours (kWh), including all onboard systems such as HVAC. The value should always accumulate over time.

#### Message specifications

- **Message frequency:** Once per minute (once every 60 seconds)
- **Unit:** kWh
