### AssignmentAttemptRequest Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/operational/assignment/attempt/request                                             |
| Schema        | [ assignment-attempt-request.json ](json-schemas/operational/assignment/attempt/request/assignment-attempt-request.json) |
| Producer      | PTO                                                                                                                      |
| Consumer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                |

### AssignmentAttemptRequest Usage
Follows the request/response/state pattern. When a `request` is made to the request topic, a `response` will be available at the [response topic](../response/assignment-attempt-response.md) once Ruter has finished processing.
In addition, if the `request` results in a change of `state`, the [status topic](../../status/assignment-status.md) will be updated to reflect the current state as seen by Ruter.

An `AssignmentAttemptRequest` can be made for:

| Action  | Description                                                                                   |
|---------|-----------------------------------------------------------------------------------------------|
| SignOn  | Creating an Assignment for a vehicle. Signing a vehicle on to a set of planned journeys/stops |
| SignOff | Signing a vehicle off from an assigned assignment                                             |
| Update  | Altering an existing assigned assignment                                                      |

- The message is composed of three operations (signOn, signOff, update). Only one operation will be processed per message received by Ruter. This gives that each message should only contain one operation. If the message contains more than one operation, the order of precedence is the following:
  1. signOn
  2. signOff
  3. update
- Attempt request will get an attempt response under the [response topic](../response/assignment-attempt-response.md)
- Any request leading to a change of existing assignment state is reflected under the [status topic](../../status/assignment-status.md)
  - This topic will also be updated when Ruter has initiated any change to the existing assignment
- Please provide all fields marked as `reqired` in the schema specifications.


#### Definitions
- A `block` contains a set of journeys.
- A `vehicleTask` is a set of one or more blocks that can be served by one vehicle during one operating day.
  In the example below, the vehicle task with `vehicleTaskId=59001` consists of the 2 `Block`s with `<PrivateCode>59001</PrivateCode>`.

##### Example of NeTEx definition of a vehicle task with 2 blocks
```xml
<VehicleScheduleFrame version="20220908125021" id="RUT:VehicleScheduleFrame:1">
  <blocks>
    <Block version="20220908125021" id="RUT:Block:168197-59001mut-202209081312000">
      <PrivateCode>59001</PrivateCode>
      <StartTime>11:12:00</StartTime>
      <EndTime>14:41:00</EndTime>
      <dayTypes>
        <DayTypeRef ref="RUT:DayType:2022-09-08"/>
      </dayTypes>
      <StartPointRef ref="RUT:ScheduledStopPoint:Fg" version="20220908125021"/>
      <EndPointRef ref="RUT:ScheduledStopPoint:Fg" version="20220908125021"/>
      <journeys>
        <DeadRunRef ref="RUT:DeadRun:006723-008020-131200"/>
        <VehicleJourneyRef ref="RUT:ServiceJourney:003565-004003-131500"/>
        ...
      </journeys>
    </Block>
    <Block version="20220908125021" id="RUT:Block:168197-59001muwt-202209080359000">
      <PrivateCode>59001</PrivateCode>
      <StartTime>01:59:00</StartTime>
      <EndTime>06:16:00</EndTime>
      <dayTypes>
        <DayTypeRef ref="RUT:DayType:2022-09-08"/>
      </dayTypes>
      <StartPointRef ref="RUT:ScheduledStopPoint:Fg" version="20220908125021"/>
      <EndPointRef ref="RUT:ScheduledStopPoint:Fg" version="20220908125021"/>
      <journeys>
      <DeadRunRef ref="RUT:DeadRun:006713-008006-035900"/>
      <VehicleJourneyRef ref="RUT:ServiceJourney:002521-002932-041700"/>
      ...
      </journeys>
    </Block>
  </blocks>
</VehicleScheduleFrame>
```

#### Sign On
- Any pre-existing assigned assignments will be signed off `AssignmentState.assigned=true`
- If the attempt request succeeds, the vehicle will be assigned the new plan `AssignmentState.assigned=true`
- If the attempt request fails, the state of the vehicle is `AssignmentState.assigned=false`
  - The reason for failing will be available under the [response topic](../response/assignment-attempt-response.md)
