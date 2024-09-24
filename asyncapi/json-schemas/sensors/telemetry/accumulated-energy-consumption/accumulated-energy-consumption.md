### Accumulated Energy Consumption Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/0100000A                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes total energy consumption by the vehicle.

#### Data specification

Energy consumed including HVAC

- **Message frequency:** Once per minute (1/min)
- **Unit:** kWh

#### Payload details

- **Name:** Accumulated energy consumption
- **ID:** 0100000A

| Value Type | Description                    |
|------------|--------------------------------|
| float      | Accumulated energy consumption |
