### Vehicle API
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/vehicle/api                                                      |
| Schema        | [ api.json ](json-schemas/pe/vehicle/api/api.json)                                                                |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [RuterSalg](https://github.com/orgs/RuterNo/teams/rutersalg)                                                      |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.         |

Message used by Ruter to distribute information about the vehicle and it's supported APIs as provided by the PTO.
