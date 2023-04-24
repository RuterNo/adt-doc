### AvailableDestinationDisplays Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/di/available_destination_displays                                          |
| Schema        | [ available-destination-displays.json ](json-schemas/available-destination-displays.json)                 |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Provides a list of available destination displays for a vehicle. The list should be used for external displays, in case
the vehicle has lost connection to the backoffice.