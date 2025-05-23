### Command response message

Responses generated from requests sent on `/pe/dpi/command`

| Field         | Value                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v4/pe/dpi/command_response                                                      |
| Schema        | [ dpi-command_response.json ](json-schemas/pe/dpi/command/dpi-command_response.json)                               |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                        |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                        |
| Service Level | ⛔ Ruter internal API. No restrictions apply. API may be removed or modified freely by Ruter within major version. |

This API is reserved for command and control messages for debugging purposes of DPI client.
