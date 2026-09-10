### Coupling Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/coupling                                             |
| Schema        | [ coupling.json ](json-schemas/status/coupling/coupling.json)                                             |
| Maintainer    | Sporveien / DRIV                                                                                           |
| Producer      | Sporveien / DRIV                                                                                           |
| Consumer      | Sporveien / DRIV                                                                                           |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                  |

M4 cars can be coupled ("connected") with each other, and they can be decoupled ("disconnected"). Both vehicles being connected or disconnected must send information. Hence, each coupling/decoupling action will result in two such messages - one from each vehicle.

The message topic from each vehicle contains the vehicle number of that vehicle. The `carId` and `withCarId` fields refer to the individual cars (parts) of the vehicle (MC1, M, or MC2).

Motivation: Connecting and disconnecting carriages is key information required in backend systems, for example for DRIV.
