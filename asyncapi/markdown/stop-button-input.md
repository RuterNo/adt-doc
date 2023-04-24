### Remote Stop Button Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/pe/input/stop_button                                                       |
| Schema        | [ stop-button.json ](json-schemas/stop-button.json)                                                       |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

This message indicates that the bus should stop on the next stop. On receiving this message, the operator should interpret 
it as if it was a regular press of a button on board the vehicle.

The stop-signalled light inside the vehicle should light up and a message should be produced on 
`ruter/{operatorId}/{vehicleId}/sensors/stop_button` as normal.

Frequency: on change