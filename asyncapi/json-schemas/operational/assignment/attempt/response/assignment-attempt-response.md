### AssignmentAttemptResponse Message
| Field         | Value                                                                                                                       |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/operational/assignment/attempt/response                                               |
| Schema        | [ assignment-attempt-response.json ](json-schemas/operational/assignment/attempt/response/assignment-attempt-response.json) |

### AssignmentAttemptResponse Usage
When an AssignmentAttemptRequest is made, and Ruter has finished processing, the results are presented as AssignmentAttemptResponse.
The response contains:
- `result` to indicate if processing by Ruter has been successfully processed, or not. See the schema for possible codes.
- `state` as a representation of the Assignment state as seen by Ruter after processing is completed.
