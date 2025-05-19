### AssignmentStatus Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/operational/assignment/status                                       |
| Schema        | [ assignment-status.json ](json-schemas/operational/assignment/status/assignment-status.json)             |
| Producer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                      |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

### AssignmentStatus Usage
Current Assignment State for a vehicle as seen by Ruter. The topic is `retained` so the current status is persisted on the mqtt-broker.
The topic is updated when an AssignmentAttemptRequest is made, processing is complete and/or the state has changed. 

_Note that Ruter could, in case of operational deviations, or missing sign offs, update the assignment. This update will be reflected here._
