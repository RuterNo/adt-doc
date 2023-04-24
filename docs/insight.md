# SLA Insight

## Background

The PTO is the single entity being responsible for monitoring interfaces and equipment on board their own vehicles. The 
APIs below should only be viewed as a supplement, and not a replacement of any monitoring solutions by the PTO.

To provide some insights into what Ruter AS observes from our part, we have decided to share some insights into our 
continuous monitoring systems. By observing these data, the PTOs have an additional tool to help them identify and resolve
issues that may disrupt the customer experience on board their vehicle. 

## APIs

### Display status V1
#### Functional description

This application has been made to assist operators in identifying issues with their equipment.
The original data source used here is the same as the one used by Ruter to calculate SLA for DPI displays. However, **this API is not intended for calculating SLA breaches.**

The application reports any change to display statuses as retained messages on MQTT. This way the last know status of the vehicle is available to the operator at any time.

#### Evaluation

Based on data sent to the vehicle and DPI diagnostic messages received from the vehicle, the following things are checked:

* Are any displays running?
* Are the right number of displays running for the bus type?
* Are the displays running the right version of the DPI application?
* Are the displays showing the current route?
* Do the screens have client-side storage in browser? 
* Is the screen resolution matched to the right display type?

These are determined in the ComplianceCalculator class. It will evaluate all of these and produce the following compliance values:

* *OK* - all tests have passed
* *FAIL* - one or more test has failed
* *NOT_IN_SERVICE* - the bus is on a dead run, so no compliance is required.
* *UNKNOWN* - we don't know what journey the bus should be on so cannot evaluate compliance

*FAIL* is the only value that implies SLA non-compliance.

Along with the overall Compliance value, a list of zero or more ComplianceFault values to explain the result. In addition, metadata is recorded so that the correctness of the Compliance value can be understood. This includes information about the current journey/route, counts of known and seen displays, and a list of displays from which we received heartbeats.


#### Technical description

##### Payload fields

| Field                | Type             | Description                                                                                                                       |
|----------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| eventTimestamp       | string.          | ISO-8601 format / UTC, the evaluation time                                                                                        |
| Compliance           | enumeration      | OK / FAIL / UNKNOWN / NOT_IN_SERVICE                                                                                              |
| ComplianceFaults     | array of string  | List of faults, if any are detected, regardless of overall compliance. See list of possible strings in a later section            |
| JourneyStatus        | enumeration      | ON_SERVICE_JOURNEY / ON_DEAD_RUN / UNKNOWN. LatestJourneyId is evaluate to determine this value.                                  |
| TotalDisplayCount    | integer          | count of all client IDs that have been recorded since state has been recorded. (State will be reset after 4 hours of inactivity.) |
| ExpectedDisplayCount | integer          | number of expected client IDs / displays for this vehicle. If incorrect, please contact: `rdp-support@ruter.no`                   |
| LiveDisplayCount     | integer          | count of displays sending heartbeat at evaluation time. These will be listed in the following item.                               |
| Displays             | array of Display | list of all displays sending heartbeat at evaluation time. See next section for definition of Display.                            |

###### Display

| Field        | Type          | Description                                                                                     |
|--------------|---------------|-------------------------------------------------------------------------------------------------|
| ClientId     | string        | UUID generated and persisted on CPU unit running display                                        |
| DisplayId    | string        | Current configuration of display                                                                |
| RouteId      | string / null | Route id reported by display. Found in local mqtt topic: ` pe/dpi/journey `, field: `/route/id` |
| DPIVersion   | string        | DPI version reported by display                                                                 |
| MediaVersion | string / null | Media package version reported by display                                                       |

###### Specific Fault Messages

| Code                            | Description                                           |
|---------------------------------|-------------------------------------------------------|
| DATA_OUT_OF_SYNC                | all displays have incorrect route                     |
| DATA_PARTLY_IN_SYNC             | some displays have incorrect route                    |
| NO_LIVE_DISPLAYS                | n live = 0                                            |
| DISPLAYS_MISSING                | expect n live, found n < expected, but n > 0          |
| TOO_MANY_DISPLAYS               | expect n live, found n> expected                      |
| NO_PERSISTENCE_FEATURE          | when some displays missing, assume no persistence     |
| VERSION_NOT_UPGRADED            | all displays are out of date                          |
| VERSION_INCOMPLETE_UPGRADE      | some displays are out of date                         |
| NO_MESSAGES_FROM_BUS            | no MQTT messages were received (including position)   |
| MISCONFIGURED_DISPLAYS          | all displays are misconfigured                        |
| PARTLY_MISCONFIGURED_DISPLAYS   | some displays are misconfigured                       |


#### Examples

##### Topic structure

```
{operator}/ruter/{vehicleId}/pe/sla/displays/v1
```

##### Example 1 - vehicle OK

```
{
  "eventTimestamp": "2022-01-24T15:46:00Z",
  "compliance": "OK",
  "complianceFaults": [],
  "journeyStatus": "ON_SERVICE_JOURNEY",
  "totalDisplayCount": 4,
  "expectedDisplayCount": 4,
  "liveDisplayCount": 4,
  "displays": [
    {
      "clientId": "d1d8b91d3a137x4c567a5c",
      "displayId": "1",
      "routeId": "RUT:Route:110-58",
      "dpiVersion": "2022-01-17T12:17:31Z",
      "mediaVersion": "2021-12-27T09:41:00Z"
    },
    {
      "clientId": "f4d2205br6c8ai4d0eO910",
      "displayId": "2",
      "routeId": "RUT:Route:110-58",
      "dpiVersion": "2022-01-17T12:17:31Z",
      "mediaVersion": "2021-12-27T09:41:00Z"
    },
    {
      "clientId": "7cbc2125l5c12E43049a94",
      "displayId": "3",
      "routeId": "RUT:Route:110-58",
      "dpiVersion": "2022-01-17T12:17:31Z",
      "mediaVersion": "2021-12-27T09:41:00Z"
    },
    {
      "clientId": "9d2fc206ld7b8x42ebga04",
      "displayId": "4",
      "routeId": "RUT:Route:110-58",
      "dpiVersion": "2022-01-17T12:17:31Z",
      "mediaVersion": "2021-12-27T09:41:00Z"
    }
  ]
}
```

##### Example 2 - vehicle FAIL

```
{
  "eventTimestamp": "2022-01-24T16:12:00Z",
  "compliance": "FAIL",
  "complianceFaults": [
    "NO_LIVE_DISPLAYS"
  ],
  "journeyStatus": "ON_SERVICE_JOURNEY",
  "totalDisplayCount": 3,
  "expectedDisplayCount": 3,
  "liveDisplayCount": 0,
  "displays": []
}
```

##### Example 3 - on dead-run

```
{
  "eventTimestamp": "2022-01-24T16:02:00Z",
  "compliance": "NOT_IN_SERVICE",
  "complianceFaults": [
    "NO_LIVE_DISPLAYS"
  ],
  "journeyStatus": "ON_DEAD_RUN",
  "totalDisplayCount": 4,
  "expectedDisplayCount": 4,
  "liveDisplayCount": 0,
  "displays": []
}
```