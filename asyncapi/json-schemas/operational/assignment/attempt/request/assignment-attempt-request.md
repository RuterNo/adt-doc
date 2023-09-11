### AssignmentAttemptRequest Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/operational/assignment/attempt/request                                             |
| Schema        | [ assignment-attempt-request.json ](json-schemas/operational/assignment/attempt/request/assignment-attempt-request.json) |
| Producer      | PTO                                                                                                                      |
| Consumer      | [Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                |

### AssignmentAttemptRequest Usage
`operational/assignment/attempt` follows the request/response/state pattern. When a `request` is made to the request topic, a `response` will be available at the response topic once Ruter has finished processing.
In addition, if the `request` results in a change of `state`, the state topic will be updated to reflect the current state as seen by Ruter.

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
- All attempts are effective as soon as Ruter has processed them.
- All attempt request will get an attempt response under the topic [assignment/attempt/response](../response/assignment-attempt-response.md)
- Any request leading to a change of existing assignment state is reflected under the topic [assignment/state](../../status/assignment-status.md)
- Please provide all fields marked as `reqired` in the schema specifications.

#### Sign On
- Any pre-existing assigned assignments will be signed off `AssignmentState.assigned=true`
- Sign on attempts are effective are effective as soon as Ruter has processed them. The vehicle will be assigned the new plan `AssignmentState.assigned=true`
- If the attempt request fails, the state of the vehicle is `AssignmentState.assigned=false`
- A `block` contains a set of journeys.
- A `vehicleTask` is a set of one or more blocks that can be served by one vehicle during one operating day.
  In the example below, the vehicle task with `vehicleTaskId=59001` contains 2 blocks.
- All signOn-attempts require the fields `vehicleTaskId` and `serviceWindow`.
  - `vehicleTaskId`: Can be found in the common file in the NeTEx export under this path `VehicleScheduleFrame.blocks[].Block.PrivateCode`
  - `serviceWindow`: Defines a time range for which journeys the vehicle should be signed on.
    - If the service window contains both `firstDepartureDateTime` and `lastArrivalDateTime`, the vehicle will be logged on
      to all the journeys in the vehicle task between those times. Note that the times may be on the same calendar date
      or on 2 consecutive dates.
    - If the service window contains only `firstDepartureDateTime`, the vehicle will be logged on
      to the journeys from `firstDepartureDateTime` to the end of that block.

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
</VehicleScheduleFrame>```


##### Sign On - PLANNED
- `Default` The vehicle will be signed on to service the pre-existing plans for the specified `serviceWindow`
- If `lastArrivalDateTime` is provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastArrivalDateTime`
- If `lastArrivalDateTime` is not provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until the end of the block

##### Sign On - EXTRA
- Used if additional vehicles are demanded to serve the pre-existing plans for the specified `serviceWindow`
- If `lastArrivalDateTime` is provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastArrivalDateTime`
- If `lastArrivalDateTime` is not provided, the assignment will contain all journeys/stops from (including) `firstDepartureDateTime` until the end of the journey

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
- If `lastArrivalDateTime` is provided, journeys/stops from (including) `firstDepartureDateTime` until (excluding) the specified `lastArrivalDateTime` are removed from the assignment
- If `lastArrivalDateTime` is not provided, the stop with `firstDepartureDateTime` will be removed from the assignment
