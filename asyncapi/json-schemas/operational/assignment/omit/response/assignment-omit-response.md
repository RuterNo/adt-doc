### AssignmentAttemptResponse Message
| Field         | Value                                                                                                                       |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/back_office/adt/v3/operational/assignment/omit/response                                                  |
| Schema        | [ assignment-omit-response.json ](json-schemas/operational/assignment/omit/response/assignment-omit-response.json)          |
| Producer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                        |
| Consumer      | PTO                                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                   |

### AssignmentAttemptResponse Usage
When an AssignmentAttemptRequest is made, and Ruter has finished processing, the results are presented as AssignmentAttemptResponse.
The response contains:
- `result` to indicate if processing by Ruter has been successfully processed, or not. See the schema for possible codes.
