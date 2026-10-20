### CBTC Distance To Next Quay (Target) Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/target_distance                                     |
| Schema        | [ target-distance.json ](json-schemas/pe/cbtc/target_distance/target-distance.json)                      |
| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Producer      | Sporveien / CBTC                                                                                           |
| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

When the vehicle has a known destination, CBTC publishes information about the remaining distance to the target every second.
