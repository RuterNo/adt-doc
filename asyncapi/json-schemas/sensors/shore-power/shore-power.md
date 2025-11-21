### Shore Power Message

| Field         | Value                                                                                                     |
|:--------------|:----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/shore_power                                                 |
| Schema        | [ shore-power.json ](json-schemas/sensors/shore-power/shore-power.json)                                   |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes the total accumulated energy consumed from shore power in kilowatt-hours (kWh).

#### Data specification

- Message frequency: 1 message per minute (1/min)
- Unit: Kilowatt-hours (kWh)
- Resolution: <= 0.1 kWh
