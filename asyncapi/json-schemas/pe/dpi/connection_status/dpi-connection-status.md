### Connection Status Message
| Field         | Value                                                                                            |
|---------------|--------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v3/pe/dpi/connection_status                           |
| Schema        | [ dpi-connection-status.json ](json-schemas/pe/dpi/connection_status/dpi-connection-status.json) |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                            |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                            |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                            |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA          |

Connection messages sent when the DPI client connects and disconnects from the MQTT broker. It is used to monitor the connection status of the DPI client and detect screens where the browser may be in restart loop.