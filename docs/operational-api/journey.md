The journey API endpoints, available under `{baseURL}/journey/*`, give clients access to
look up
[planned service journeys](#journeys),
[service lines](#journey-lines) and
[stop points](#journey-stop-points)
in the operational journey database.

### Journeys

The `{baseURL}/journey/journeys` endpoint can be used for looking up journeys in the operational
journey database.

For clients who do not have their own copy of planned journeys ([See Traffic Plan API](https://adt.transhub.io/latest/traffic-plan/)), such lookups are required in order to use the [Assignment API](assignment.md) to sign on vehicles on
journeys or use the [Deviation API](deviation.md) to register service deviations.

**Search Parameters**

- `query`: General-purpose search string. May be used to find journeys via various identifiers such as _vehicle journey id_, _service journey id_ and _dated service journey id_.
- `stopPointId`: Filters journeys by stop point identifier. Accepts various stop point identifiers such as NSR:Quay IDs (e.g., "NSR:Quay:109233") and returns journeys that serve the specified stop point, including details like stop name (e.g., "Nationaltheatret"), public code, and related stop area references.
- `vehicleTask`: Filters journeys by vehicle task identifier. Accepts a numeric vehicle task ID (e.g., "1702") to return journeys associated with the specified vehicle task.
- `vehicleId`: If provided, only journeys assigned to the specified vehicle will be returned.'
- `line`: Filters journeys by line identifier. Accepts a line number or code (e.g., "70") and returns journeys operating on that line, including details like line reference ("RUT:Line:70"), public code, and transport mode information.
- `lat` and `lon`: Location parameters. May be used to find journeys starting from nearby stop points.
- `direction`: Direction of the journey. May be used to find journeys in a specific direction.
- `fromDateTime` and `toDateTime`: Timestamps for narrowing service window of matched journeys. If not provided,
  a default service window covering the current day will be used.
- `includeCalls`: If set to `true`, the response will include the stop points (calls) for each matched journey.

#### Find Journeys - by Line Id

To find journeys servicing a specific line, a line identifier can be provided as `lineId` string.

In this example, we also limit the returned journeys to a line in a given direction (`INBOUND`) and within a specific service windows
(`fromDateTime` and `toDateTime`).

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?
>>> line=L01&
>>> direction=INBOUND&
>>> fromDateTime=2025-03-03T00:00+01:00&
>>> toDateTime=2025-03-04T00:00+01:00
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Service Journey 0001",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0001",
      "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0001",
      "serviceJourneyId" : "RUT:ServiceJourney:0001",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0001"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  }, {
    "name" : "Service Journey 0003",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0003",
      "firstDepartureDateTime" : "2025-03-03T10:30+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0003",
      "serviceJourneyId" : "RUT:ServiceJourney:0003",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0003"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T10:30+01:00",
      "end" : "2025-03-03T10:50+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 2
  }
}
```

#### Find Journeys - by Vehicle Task Id

To find journeys servicing a specific vehicle task, a vehicle task identifier can be provided as `vehicleTask` string.

In this example, we use this mechanism to look up all journeys included in a vehicle task. Since we do not include any
service windows date range in our query, we only get journeys matching the given vehicle task on the current date.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?vehicleTask=VL1001
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Service Journey 0001",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0001",
      "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0001",
      "serviceJourneyId" : "RUT:ServiceJourney:0001",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0001"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  }, {
    "name" : "Service Journey 0002",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0002",
      "firstDepartureDateTime" : "2025-03-03T09:45+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0002",
      "serviceJourneyId" : "RUT:ServiceJourney:0002",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0002"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:45+01:00",
      "end" : "2025-03-03T10:05+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "OUTBOUND",
    "vehicleTaskId" : "VL1001"
  }, {
    "name" : "Service Journey 0003",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0003",
      "firstDepartureDateTime" : "2025-03-03T10:30+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0003",
      "serviceJourneyId" : "RUT:ServiceJourney:0003",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0003"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T10:30+01:00",
      "end" : "2025-03-03T10:50+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 3
  }
}
```

#### Find Journeys - by Vehicle Id

To find journeys servicing a specific vehicle id, a vehicle id identifier can be provided as `vehicleId` string.

In this example, we use this mechanism to look up all journeys for a vehicle id. Since we do not include any
service windows date range in our query, we only get journeys matching the given vehicle id on the current date.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?vehicleId=VI00TEST001
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Service Journey 0001",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0001",
      "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0001",
      "serviceJourneyId" : "RUT:ServiceJourney:0001",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0001"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  }, {
    "name" : "Service Journey 0002",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0002",
      "firstDepartureDateTime" : "2025-03-03T09:45+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0002",
      "serviceJourneyId" : "RUT:ServiceJourney:0002",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0002"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:45+01:00",
      "end" : "2025-03-03T10:05+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "OUTBOUND",
    "vehicleTaskId" : "VL1001"
  }, {
    "name" : "Service Journey 0003",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0003",
      "firstDepartureDateTime" : "2025-03-03T10:30+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0003",
      "serviceJourneyId" : "RUT:ServiceJourney:0003",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0003"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T10:30+01:00",
      "end" : "2025-03-03T10:50+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001"
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 3
  }
}
```

#### Find Journeys - include Journey Calls

By defaults, call details are not included when searching for journeys. To include call details in response, `includeCalls=true` search
parameter may be used.

In this example, we use journey search API to look up a specific journey (by dated service journey id), including call data for the
journey.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?query=RUT:DatedServiceJourney:0001&includeCalls=true
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Service Journey 0001",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0001",
      "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0001",
      "serviceJourneyId" : "RUT:ServiceJourney:0001",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0001"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001",
    "calls" : [ {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:001A",
          "stopPointId" : "stop-point-001A"
        },
        "departureDateTime" : "2025-03-03T09:00+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:002A",
          "stopPointId" : "stop-point-002A"
        },
        "arrivalDateTime" : "2025-03-03T09:10+01:00",
        "departureDateTime" : "2025-03-03T09:10+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:003A",
          "stopPointId" : "stop-point-003A"
        },
        "arrivalDateTime" : "2025-03-03T09:20+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    } ]
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 1
  }
}
```

#### Find Journeys - by Stop Point Platform Code

To find journeys servicing a specific stop point, a stop point identifier can be provided as `stopPoint` string.
To see the stop points in the result, please include the param `includeCalls=true`

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?
>>> stopPoint=NSR:Quay:001A&
>>> includeCalls=true
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Service Journey 0001",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0001",
      "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0001",
      "serviceJourneyId" : "RUT:ServiceJourney:0001",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0001"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001",
    "calls" : [ {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:001A",
          "stopPointId" : "stop-point-001A"
        },
        "departureDateTime" : "2025-03-03T09:00+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:002A",
          "stopPointId" : "stop-point-002A"
        },
        "arrivalDateTime" : "2025-03-03T09:10+01:00",
        "departureDateTime" : "2025-03-03T09:10+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:003A",
          "stopPointId" : "stop-point-003A"
        },
        "arrivalDateTime" : "2025-03-03T09:20+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    } ]
  }, {
    "name" : "Service Journey 0003",
    "spec" : {
      "lineId" : "RUT:Line:001",
      "journeyId" : "RUT:DatedServiceJourney:0003",
      "firstDepartureDateTime" : "2025-03-03T10:30+01:00"
    },
    "journeyIds" : {
      "vehicleJourneyId" : "vehicle-journey-0003",
      "serviceJourneyId" : "RUT:ServiceJourney:0003",
      "datedServiceJourneyId" : "RUT:DatedServiceJourney:0003"
    },
    "serviceWindow" : {
      "start" : "2025-03-03T10:30+01:00",
      "end" : "2025-03-03T10:50+01:00"
    },
    "line" : {
      "name" : "Testveien - Teststien",
      "lineId" : "RUT:Line:001",
      "publicCode" : "L01",
      "textColor" : "FFFFFF",
      "backgroundColor" : "1F1E1A"
    },
    "direction" : "INBOUND",
    "vehicleTaskId" : "VL1001",
    "calls" : [ {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:001A",
          "stopPointId" : "stop-point-001A"
        },
        "departureDateTime" : "2025-03-03T10:30+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:002A",
          "stopPointId" : "stop-point-002A"
        },
        "arrivalDateTime" : "2025-03-03T10:40+01:00",
        "departureDateTime" : "2025-03-03T10:40+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    }, {
      "spec" : {
        "stopPoint" : {
          "quayId" : "NSR:Quay:003A",
          "stopPointId" : "stop-point-003A"
        },
        "arrivalDateTime" : "2025-03-03T10:50+01:00"
      },
      "behaviourType" : "FULL_SERVICE"
    } ]
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 2
  }
}
```
### Journey Lines

The `{baseURL}/journey/lines` endpoint can be used for looking up service lines in the operational
journey database.

**Search Parameters**

- `query`: General-purpose search string. May be used to find lines via identifiers such as _line id_ and _public code_,
  or a (sub)string name search.

#### Find Journey Lines - by Name

To find lines matching a specific name, a name (sub)string can be provided as `query` parameter.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/lines?query=veien
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "name" : "Testveien - Teststien",
    "lineId" : "RUT:Line:001",
    "publicCode" : "L01",
    "textColor" : "FFFFFF",
    "backgroundColor" : "1F1E1A"
  }, {
    "name" : "Testveien - Teststien (Express)",
    "lineId" : "RUT:Line:002",
    "publicCode" : "L02",
    "textColor" : "FFFFFF",
    "backgroundColor" : "2F2E2A"
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 2
  }
}
```
### Journey Stop Points

The `{baseURL}/journey/stop-points` endpoint can be used for looking up stop points in the operational journey
database.

**Search Parameters**

- `query`: General-purpose search string. May be used to find stop points via identifiers such as _NSR quay id_, or a
  (sub)string name search.

#### Find Journey Stop Points - by Name

To find stop points matching a specific name, a name (sub)string can be provided as `query` parameter.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/stop-points?query=stien
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "spec" : {
      "quayId" : "NSR:Quay:003A",
      "stopPointId" : "stop-point-003A"
    },
    "name" : "Teststien A",
    "publicCode" : "A"
  }, {
    "spec" : {
      "quayId" : "NSR:Quay:003B",
      "stopPointId" : "stop-point-003B"
    },
    "name" : "Teststien B",
    "publicCode" : "B"
  } ],
  "page" : {
    "limit" : 100,
    "offset" : 0,
    "itemCount" : 2
  }
}
```
