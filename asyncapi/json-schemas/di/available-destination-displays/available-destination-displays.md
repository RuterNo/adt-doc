### Available Destination Displays Message
| Field         | Value                                                                                                                       |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v4/di/available_destination_displays                                                     |
| Schema        | [ available-destination-displays.json ](json-schemas/di/available-destination-displays/available-destination-displays.json) |
| Producer      | [Ruter Transportoppdrag](https://github.com/orgs/RuterNo/teams/transportoppdrag)                                            |
| Consumer      | PTO                                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                   | 

Provides a list of available destination displays for a vehicle. The list should be used for external displays, in case
the vehicle has lost connection to the backoffice.
