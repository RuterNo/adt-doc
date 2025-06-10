### Command Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/logs                                                         |
| Schema        | [ dpi-logs.json ](json-schemas/pe/dpi/logs/dpi-logs.json)                                                         |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. |

Logs from the DPI client are published to this topic. The payload includes the log level and message, and may include a stack trace when available.
