### DoorLock Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/door_lock                                                |
| Schema        | [ door-lock.json ](json-schemas/pe/door-lock/door-lock.json)                                              |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

This message is used to track if the vehicle doors are locked or unlocked.

Frequency: on change
