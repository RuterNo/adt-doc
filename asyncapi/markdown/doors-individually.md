### Door Lock message:
| Field         | Value                                                             |
|---------------|-------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/pe/doors_individually              |
| Schema        | [ doors-individually.json ](json-schemas/doors-individually.json) |

This topic is used to track the individual status of doors. One use case is to improve the data quality of APC counts. See also topic sensors/door for status of anyDoorOpen/allDoorsClosed.
