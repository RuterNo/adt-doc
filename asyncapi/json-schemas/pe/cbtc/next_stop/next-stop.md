### CBTC Next Stop Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/next_stop                                           |
| Schema        | [ next-stop.json ](json-schemas/pe/cbtc/next_stop/next-stop.json)                                         |
| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Producer      | Sporveien / CBTC                                                                                           |
| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

When the vehicle starts to move with a defined destination, CBTC makes information available about the next stop of the vehicle. This information is published onboard so that the Ruter offline solution can access it.

When vehicles have been coupled, each vehicle must send this information.
