### AssignmentAttemptRequest Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/operational/assignment/attempt/request                                             |
| Schema        | [ assignment-attempt-request.json ](json-schemas/operational/assignment/attempt/request/assignment-attempt-request.json) |

### AssignmentAttemptRequest Usage
An `AssignmentAttemptRequest` can be made for:

| Action  | Description                                                                                   |
|---------|-----------------------------------------------------------------------------------------------|
| SignOn  | Creating an Assignment for a vehicle. Signing a vehicle on to a set of planned journeys/stops |
| SignOff | Signing a vehicle off from an assigned assignment                                             |
| Update  | Altering an assigned assignment                                                               |

- The message is composed of three operations (signOn, signOff, update). Each message must only contain one of these. If the message contains more than one part, the order of precedence is the following:
  1. signOn
  2. signOff
  3. update
- All attempts are effective immediately.
- All attempt request will get an attempt response under the topic [assignment/attempt/response](../response/assignment-attempt-response.md)
- Any request leading to a change of existing assignment state is reflected under the topic [assignment/state](../../status/assignment-status.md)
- Please provide all fields marked as `reqired` in the schema specifications.

#### Sign On
- Any pre-existing assigned assignments will be signed off `AssignmentState.assigned=true`
- Sign on attempts are effective immediately. The vehicle will immediately be assigned the new plan `AssignmentState.assigned=true`
- If the attempt request fails, the state of the vehicle is `AssignmentState.assigned=false`
- A `vehicleTask` is a set of one or more blocks containing the journeys to be served.
- All signOn-attempts require the field `vehicleTask`.
- Journeys outside the specified `vehicleTask` will never be included


##### Sign On - PLANNED
- `Default` The vehicle will be signed on to service the pre-existing plans for the specified `serviceWindow`
- If `lastAttivalDateTime` is provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastAttivalDateTime`
- If `lastAttivalDateTime` is not provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until the end of the block

##### Sign On - EXTRA
- Used if additional vehicles are demanded to serve the pre-existing plans for the specified `serviceWindow`
- If `lastAttivalDateTime` is provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastAttivalDateTime`
- If `lastAttivalDateTime` is not provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until the end of the journey

##### Sign On - REPLACEMENT
- Used if another vehicle can not service parts of its assignment. The other vehicle should be signed off.
- `serviceWindow` is honoured as `PLANNED`
### Sign Off
#### Sign Off - FINISHED
- The vehicle has serviced all journeys in the assignment
#### Sign Off - BREAKDOWN
- The vehicle has broken down, or in some way not capable of servicing the rest of the assignment
#### Sign Off - CANCELLED
- Remaining not serviced stops/journeys in the assignment will not be serviced (by any vehicles).
#### Sign Off - SHORTENING
- Same as `CANCELLED`

### Update
#### Update - SHORTENING
- Operational change of a pre-existing assigned assignment for a vehicle.
- Failed attempts will not affect the assignment state for a vehicle.
- `serviceWindow.firstDepartureDateTime` is required
- If `lastAttivalDateTime` is provided, journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastArrivalDateTime` are removed from the assignment
- If `lastAttivalDateTime` is not provided, the stop with `firstDepartureDateTime` will be removed from the assignment
