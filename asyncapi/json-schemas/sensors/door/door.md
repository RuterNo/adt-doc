### Door Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/door                                                |
| Schema        | [ door.json ](json-schemas/sensors/door/door.json)                                                        |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA Backoffice                                                                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Frequency: on change
