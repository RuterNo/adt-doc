### CBTC Trip Activated Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/trip_activated                                      |
| Schema        | [ trip-activated.json ](json-schemas/pe/cbtc/trip_activated/trip-activated.json)                          |
| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Producer      | Sporveien / CBTC                                                                                           |
| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Published when the CBTC system activates a new trip. Contains enough information to uniquely identify the trip, used by Ruter's offline solution and matched with data stored onboard about the route plan.

When vehicles have been coupled, each vehicle must send this information.
