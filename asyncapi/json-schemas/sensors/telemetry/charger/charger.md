### Charger Message (deprecated)

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/0001FF25                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

> This has been deprecated and will be removed in the next major version. See´sensors/charging´ for information about new topic.

Describes the charging status and details of an electric vehicle.

#### Data specification

- **Frequency:** On change

#### Payload details

- **Name:** Charger
- **ID:** 0001FF25

| Sub ID | Name                   | Value Type | Description                                   |
|--------|------------------------|------------|-----------------------------------------------|
| 10003  | Wall charger connected | boolean    | Indicates if connected to a wall charger      |
| 10004  | Fast charger connected | boolean    | Indicates if connected to a fast charger      |
| 10005  | Charging active        | boolean    | Indicates if the vehicle is actively charging |