### AssignmentOmitRequest Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/back_office/adt/v3/operational/assignment/omit/request                                                |
| Schema        | [ assignment-omit-request.json ](json-schemas/operational/assignment/omit/request/assignment-omit-request.json)          |
| Producer      | PTO                                                                                                                      |
| Consumer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                |

### AssignmentOmitRequest Usage
Follows the request/response pattern. When a `request` is made to this topic, a `response` will be available at the [response topic](../response/assignment-omit-response.md) once Ruter has finished processing.

- All omit request will get an omit response under the [response topic](../response/assignment-omit-response.md)
- Please provide all fields marked as `required` in the schema specifications.
- Note that there are no vehicles involved in this exchange.

#### Omit - NO_INTENTION
Introducing the flag `omit` allows the operator to send `omit=false` to cancel an omit.

Inform Ruter that the PTO has no intention of servicing the journeys and stops defined by the provided service window.
- Contents of a omit can now be based on vehicleTask, or a provided list of DatedServiceJourneys.
  - If a list of DatedServiceJourneys is provided, the provided vehicleTask is not included in the omit
  - VehicleTask:
    - Require the fields `vehicleTaskId` and `serviceWindow`.
      - `vehicleTaskId`: Can be found in the common file in the NeTEx export under this path `VehicleScheduleFrame.blocks[].Block.PrivateCode`
      - `serviceWindow`: Defines a time range for which journeys the vehicle should be omitted.
  - A list of DatedServiceJourneys:
    - `datedServiceJourneyId`: Can be found in the respective Journey file in the NeTEx export (See above example xml)
    - `serviceWindow`: Optional: Defines a time range for which calls in the journey the vehicle should be signed on. If not provided, the entire journey is included
    - `calls`: Optional: Defines a list of calls by `NSR:Quay:Id`. This list can be used if only one call should be omitted, or the calls do not fall within one service windw
