### Command response message

Responses generated from requests sent on `/pe/dpi/command`

| Field         | Value                                                                                   |
|---------------|-----------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/pe/dpi/command_response                                  |
| Schema        | [ dpi-command_response.json ](json-schemas/dpi-command_response.json)                   |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                   |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA |

This message is a response to another message sent on pe/dpi/command. It contains the result of the command.