- All signOn-attempts require the fields `vehicleTaskId` and `serviceWindow`.
  - `vehicleTaskId`: Can be found in the common file in the NeTEx export under this path `VehicleScheduleFrame.blocks[].Block.PrivateCode`
  - `serviceWindow`: Defines a time range for which journeys the vehicle should be signed on.
    The vehicle will be signed on to all the journeys in the vehicle task between provided times.
    Signed on journeys may be part of 1 or more `Block`s.
    Times provided may belong to the same calendar date, or 2 consecutive dates.
    Attempts not containing valid date times for `firstDepartureDateTime` and `lastArrivalDateTimes` will be rejected, resulting in `AssignmentState.assigned=false`

##### Sign On - PLANNED
The vehicle will be signed on to service the pre-existing plans for the specified `serviceWindow`

##### Sign On - EXTRA
Used if additional vehicles are demanded to serve the pre-existing plans for the specified `serviceWindow`

##### Sign On - REPLACEMENT
Used if another vehicle can not service parts of its assignment. 
The operator should sign off the other vehicle using either `SHORTENING` or `BREAKDOWN`.

_Note: Ruter will not sign off the other vehicle automatically._

### Sign Off
#### Sign Off - FINISHED
The vehicle has serviced all journeys in the assignment
#### Sign Off - BREAKDOWN
The vehicle has broken down, or in some way not capable of servicing the rest of the assignment
#### Sign Off - CANCELLED
Remaining not serviced stops/journeys in the assignment will not be serviced (by the assigned vehicle).
#### Sign Off - SHORTENING _(Deprecated)_
Same as `CANCELLED`
#### Additional Sign Off codes used by RUTER
- `REPLACED`
  When a vehicle attempts a SignOn with the code `REPLACED`. Any other vehicle signed on to the same vehicle task and not marked as `EXTRA` will be automatically signed off with the code `REPLACED`.
- `EXPIRED`
  Given a successfull signOn, if the vehicle is not signed off before two hours after the last planned arrival. The vehicle will be automatically signed off with the code `EXPIRED`.

### Update
#### Update - SHORTENING
Operational change of a pre-existing assigned assignment for a vehicle.

Failed attempts will not affect the assignment state for a vehicle.
- `serviceWindow` is honoured as `SignOn - PLANNED`

##### Example case for SHORTENING

Given an assignment (vehicle plan) with two journeys:
```
Journey 1
Quay 1 dep 2023-04-27T10:00Z
Quay 2 arr 2023-04-27T10:01Z, dep 2023-04-27T10:01Z
Quay 3 arr 2023-04-27T10:02Z

Journey 2
Quay 3 dep 2023-04-27T10:03Z
Quay 2 arr 2023-04-27T10:04Z, dep 2023-04-27T10:04Z
Quay 1 arr 2023-04-27T10:05Z
```
When SHORTENING
```json
{
    "eventTimestamp": "2023-04-27T12:40:12.631914Z",
    "traceId": "083b71c4-e417-11ed-b5ea-0242ac120004",
    "update":
    {
        "code": "SHORTENING",
        "serviceWindow":
        {
            "firstDepartureDateTime": "2023-04-27T10:02Z",
            "lastArrivalDateTime": "2023-04-27T10:03Z"
        }
    }
}
```
Then; both visits at Quay 3 will be removed from the assignment.
The resulting assignment will be:
```
Journey 1
Quay 1 dep 2023-04-27T10:00Z
Quay 2 arr 2023-04-27T10:01Z, dep 2023-04-27T10:01Z

Journey 2
Quay 2 arr 2023-04-27T10:04Z, dep 2023-04-27T10:04Z
Quay 1 arr 2023-04-27T10:05Z
```
Effectively, the vehicle should turn around at Journey 1 Quay 2 and continue servicing Journey 2 from Quay 2
