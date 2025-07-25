### Command Message

| Field         | Value                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------- |
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/command                             |
| Schema        | [ dpi-command.json ](json-schemas/pe/dpi/command/dpi-command.json)                       |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA |

This channel is highly unstable and should only be used by developers in TET.

This channel makes it possible for developers to debug the running application by providing real-time commands to it.

The results from each requested command is sent to pe/dpi/command_response.
