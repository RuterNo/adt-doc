### Odometer Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/odometer                                                    |
| Schema        | [ odometer.json ](json-schemas/sensors/odometer/odometer.json)                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Describes an odometer value in meters based on total vehicle distance or similar. Absolute value of less importance but
should be strictly increasing within the scope of a journey.

Frequency is expected at 1 message per second.
