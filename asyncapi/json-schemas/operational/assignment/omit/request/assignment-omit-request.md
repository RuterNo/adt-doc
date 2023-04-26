### AssignmentOmitRequest Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/back_office/adt/v3/operational/assignment/omit/request                                                |
| Schema        | [ assignment-omit-request.json ](json-schemas/operational/assignment/omit/request/assignment-omit-request.json)          |
| Producer      | PTO                                                                                                                      |
| Consumer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                |

### AssignmentOmitRequest Usage
`operational/assignment/omit` follows the request/response/state pattern. When a `request` is made to the request topic, a `response` will be available at the response topic once Ruter has finished processing.

- All omits are effective immediately.
- All omit request will get an omit response under the topic [assignment/omit/response](../response/assignment-omit-response.md)
- Please provide all fields marked as `reqired` in the schema specifications.

#### Omit - NO_INTENTION
