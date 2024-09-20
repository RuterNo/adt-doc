### Wind Message

| Field         | Value                                                                                                     |
|:--------------|:----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/wind                                                        |
| Schema        | [ wind.json ](json-schemas/sensors/wind/wind.json)                                                        |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes the wind speed and direction measured on the vehicle. The wind speed should be reported in meters per second (
m/s) as a float with a resolution of 0.1 m/s or better. The wind direction should be reported in degrees from true
north (0-359°) as an integer.

#### Data specification

Frequency:
- 1 message per minute (1/min)

Properties:
- speed
  - Unit: meters per second (m/s)
  - Resolution: <= 0.1 m/s

- direction:
  - Unit: degrees from true north
  - Range: 0-359°
  - Resolution: 1°