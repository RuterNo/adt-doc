### Command response message

Responses generated from requests sent on `/pe/dpi/command`

| Field         | Value                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/command_response                         |
| Schema        | [ dpi-command_response.json ](json-schemas/pe/dpi/command_response/dpi-command_response.json) |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA      |

This message is a response to another message sent on pe/dpi/command. It contains the result of the command.