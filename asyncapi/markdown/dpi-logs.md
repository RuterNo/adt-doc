### Command Message
| Field         | Value                                                                                   |
|---------------|-----------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/pe/dpi/logs                                              |
| Schema        | [ dpi-logs.json ](json-schemas/dpi-logs.json)                                           |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA |

Logs from the DPI client are published to this topic. The payload includes the log level and message, and may include a stack trace when available.