### Connection Status Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v4/pe/dpi/connection_status                                                    |
| Schema        | [ dpi-connection-status.json ](json-schemas/pe/dpi/connection_status/dpi-connection-status.json)                  |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. |

Connection messages sent when the DPI client connects and disconnects from the MQTT broker. It is used to monitor the connection status of the DPI client and detect screens where the browser may be in restart loop.