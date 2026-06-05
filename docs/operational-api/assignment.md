The vehicle assignment lifecycle in public transportation consists of four main stages:

1. **Vehicle State Check (optional)**: Determine the current status of the vehicle.
2. **Journey API (optional)**: Look up and retrieve accurate journey information.
3. **Sign-On**: Initialize and synchronize the vehicle for its operational duties, using journey information from the Journey API if available.
4. **Sign-Off**: End the vehicle's operational duties or remove it from service.

These stages form a continuous cycle that ensures efficient management of vehicle operations.

Before the Sign-On process, operators can use the [Journey API](journey.md) to look up and retrieve journey information.

This step is optional but can be beneficial for ensuring accurate and up-to-date journey details. The Journey API provides:

- Detailed journey specifications
- Service windows
- Stop point information

The results obtained from the Journey API can be used directly in the Sign-On API request.

This integration ensures that the most current and accurate journey information is used when signing on a vehicle, reducing discrepancies and improving operational efficiency.


### Assignment: Vehicle State
- Purpose: To determine the current status of a vehicle at any given time, especially after periods of disconnection.
- Process:
    1. The vehicle or control center initiates a state check
    2. The system returns the vehicle's current state, including:
        - Sign-on status
        - List of signed-on journeys (if any)
        - Description of the last action that changed the vehicle's state
    3. This state information is used to determine the next appropriate action (sign-on or remain in current state).

#### Vehicle State - Signed On

Example illustrating retrieval of vehicle state for vehicle VI00TEST001 while is signed on to a single journey.

In this example, we also provide `includeCalls=true` query parameter, to include all calls in all assigned journeys in the response.

HTTP request:

```bash
GET /api/adt/v4/operational/assignment/vehicles/VI00TEST001?includeCalls=true
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : true,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    },
    "journeys" : [ {
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
    } ]
  }
}
```

#### Vehicle State - Signed Off

Example illustrating retrieval of vehicle state for vehicle VI00TEST001 while is not signed on journeys.

HTTP request:

```bash
GET /api/adt/v4/operational/assignment/vehicles/VI00TEST001
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : false,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    }
  }
}
```
### Assignment: Sign-On
- Purpose: To initialize and synchronize a vehicle for its operational duties.
- Triggers:
    - Start of an operational day
    - After system restart or reboot
    - Reconnection after lost connectivity
