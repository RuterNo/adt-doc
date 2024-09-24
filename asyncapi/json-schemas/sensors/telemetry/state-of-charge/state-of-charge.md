### State of Charge Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000005                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes the current charge level of the vehicle's battery.

#### Data specification

- **Message frequency:** Once per minute (1/min)
- **Unit:** Percentage (%)
- **Resolution:** <= 1%
- **Range:** 0% - 100%

#### Payload details

- **Name:** State of charge
- **ID:** 01000005

If vehicle has more than one battery use the sub id to identify them:

| Sub ID | Name            | Value Type | Description                           |
|--------|-----------------|------------|---------------------------------------|
| N/A    | State of charge | float      | Only one battery in the given vehicle |
| 1      | State of charge | float      | Battery 1                             |
| 2      | State of charge | float      | Battery 2                             |
| (n)    | State of charge | float      | Battery (n)                           |