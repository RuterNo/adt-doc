### Available Destination Displays Message

| Field         | Value                                                                                                                       |
|---------------|-----------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/backoffice/adt/v4/di/available_destination_displays                                                      |
| Schema        | [ available-destination-displays.json ](json-schemas/di/available-destination-displays/available-destination-displays.json) |
| Producer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                        |
| Consumer      | PTO                                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                   | 

Provides a list of available destination displays. The list should be used for external displays, in case
the vehicle has lost connection to the backoffice.

> Note that the list of available destination displays is no longer available per vehicle. 
> The topic structure includes `backoffice` at the vehicleId position.
> This is an effort to reduce the amount of data stored on the broker 
