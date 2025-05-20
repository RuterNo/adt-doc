### DPI Journey Status
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v4/pe/dpi/journey_status                                               |
| Schema        | [ dpi-journey-status.json ](json-schemas/pe/dpi/journey_status/dpi-journey-status.json)                   |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO, [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                          |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

The DPI Journey status topic is used to inform the Ruter BO about the correct state (Tilstandsmelding) for DPI.

This messages is produced every time a message is received in `pe/dpi/journey` and used in SLA measurement. 
