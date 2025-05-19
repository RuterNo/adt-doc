### AssignmentAttemptResponse Message
| Field         | Value                                                                                                                       |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/operational/assignment/attempt/response                                               |
| Schema        | [ assignment-attempt-response.json ](json-schemas/operational/assignment/attempt/response/assignment-attempt-response.json) |
| Producer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                        |
| Consumer      | PTO                                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                   |

### AssignmentAttemptResponse Usage
When an AssignmentAttemptRequest is made, and Ruter has finished processing, the results are presented as AssignmentAttemptResponse.
The response contains:
- `result` to indicate if processing by Ruter has been successfully processed, or not. See the schema for possible codes.
- `state` as a representation of the Assignment state as seen by Ruter after processing is completed.

### State 
Indicates what state the vehicle has in the RUTER systems.
A vehicle can be either assigned or unassigned. In addition the state shows what code is applied
#### Additional codes used by RUTER
In addition to the codes supplied in the assignment attempts for signOn, signOff and update, RUTER can apply some codes.
- `REPLACED`
  When a vehicle attempts a SignOn with the code `REPLACED`. Any other vehicle signed on to the same vehicle task and not marked as `EXTRA` will be automatically signed off with the code `REPLACED`.
- `EXPIRED`
  Given a successfull signOn, if the vehicle is not signed off before two hours after the last planned arrival. The veicle will be automatically signed off with the code `EXPIRED`.