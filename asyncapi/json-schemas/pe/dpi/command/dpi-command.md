### Command Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/command                                                      |
| Schema        | [ dpi-command.json ](json-schemas/pe/dpi/command/dpi-command.json)                                                |
| Producer      | [PTA DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                         |
| Consumer      | [PTA DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                         |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |

This channels is reserved for command and control messages originated by the PTA. Typical use cases include:

- Diagnostics / debugging
  - Trigger transfer of debug information
  - Trigger screenshot of DPI screen
  - Trigger clearing of cache and refresh of webpage
- Content
  - Trigger display of campaign

The payload is defined as an object with no structure to provide flexibility.
