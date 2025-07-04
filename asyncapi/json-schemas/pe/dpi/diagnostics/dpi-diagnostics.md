### Diagnostics Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/diagnostics                                                  |
| Schema        | [ dpi-diagnostics.json ](json-schemas/pe/dpi/diagnostics/dpi-diagnostics.json)                                    |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |
| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |

Report to PTA BO about a screen.

The DPI application itself produces diagnostic messages.
The payload is defined as an object with no pre-defined structure to provide flexibility.
