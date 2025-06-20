### DPI Display Status
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/display_status                                       |
| Schema        | [ dpi-display-status.json ](json-schemas/pe/dpi/display_status/dpi-display-status.json)                   |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Consumer      | PTO, [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

The DPI Display status topic is used to inform the Ruter BO about the current state (Tilstandsmelding) for DPI.

This messages is produced every fifth minute and every time a message is received on `pe/dpi/journey` and used in SLA measurement. 