- Process:
    1. Perform a [Vehicle State Check](#assignment-vehicle-state).
    2. If changes to the current state are needed, perform a [Sign-Off](#assignment-sign-off) first.
    3. Send a sign-on request
    4. The backend verifies the journeys and responds with:
        - Confirmations
        - Discrepancies
        - Updated journey information
    5. The vehicle system updates its information based on the response.
    6. The vehicle is now in an assigned state and ready for operation.

#### Sign-On - Additional Details

**MQTT Routing Details**

For all sign-on requests, the structure `mqttRouting` is functionally required.

Info provided in this structure will define how the traffic authority will communicate back to the operator via the
MQTT protocol. This communication is vehicle-specific and requires routing information for the specific vehicle to
be provided in the request.

**Vehicle Properties**

As part of the sign-on request, additional optional vehicle properties may be provided to give further information
about the physical properties of the vehicle for passenger information purposes:

```json
{
    "vehicle": {
        "segmentCount": 2,
        "segmentIds": ["SEGMENTID001", "SEGMENTID002"]
    }
}
```

The `segmentCount` field is optional and indicates the number of carriages in a multi-segment vehicle (e.g., a metro
train consisting of two carriage sets).
The `segmentIds` field is optional and contains the ids of the carriages in a multi-segment vehicle.

#### Sign-On - Single Journey

To sign a vehicle on a single journey, an attempt request with a single
[journey specification](intro.md#journey-specifications) can be used.

HTTP request:

```bash
POST /api/adt/v4/operational/assignment/attempts
{
  "vehicleId" : "VI00TEST001",
  "signOn" : {
    "vehicle" : {
      "segmentCount" : 1
    },
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    },
    "featureLevel" : "COMPLETE",
    "journeys" : [ {
      "journey" : {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "vehicle-journey-0001",
          "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T09:00+01:00",
          "end" : "2025-03-03T09:20+01:00"
        }
      }
    } ]
  }
}
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : true,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    },
    "journeys" : [ {
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
    } ]
  }
}
```

#### Sign-On - Multiple Journeys with Ad-Hoc Dead-Runs

In addition to providing a list of journeys when signing on, a sign-on attempt may also include one ore more _ad-doc "dead run"_
journeys, provided as a list of
[call specifications](intro.md#journey-call-specifications)
with two elements in each list, where the first call denotes the starting point of the ad-hoc journey and the second call denotes
the ending point.

In this example, we also used different
[journey identifiers](intro.md#journey-identifiers)
to sign on to each of the three planned journeys, illustrating how the different identifiers may be used in a
[journey specification](intro.md#journey-specifications).

HTTP request:

```bash
POST /api/adt/v4/operational/assignment/attempts
{
  "vehicleId" : "VI00TEST001",
  "signOn" : {
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    },
    "featureLevel" : "LIGHT",
    "journeys" : [ {
      "calls" : [ {
        "stopPoint" : {
          "quayId" : "RUT:Quay:ga01",
          "stopPointId" : "garage-01"
        },
        "departureDateTime" : "2025-03-03T08:45+01:00"
      }, {
        "stopPoint" : {
          "quayId" : "NSR:Quay:001A",
          "stopPointId" : "stop-point-001A"
        },
        "arrivalDateTime" : "2025-03-03T08:59+01:00"
      } ]
    }, {
      "journey" : {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "RUT:ServiceJourney:0001",
          "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T09:00+01:00",
          "end" : "2025-03-03T09:20+01:00"
        }
      }
    }, {
      "journey" : {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "vehicle-journey-0002",
          "firstDepartureDateTime" : "2025-03-03T09:45+01:00"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T09:45+01:00",
          "end" : "2025-03-03T10:05+01:00"
        }
      }
    }, {
      "journey" : {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "RUT:DatedServiceJourney:0003",
          "firstDepartureDateTime" : "2025-03-03T10:30+01:00"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T10:30+01:00",
          "end" : "2025-03-03T10:50+01:00"
        }
      }
    }, {
      "calls" : [ {
        "stopPoint" : {
          "quayId" : "NSR:Quay:003A",
          "stopPointId" : "stop-point-003A"
        },
        "departureDateTime" : "2025-03-03T10:55+01:00"
      }, {
        "stopPoint" : {
          "quayId" : "RUT:Quay:ga02",
          "stopPointId" : "garage-02"
        },
        "arrivalDateTime" : "2025-03-03T11:10+01:00"
      } ]
    } ]
  }
}
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : true,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    },
    "journeys" : [ {
      "name" : "Ad-Hoc Journey RUT:Quay:ga01 2025-03-03T08:45+01:00 - NSR:Quay:001A 2025-03-03T08:59+01:00",
      "spec" : {
        "firstDepartureDateTime" : "2025-03-03T08:45+01:00"
      },
      "serviceWindow" : {
        "start" : "2025-03-03T08:45+01:00",
        "end" : "2025-03-03T08:59+01:00"
      }
    }, {
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
    }, {
      "name" : "Ad-Hoc Journey NSR:Quay:003A 2025-03-03T10:55+01:00 - RUT:Quay:ga02 2025-03-03T11:10+01:00",
      "spec" : {
        "firstDepartureDateTime" : "2025-03-03T10:55+01:00"
      },
      "serviceWindow" : {
        "start" : "2025-03-03T10:55+01:00",
        "end" : "2025-03-03T11:10+01:00"
      }
    } ]
  }
}
```
### Assignment: Sign-Off
- Purpose: To end a vehicle's operational duties or remove it from service.
- Triggers:
    - Completion of all assigned journeys
    - Need to take the vehicle out of service (e.g., for maintenance)
- Process:
    1. Send a sign-off request
    2. The system immediately processes the sign-off.
    3. The vehicle's state changes to not signed on.
    4. The vehicle is now ready to re-enter the cycle, typically starting with a Vehicle State Check when it's next
       needed for service.

> **Note:**
>
> If a vehicle is not manually signed off within two hours after the last signed-on journey was scheduled to finish,
> the backend system will automatically perform a sign-off for that vehicle.

#### Sign-Off - FINISHED

The vehicle has serviced all journeys in the assignment

HTTP request:

```bash
POST /api/adt/v4/operational/assignment/attempts
{
  "vehicleId" : "VI00TEST001",
  "signOff" : {
    "code" : "FINISHED"
  }
}
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : false,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    }
  }
}
```

#### Sign-Off - CANCELLED

Remaining not serviced stops/journeys in the assignment will not be serviced (by the assigned vehicle).

HTTP request:

```bash
POST /api/adt/v4/operational/assignment/attempts
{
  "vehicleId" : "VI00TEST001",
  "signOff" : {
    "code" : "CANCELLED"
  }
}
```

HTTP response:

```bash
200 OK
{
  "vehicleState" : {
    "assigned" : false,
    "mqttRouting" : {
      "operatorId" : "PTO",
      "authorityId" : "PTA",
      "vehicleId" : "VI00TEST001"
    }
  }
}
```
