### AssignmentStatus Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/operational/assignment/status                                       |
| Schema        | [ assignment-status.json ](json-schemas/operational/assignment/status/assignment-status.json)             |
| Producer      | Ruter BO                                                                                                  |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

### AssignmentStatus Usage
Current Assignment State for a vehicle as seen by Ruter. The topic is `retained` so the current state is persisted on the mqtt-broker.
The topic is updated when an AssignmentAttemptRequest i made, processing is complete and the state has changed.