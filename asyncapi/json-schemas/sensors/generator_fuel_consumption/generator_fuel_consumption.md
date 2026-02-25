### Generator Fuel Consumption Message

| Field         | Value                                                                                                                |
|:--------------|:---------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/generator_fuel_consumption                                             |
| Schema        | [ generator_fuel_consumption.json ](json-schemas/sensors/generator_fuel_consumption/generator_fuel_consumption.json) |
| Producer      | PTO                                                                                                                  |
| Consumer      | Ruter BO                                                                                                             |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.            |

Describes the total cumulative fuel consumed by the generator in litres (L).

#### Data specification

- Message frequency: 1 message per minute (1/min)
- Unit: Litres (L)
- Resolution: <= 0.1 L


