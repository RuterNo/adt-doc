### Windscreen Wiper Active Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000007                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes the activity of the windscreen wipers.

#### Data specification

- **Message frequency:** On change

#### Payload details

- **Name:** Windscreen wiper active
- **Id:** 01000007

| Sub ID | Name                    | Value Type | Description |
|--------|-------------------------|------------|-------------|
| N/A    | Windscreen wiper active | boolean    |             |