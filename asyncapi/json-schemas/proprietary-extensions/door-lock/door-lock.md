### DoorLock Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/proprietary_extensions/door_lock                                    |
| Schema        | [ door-lock.json ](json-schemas/proprietary-extensions/door-lock/door-lock.json)                          |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

This message is used to track if the vehicle doors are locked or unlocked.

Frequency: on change
