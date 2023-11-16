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

Inform Ruter that the PTO has no intention of servicing the journeys and stops defined by the provided service window.

- All omit attempts require the fields `vehicleTaskId` and `serviceWindow`.
  - `vehicleTaskId`: Can be found in the common file in the NeTEx export under this path `VehicleScheduleFrame.blocks[].Block.PrivateCode`
  - `serviceWindow`: Defines a time range for which calls or journeys the PTO has no intention of servicing.
    Times provided may belong to the same calendar date, or 2 consecutive dates
    Attempts not containing valid date times for `firstDepartureDateTime` and `lastArrivalDateTimes` will be rejected.
