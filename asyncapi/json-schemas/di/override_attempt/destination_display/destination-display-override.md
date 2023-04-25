### Destination Display Override Message
| Field         | Value                                                                                                                         |
|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/di/override_attempt/destination_display                                                 |
| Schema        | [ destination-display-override.json ](json-schemas/di/override_attempt/destination_display/destination-display-override.json) |
| Producer      | PTO                                                                                                                           |
| Consumer      | Ruter BO                                                                                                                      |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                     |