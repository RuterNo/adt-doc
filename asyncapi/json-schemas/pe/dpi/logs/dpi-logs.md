### Command Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/logs                                                         |
| Schema        | [ dpi-logs.json ](json-schemas/pe/dpi/logs/dpi-logs.json)                                                         |
| Producer      | [PTA DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                         |
| Consumer      | [PTA DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                         |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |

Logs from the DPI client are published to this topic. The payload includes the log level and message, and may include a stack trace when available.
