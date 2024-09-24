### Charging Message

| Field         | Value                                                                                                     |
|:--------------|:----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/charging                                                    |
| Schema        | [ charging.json ](json-schemas/sensors/charging/charging.json)                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes the charging status and details of an electric vehicle. The message includes information about whether the
vehicle is connected to a charging point, if it's actively charging, and the current charging effect in kilowatts (kW).

#### Data specification

Frequency:
- Messages should be sent on change, i.e., when there's a change in connection status, charging status, or a change in
charging effect more or equal to 10kW.

Properties:
- isConnected:
  - Boolean value indicating if the vehicle is connected to a charging point

- isCharging:
  - Boolean value indicating if the vehicle is actively charging

- chargingEffect:
  - Unit: Kilowatts (kW)
  - Resolution: Minimum one decimal (<=0.1kW)
  - Range: >=0.0kW
