### Destination Display Override Message
| Field         | Value                                                                                                                         |
|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/di/override_attempt/destination_display                                         |
| Schema        | [ destination-display-override.json ](json-schemas/di/override_attempt/destination_display/destination-display-override.json) |
| Producer      | PTO                                                                                                                           |
| Consumer      | [PTA Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                     |

To construct a message, refer to the Available Destination Displays Message list and ensure that all fields provided in 
the list are included in the message.

If an entry contains publicCode, destination, and alternativeMessage, all three fields must be included exactly as specified 
in the list. The only additional fields you need to provide are a current eventTimestamp and a unique traceId.
