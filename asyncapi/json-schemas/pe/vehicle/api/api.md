### Vehicle API
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/pe/vehicle/api                                                              |
| Schema        | [ api.json ](json-schemas/pe/vehicle/api/api.json)                                                                |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. |

Message used by Ruter to distribute information about the vehicle and it's supported APIs as provided by the PTO.
