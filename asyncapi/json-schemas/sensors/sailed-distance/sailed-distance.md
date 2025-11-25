### Sailed Distance Message

| Field         | Value                                                                                                     |
|:--------------|:----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/sailed_distance                                             |
| Schema        | [ sailed-distance.json ](json-schemas/sensors/sailed-distance/sailed-distance.json)                       |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes the accumulated distance sailed by the vessel.


#### Data specification

- Message frequency: 1 message per minute (1/min)
- Unit: Nautical Miles (NM)
- Resolution: <= 0.1 NM
