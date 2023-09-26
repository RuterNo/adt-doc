### Remote Stop Button Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/pe/input/stop_button                                                |
| Schema        | [ stop-button.json ](json-schemas/sensors/stop-button/stop-button.json)                                   |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

This message should be interpreted as if the stop button, accessibility button or the stop was served by the vehicle.

A corresponding message should be produced on `/sensors/stop_button` as normal with the same `traceId` as received in this message, confirming that the stop signal lights was 
lit and the vehicle actually served the stop. 

Frequency: on change