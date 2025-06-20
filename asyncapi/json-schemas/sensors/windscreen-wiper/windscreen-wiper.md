### Windscreen Wiper Active Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/windscreen_wiper                                    |
| Schema        | [ windscreen-wiper.json ](json-schemas/sensors/windscreen-wiper/windscreen-wiper.json)                    |
| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata))                                             |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Describes the activity of the windscreen wipers.

#### Message Specifications

- **Message frequency:** On change
