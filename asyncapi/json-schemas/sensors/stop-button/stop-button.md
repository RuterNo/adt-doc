### StopButton Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/stop_button                                                 |
| Schema        | [ stop-button.json ](json-schemas/sensors/stop-button/stop-button.json)                                   |
| Producer      | PTO                                                                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

This message should be produced whenever the stop signal is turned on or off. Depending on whether the regular stop button
is pressed or the blue accessebility button is pressed, a different signal should be produced. 

Whenever the vehicle has serviced a stop, the signal is to be reset. 

Frequency: on change
