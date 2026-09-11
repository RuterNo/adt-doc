### Denied Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/denied                                                   |
| Schema        | [ pe-denied.json ](json-schemas/pe/denied/pe-denied.json)                                                 |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Producer      | PTO                                                                                                        |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

The `pe/denied` topic is used by the external client to inform the DPI backoffice when an incoming message fails validation on the client side.

A denied message must reference the original rejected message via `rejectedMessage` and include a machine-readable `reasonCode`. The optional `reasonDetails` field may contain a human-readable explanation.

| `reasonCode`              | Description                                                     |
|---------------------------|-----------------------------------------------------------------|
| `SCHEMA_VALIDATION_FAILED` | The message did not conform to the expected JSON Schema         |
| `CONTENT_POLICY_VIOLATION` | The message was rejected due to prohibited content (e.g. words) |
