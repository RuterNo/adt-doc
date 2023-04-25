### Diagnostics Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/pe/dpi/diagnostics                                                          |
| Schema        | [ dpi-diagnostics.json ](json-schemas/pe/dpi/diagnostics/dpi-diagnostics.json)                                    |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. |

Report to PTA BO about a screen.

The DPI application itself produces diagnostic messages.
The payload is defined as an object with no pre-defined structure to provide flexibility.
