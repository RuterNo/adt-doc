### Odometer Message
| Field         | Value                                           |
|---------------|-------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/sensors/odometer |
| Schema        | [ odometer.json ](json-schemas/odometer.json)   |

Describes an odometer value in meters based on total vehicle distance or similar. Absolute value of less importance but 
should be increasing at least within the scope of a journey. Optionally the current speed according to the odometer could be included.

Frequency is recommended at 1 message per second. 