### DoorsIndividually Message
| Field         | Value                                                                                                       |
|---------------|-------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/doors_individually                                         |
| Schema        | [ doors-individually.json ](json-schemas/pe/doors-individually/doors-individually.json)                     |
| Maintainer    | [Passasjertelling](https://github.com/orgs/RuterNo/teams/passasjertelling)                                  |
| Producer      | PTO                                                                                                         |
| Consumer      | PTA                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.   |

This topic is used to track the individual status of doors. One use case is to improve the data quality of APC counts. See also topic sensors/door for status of anyDoorOpen/allDoorsClosed.
