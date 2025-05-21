### DPI Heartbeat
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v4/pe/dpi/heartbeat                                                    |
| Schema        | [ dpi-heartbeat.json ](json-schemas/pe/dpi/heartbeat/dpi-heartbeat.json)                                  |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Heartbeat message produced from the screens on board the transport vehicle. Containing meta information about the screen and it's configuration. 
This message is sent every 5th minute. 
