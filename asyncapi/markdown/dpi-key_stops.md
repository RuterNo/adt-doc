### Key Stops message:
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/pe/dpi/key_stops                                                                   |
| Schema        | [ dpi-key_stops.json ](json-schemas/dpi-key_stops.json)                                                           |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Consumer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                       |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. | 

List of X number of most trafficked stops in the rest of the journey. Based on predicted number of passengers leaving
on each stop