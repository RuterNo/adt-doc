### State of Charge Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/state_of_charge                                     |
| Schema        | [ state-of-charge.json ](json-schemas/sensors/state-of-charge/state-of-charge.json)                       |
| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata))                                             |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Describes the current charge level of the vehicle's battery.

#### Message Specifications

- **Message frequency:** Once per minute (every 60 seconds)
- **Unit:** Percentage (%)
- **Resolution:** <= 1%
- **Range:** 0% - 100%
