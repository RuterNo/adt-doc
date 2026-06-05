The service deviation API endpoints under `{baseURL}/deviation/*` allow vehicle operators to notify transport
authorities about upcoming service deviations when planned journeys can not be serviced as initially expected.

The following types of service deviations are supported by the API:

- [`DELAY`](#service-deviation-delay), indicating a delayed start of a planned service journey.
- [`NO_SERVICE`](#service-deviation-no_service), indicating inability to service a planned service journey.
- [`NO_SIGN_ON`](#service-deviation-no_sign_on), indicating a service journey will be serviced, but without
  signing on the vehicle.
- [`BYPASS`](#service-deviation-bypass), indicating that certain calls in a journey will be bypassed by the
  operator.

### Service Deviation Requests

To notify a transport authority about an upcoming deviation in a service delivery, the operator should
post a service deviation request to the `{baseURL}/deviation/deviations` endpoint.

#### Service Deviation Specifications

Each service deviation request contains a _service deviation specification_ describing the service deviation with the
following properties:

1. `code`, a service deviation code describing the type of deviation:
   - `DELAY`, indicating a delayed journey start.
   - `NO_SERVICE`, indicating a line, stop point or journey will not be serviced by the operator.
   - `NO_SIGN_ON`, indicating a journey will be serviced by the operator, but the servicing vehicle will not be
     signing on.
   - `BYPASS`, indicating that certain calls in a journey will be bypassed by the operator.
2. `reason`, a structure containing the [reason code](#service-deviation-reason-codes) for the deviation and an
   optional `comment` describing further details about the reason.
   The comment is for internal use by PTO and PTA and is not used for travel information.
3. `impact`, a [service deviation impact](#service-deviation-impact) structure describing the lines, journeys, stop
   points and journey patterns impacted by the deviation.
4. `duration`, a date-time range with a `start` and `end` describing the active period of the deviation. Together with
   the optional per-entry `serviceWindow` values on impact entries, it controls which dated journeys are targeted.
   See [Duration and Service Windows](intro.md#duration-and-service-windows) for details.
5. `metadata`, a [list of key/value pairs](#service-deviation-metadata) for associating client-specific metadata with
   the deviation, such as connecting service deviations to internal / external systems.
6. `parameters`, a [service deviation parameters](#service-deviation-parameters) structure detailing the functional
   parameters of the deviation.

##### Service Deviation Impact

The service deviation impact structure describes one or more lines, journeys, stop points or journey patterns impacted
by a service deviation. Each entry type accepts an optional `serviceWindow` that refines which journeys within that
entry are targeted. See [Duration and Service Windows](intro.md#duration-and-service-windows) for how `serviceWindow` and
`duration` interact.

1. `lines`, a list of [line specifications](intro.md#journey-line-specifications) describing the impacted lines.
   Each entry may carry an optional `serviceWindow` and an optional `stopPoints` filter for partial line cancellations.
2. `journeys`, a list of [journey specification options](intro.md#journey-specification-options) describing the impacted
   journeys and / or journey calls.
3. `stopPoints`, a list of [stop point specifications](intro.md#journey-stop-point-specifications) describing the impacted
   stop points. Each entry may carry an optional `serviceWindow`.
4. `journeyPatterns`, a list of [journey pattern specifications](intro.md#journey-pattern-specifications) describing the
   impacted journey patterns (turmønster). Each entry may carry an optional `serviceWindow`.

##### Service Deviation Metadata

The service deviation metadata structure is a list of `key` / `value` pairs describing additional metadata about the service
deviation.

###### Service Deviation Metadata Keys

The API defines a set of well-known metadata keys that may be used by clients to associate certain metadata with a
service deviation:

| Key                      | Description                     |
|--------------------------|---------------------------------|
| `PTO_CASE_REF`           | A PTO case reference.           |
| `PTA_CASE_REF`           | A PTA case reference.           |
| `SERVICE_DEVIATION_REF`  | A service deviation reference.  |
| `SERVICE_MITIGATION_REF` | A service mitigation reference. |

_Additional metadata keys may be added in the future._

#### Register Metadata - After creation

After a deviation is created, metadata can be added to it.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations/sd-001/metadata
{
  "action" : "CREATE",
  "metadata" : [ {
    "key" : "PTO_CASE_REF",
    "value" : "PTO-1337"
  } ]
}
```

HTTP response:

```bash
200 OK
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  }
}
```
##### Service Deviation Parameters

The service deviation parameters structure describes the functional parameters of the service deviation:

1. `vehicleId`, optional identifier of vehicle to which the service deviation applies.
2. `delayMinutes`, number of minutes of expected delay, relative to planned arrival / departure time.
3. `operatorExempt`,  flag indicating that operator is exempt from consequences of reported service deviation.
    This is for internal use by PTO and PTA and is not used for travel information.

### Service Deviation: DELAY

#### Delay: on Journey

To notify the transport authority about an upcoming delay on one or more journeys, an operator may send a service deviation request with:
- code `DELAY`
- a list of affected journeys
- the `delayInMinutes` parameter is used to indicate the expected delay from start of journey
- a suitable [reason code](#service-deviation-reason-codes)

> Note that only delay from start of journey is supported by the API.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "DELAY",
    "reason" : {
      "code" : "TRAFFIC_CONGESTION"
    },
    "impact" : {
      "journeys" : [ {
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
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T07:30+01:00",
      "end" : "2025-03-03T19:30+01:00"
    },
    "parameters" : {
      "delayMinutes" : 10
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "DELAY",
      "reason" : {
        "code" : "TRAFFIC_CONGESTION"
      },
      "impact" : {
        "journeys" : [ {
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
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T07:30+01:00",
        "end" : "2025-03-03T19:30+01:00"
      },
      "parameters" : {
        "delayMinutes" : 10
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:10+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:10+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "840660be96fd48c7967f90cc28ac4b34",
      "name" : "SD-2026-1"
    }
  }
}
```
### Service Deviation: NO_SERVICE

#### No Service - on Journey

To notify the transport authority that one or more journeys will not be serviced by the operator, a service deviation request should be
sent with:
- code `NO_SERVICE`
- a list of affected journeys
- a suitable [reason code](#service-deviation-reason-codes)

In this example, we send a _no service_ deviation request with a single journey, in addition to setting the `operatorExempt` parameter
to `true` to indicate that the inability to service the journey is outside operator control and should therefore be exempt from SLA.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SERVICE",
    "reason" : {
      "code" : "WEATHER_SNOW_HEAVY"
    },
    "impact" : {
      "journeys" : [ {
        "journey" : {
          "spec" : {
            "lineId" : "RUT:Line:001",
            "journeyId" : "RUT:DatedServiceJourney:0001",
            "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T09:00+01:00",
            "end" : "2025-03-03T09:20+01:00"
          }
        }
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    }
  }
}
```

#### No Service - on Journey Calls

To notify the transport authority that certain calls in one or more journeys will not be serviced by the operator, a service deviation
request should be sent with:
- code `NO_SERVICE`
- a list of affected journeys
- a list of affected calls per journey
- a suitable [reason code](#service-deviation-reason-codes)

In this example, we send a _no service_ deviation request with three journeys and a single call for each journey, indicating the first
call each journey wil not be serviced by the operator.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SERVICE",
    "reason" : {
      "code" : "WEATHER_SNOW_HEAVY",
      "comment" : "Stop point location is inaccessible due to heavy snowfall"
    },
    "impact" : {
      "journeys" : [ {
        "calls" : [ {
          "stopPoint" : {
            "quayId" : "NSR:Quay:001A",
            "stopPointId" : "stop-point-001A"
          },
          "departureDateTime" : "2025-03-03T09:00+01:00"
        } ],
        "journey" : {
          "spec" : {
            "lineId" : "RUT:Line:001",
            "journeyId" : "RUT:DatedServiceJourney:0001",
            "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T09:00+01:00",
            "end" : "2025-03-03T09:20+01:00"
          }
        }
      }, {
        "calls" : [ {
          "stopPoint" : {
            "quayId" : "NSR:Quay:001A",
            "stopPointId" : "stop-point-001A"
          },
          "departureDateTime" : "2025-03-03T10:30+01:00"
        } ],
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
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T10:50+01:00"
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY",
        "comment" : "Stop point location is inaccessible due to heavy snowfall"
      },
      "impact" : {
        "journeys" : [ {
          "calls" : [ {
            "stopPoint" : {
              "quayId" : "NSR:Quay:001A",
              "stopPointId" : "stop-point-001A"
            },
            "departureDateTime" : "2025-03-03T09:00+01:00"
          } ],
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        }, {
          "calls" : [ {
            "stopPoint" : {
              "quayId" : "NSR:Quay:001A",
              "stopPointId" : "stop-point-001A"
            },
            "departureDateTime" : "2025-03-03T10:30+01:00"
          } ],
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
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T10:50+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:17+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:17+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "69c6821a838245cb968cb0a5d1548fd2",
      "name" : "SD-2026-1"
    }
  }
}
```

#### No Service - on Stop Point - using Duration

To notify the transport authority that one or more stop points will not be serviced by the operator in a given time period, a service
deviation request should be sent with:
- code `NO_SERVICE`
- a list of affected stop points
- a suitable [reason code](#service-deviation-reason-codes)
- a `duration` covering the desired time period.

In this example, we send a _no service_ deviation request with a list of two stop points (one for each quay of a stop place) and a
service deviation duration indicating the stop point will not be serviced for a time period of four hours.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SERVICE",
    "reason" : {
      "code" : "EVENT",
      "comment" : "Stop point temporarily closed due to running event."
    },
    "impact" : {
      "stopPoints" : [ {
        "spec" : {
          "quayId" : "NSR:Quay:001A"
        }
      }, {
        "spec" : {
          "quayId" : "NSR:Quay:001B"
        }
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T13:00+01:00"
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "EVENT",
        "comment" : "Stop point temporarily closed due to running event."
      },
      "impact" : {
        "stopPoints" : [ {
          "spec" : {
            "quayId" : "NSR:Quay:001A"
          }
        }, {
          "spec" : {
            "quayId" : "NSR:Quay:001B"
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T13:00+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:43+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:43+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "7d6ea6e1f1264fe2858668e671786aa9",
      "name" : "SD-2026-1"
    }
  }
}
```

#### No Service - on Stop Point - using Service Windows

To notify the transport authority that one or more stop points will not be serviced by the operator in a given time period, a service
deviation request should be sent with:
- code `NO_SERVICE`
- a list of affected stop points
- a suitable [reason code](#service-deviation-reason-codes)
- a `duration` covering the desired time period.

In this example, we send a _no service_ deviation request with a list of two stop points (one for each quay of a stop place) and a
service windows indicating at what time ranges the stop point will not be serviced.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SERVICE",
    "reason" : {
      "code" : "EVENT",
      "comment" : "Stop point temporarily closed due to running event."
    },
    "impact" : {
      "stopPoints" : [ {
        "spec" : {
          "quayId" : "NSR:Quay:001A"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T09:00+01:00",
          "end" : "2025-03-03T09:20+01:00"
        }
      }, {
        "spec" : {
          "quayId" : "NSR:Quay:001A"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T10:30+01:00",
          "end" : "2025-03-03T10:50+01:00"
        }
      }, {
        "spec" : {
          "quayId" : "NSR:Quay:001B"
        },
        "serviceWindow" : {
          "start" : "2025-03-03T09:45+01:00",
          "end" : "2025-03-03T10:05+01:00"
        }
      } ]
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "EVENT",
        "comment" : "Stop point temporarily closed due to running event."
      },
      "impact" : {
        "stopPoints" : [ {
          "spec" : {
            "quayId" : "NSR:Quay:001A"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T09:00+01:00",
            "end" : "2025-03-03T09:20+01:00"
          }
        }, {
          "spec" : {
            "quayId" : "NSR:Quay:001A"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T10:30+01:00",
            "end" : "2025-03-03T10:50+01:00"
          }
        }, {
          "spec" : {
            "quayId" : "NSR:Quay:001B"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T09:45+01:00",
            "end" : "2025-03-03T10:05+01:00"
          }
        } ]
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:43+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:43+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "7d6ea6e1f1264fe2858668e671786aa9",
      "name" : "SD-2026-1"
    }
  }
}
```

#### No Service - on Journey Pattern

To notify the transport authority that all journeys running a specific journey pattern (turmønster) will not be serviced,
a service deviation request should be sent with:
- code `NO_SERVICE`
- a list of affected journey pattern specs under `impact.journeyPatterns`
- a suitable [reason code](#service-deviation-reason-codes)

A _journey pattern spec_ identifies a journey pattern by its NeTEx `journeyPatternId` (e.g. `RUT:JourneyPattern:008499`).
All dated journeys whose `journeyPatternRef` matches the given id are included in the impact.

An optional `serviceWindow` can be added to each entry to restrict the impact to journeys whose operating window overlaps
the given time range. When omitted, all matching journeys within the deviation duration are targeted.

In this example, we send a _no service_ deviation request targeting a single journey pattern, with the `operatorExempt`
parameter set to `true` to indicate that the inability to service the journeys is outside operator control.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SERVICE",
    "reason" : {
      "code" : "WEATHER_SNOW_HEAVY"
    },
    "impact" : {
      "journeyPatterns" : [ {
        "spec" : {
          "journeyPatternId" : "RUT:JourneyPattern:008499"
        }
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeyPatterns" : [ {
          "spec" : {
            "journeyPatternId" : "RUT:JourneyPattern:008499"
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "c2f3a1b045e84c2d9a7e6d8f3b0c1a2e",
      "name" : "SD-2026-1"
    }
  }
}
```
### Service Deviation: NO_SIGN_ON

#### No Sign-On - on Journey

To notify the transport authority that one or more journeys will be serviced by a vehicle which is not able to sign on, a service
deviation request should be sent with:
- code `NO_SIGN_ON`
- a list of affected journeys
- a suitable [reason code](#service-deviation-reason-codes)

It is recommended to set the `vehicleId` parameter to indicate which vehicle will be used to service the journey.

In this example, we send a _no sign-on_ deviation request with a single journey, a reason code and a comment describing why the
vehicle is unable to sign on.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "NO_SIGN_ON",
    "reason" : {
      "code" : "VEHICLE_EQUIPMENT_UNAVAILABLE",
      "comment" : "Vehicle does not have required technical equipment installed"
    },
    "impact" : {
      "journeys" : [ {
        "journey" : {
          "spec" : {
            "lineId" : "RUT:Line:001",
            "journeyId" : "RUT:DatedServiceJourney:0002",
            "firstDepartureDateTime" : "2025-03-03T09:45+01:00"
          },
          "serviceWindow" : {
            "start" : "2025-03-03T09:45+01:00",
            "end" : "2025-03-03T10:05+01:00"
          }
        }
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:45+01:00",
      "end" : "2025-03-03T10:05+01:00"
    },
    "parameters" : {
      "vehicleId" : "VEHICLEID01234567"
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SIGN_ON",
      "reason" : {
        "code" : "VEHICLE_EQUIPMENT_UNAVAILABLE",
        "comment" : "Vehicle does not have required technical equipment installed"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0002",
              "firstDepartureDateTime" : "2025-03-03T09:45+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:45+01:00",
              "end" : "2025-03-03T10:05+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:45+01:00",
        "end" : "2025-03-03T10:05+01:00"
      },
      "parameters" : {
        "vehicleId" : "VEHICLEID01234567"
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "16e70a9992d04ac8b4a0d598b5560606",
      "name" : "SD-2026-1"
    }
  }
}
```
### Service Deviation: BYPASS

#### Bypass - on Journey Calls

To notify the transport authority that certain calls in one or more journeys will not be bypassed by the operator, a service deviation
request should be sent with:
- code `BYPASS`
- a list of affected calls per journey
- a suitable [reason code](#service-deviation-reason-codes)

In this example, we send a _bypass_ deviation request with a single call, indicating the call will be bypassed due
to a lack of passengers.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations
{
  "spec" : {
    "code" : "BYPASS",
    "reason" : {
      "code" : "NO_PASSENGERS",
      "comment" : "Bypassing stop point due to lack of passengers"
    },
    "impact" : {
      "journeys" : [ {
        "calls" : [ {
          "stopPoint" : {
            "quayId" : "NSR:Quay:002A",
            "stopPointId" : "stop-point-002A"
          },
          "arrivalDateTime" : "2025-03-03T09:10+01:00",
          "departureDateTime" : "2025-03-03T09:10+01:00"
        } ],
        "journey" : {
          "spec" : {
            "lineId" : "RUT:Line:001",
            "journeyId" : "RUT:DatedServiceJourney:0001",
            "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
          }
        }
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "parameters" : {
      "operatorExempt" : true
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "deviation" : {
    "spec" : {
      "code" : "BYPASS",
      "reason" : {
        "code" : "NO_PASSENGERS",
        "comment" : "Bypassing stop point due to lack of passengers"
      },
      "impact" : {
        "journeys" : [ {
          "calls" : [ {
            "stopPoint" : {
              "quayId" : "NSR:Quay:002A",
              "stopPointId" : "stop-point-002A"
            },
            "arrivalDateTime" : "2025-03-03T09:10+01:00",
            "departureDateTime" : "2025-03-03T09:10+01:00"
          } ],
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:17+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:17+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "69c6x21a838245cb568cb0a5d1548fd2",
      "name" : "SD-2026-1"
    }
  }
}
```
### Service Deviation Reason Codes

#### Read Service Deviation Reason Codes

In order to ensure only valid reason codes are used when creating or updating service deviations via the API, clients should download
the currently configured list of reason codes from the `{baseURL}/deviation/reason-codes` endpoint.

> The returned list of reason codes may be cached by the client as indicated by the returned `Cache-Control` header,
> typically up to 12 hours.

In this example, we request a sample set of reason codes for illustration purposes only. The actual codes and categories returned will
vary depending on the system configuration of a specific operator for a given transport authority.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/reason-codes
```

HTTP response:

```bash
200 OK
{
  "groups" : [ {
    "code" : "TRAFFIC",
    "title" : "Traffic",
    "description" : "Reasons related to traffic and accessibility"
  }, {
    "code" : "VEHICLE",
    "title" : "Vehicle",
    "description" : "Reasons related to vehicle and vehicle equipment"
  }, {
    "code" : "WEATHER",
    "title" : "Weather",
    "description" : "Reasons related to weather conditions"
  } ],
  "reasons" : [ {
    "code" : "TRAFFIC_CONGESTION",
    "title" : "Traffic congestion",
    "description" : "Traffic congestion delaying or preventing regular service delivery",
    "groupCode" : "TRAFFIC",
    "validDeviationCodes" : [ "NO_SERVICE", "NO_SIGN_ON" ]
  }, {
    "code" : "VEHICLE_EQUIPMENT_UNAVAILABLE",
    "title" : "Vehicle equipment unavailable",
    "description" : "Vehicle does not have required equipment installed or equipment is unavailable for other reasons",
    "groupCode" : "VEHICLE",
    "validDeviationCodes" : [ "NO_SERVICE", "NO_SIGN_ON" ]
  }, {
    "code" : "WEATHER_SNOW_HEAVY",
    "title" : "Heavy snow",
    "description" : "Heavy snow conditions limiting or preventing road access or regular vechile operation",
    "groupCode" : "WEATHER",
    "validDeviationCodes" : [ "NO_SERVICE", "NO_SIGN_ON" ]
  } ]
}
```
### Service Deviation Search

Service deviations can be searched by sending a `GET` request to the `{baseURL}/deviation/deviations` endpoint.

**Search Parameters**

- `query`: Exact-match identifier lookup. Supported identifiers include:
  - _Dated service journey ID_ — finds all deviations affecting a specific journey (e.g. `RUT:DatedServiceJourney:0001`).
  - _PTO case reference_ — finds deviations tagged with a given PTO case ref via the `PTO_CASE_REF` metadata key.
  - _PTA case reference_ — finds deviations tagged with a given PTA case ref via the `PTA_CASE_REF` metadata key.
- `fromDateTime` and `toDateTime`: Filter deviations by when they were last modified (created or updated). Useful for
  sync clients that need to detect all changes within a time window. If not provided, no modification-time filter is
  applied.
- `effectiveFrom` and `effectiveTo`: Filter deviations by their effective service window — i.e. when the deviation is
  operationally active. Returns deviations that have already started by `effectiveTo` and are still active at or after
  `effectiveFrom` — i.e. deviations whose effective period overlaps the given range. If not provided, no
  effective-period filter is applied. See [Effective Service Window](intro.md#effective-service-window) for how the
  effective service window is derived.
- `clientMetadataKey` and `clientMetadataValue`: Filter deviations by client metadata. When `clientMetadataKey` is
  provided, only deviations with a matching, searchable entry for that key are returned. `clientMetadataValue` is
  optional and further narrows the match to a specific value.
- `limit` and `offset`: Pagination parameters. Default limit is 20, maximum is 200.

#### Find Service Deviations - by Journey Id

To find all service deviations affecting a specific journey, the dated service journey ID can be provided as the `query` parameter.

Note: journey ID indexing happens asynchronously after the deviation is created, so newly created deviations may not be
immediately available via this search.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/deviations?query=RUT:DatedServiceJourney:0001
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    }
  } ],
  "page" : {
    "limit" : 20,
    "offset" : 0,
    "itemCount" : 1,
    "totalItemCount" : 1
  }
}
```

#### Find Service Deviations - by Date Range

To find service deviations within a specific time range, `fromDateTime` and `toDateTime` query parameters can be provided.

In this example, we search for all deviations created on a specific day.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/deviations?
>>> fromDateTime=2025-03-03T00:00+01:00&
>>> toDateTime=2025-03-04T00:00+01:00
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    }
  } ],
  "page" : {
    "limit" : 20,
    "offset" : 0,
    "itemCount" : 1,
    "totalItemCount" : 1
  }
}
```

#### Find Service Deviations - by Client Metadata

To find service deviations associated with a specific client metadata entry, the `clientMetadataKey` and `clientMetadataValue`
query parameters can be combined.

In this example, we search for all deviations tagged with a client-defined tracking reference.

Note: client metadata is stored separately from the deviation and is not included in the deviation response body.
Use the `{baseURL}/deviation/deviations/{serviceDeviationId}/client-metadata` endpoint to read client metadata for a deviation.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/deviations?
>>> clientMetadataKey=TRACKING_REF&
>>> clientMetadataValue=TRK-2025-001
```

HTTP response:

```bash
200 OK
{
  "items" : [ {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    }
  } ],
  "page" : {
    "limit" : 20,
    "offset" : 0,
    "itemCount" : 1,
    "totalItemCount" : 1
  }
}
```
### Additional Service Deviation Operations

In addition to creating service deviations, a client may also look up, update, and delete existing deviations using the
`{baseURL}/deviation/deviations/{serviceDeviationId}` endpoint.

#### Resolved Journey Targets

When reading a service deviation, the optional `includeTargets=true` query parameter can be used to include the
_resolved journey targets_ in the response. Resolved journey targets are the concrete dated journeys that have been
resolved from the deviation's impact spec, as determined at the time of the last background processing run.

This is useful for inspecting exactly which journeys are affected without having to resolve the impact spec manually.

#### Read Service Deviation by Id

A service deviation may be retrieved up by sending a `GET` request to `{baseURL}/deviation/deviations/{serviceDeviationId}`.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/deviations/1530bf5405624db1b6b449d0edbec8c0
```

HTTP response:

```bash
200 OK
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    }
  }
}
```

#### Read Service Deviation with Resolved Journey Targets

Passing `includeTargets=true` when reading a service deviation will include resolved journey targets in the response.
Resolved journey targets represent the concrete dated journeys affected by the variance, as resolved from the impact spec
at the time of the last background processing run.

HTTP request:

```bash
GET /api/adt/v4/operational/deviation/deviations/1530bf5405624db1b6b449d0edbec8c0?includeTargets=true
```

HTTP response:

```bash
200 OK
{
  "deviation" : {
    "spec" : {
      "code" : "NO_SERVICE",
      "reason" : {
        "code" : "WEATHER_SNOW_HEAVY"
      },
      "impact" : {
        "journeys" : [ {
          "journey" : {
            "spec" : {
              "lineId" : "RUT:Line:001",
              "journeyId" : "RUT:DatedServiceJourney:0001",
              "firstDepartureDateTime" : "2025-03-03T09:00+01:00"
            },
            "serviceWindow" : {
              "start" : "2025-03-03T09:00+01:00",
              "end" : "2025-03-03T09:20+01:00"
            }
          }
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "parameters" : {
        "operatorExempt" : true
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0",
      "name" : "SD-2026-1"
    },
    "journeyTargets" : {
      "journeys" : [ {
        "partial" : false,
        "journey" : {
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
        }
      } ]
    }
  }
}
```

#### Delete Service Deviation by Id

A service deviation may be deleted by posting an update request with `action: "DELETE"` to
`{baseURL}/deviation/deviations/{serviceDeviationId}`.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations/1530bf5405624db1b6b449d0edbec8c0
{
  "action" : "DELETE",
  "comment" : "All the snow melted, we are able to drive after all!"
}
```

HTTP response:

```bash
200 OK
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  }
}
```

#### Update Service Deviation by Id

Instead of deleting and re-creating a service deviation to functionally modify it, a client may post an update request
with `action: "UPDATE"` to
`{baseURL}/deviation/deviations/{serviceDeviationId}` to modify an existing deviation.

In this example, we show how to update an existing delay deviation with a new delay value and an additional comment about why the
delay was updated.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations/840660be96fd48c7967f90cc28ac4b34
{
  "spec" : {
    "code" : "DELAY",
    "reason" : {
      "code" : "TRAFFIC_CONGESTION",
      "comment" : "Even more traffic, more congestion and more delay."
    },
    "impact" : {
      "journeys" : [ {
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
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T07:30+01:00",
      "end" : "2025-03-03T19:30+01:00"
    },
    "parameters" : {
      "delayMinutes" : 25
    }
  },
  "action" : "UPDATE"
}
```

HTTP response:

```bash
200 OK
{
  "deviation" : {
    "spec" : {
      "code" : "DELAY",
      "reason" : {
        "code" : "TRAFFIC_CONGESTION",
        "comment" : "Even more traffic, more congestion and more delay."
      },
      "impact" : {
        "journeys" : [ {
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
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T07:30+01:00",
        "end" : "2025-03-03T19:30+01:00"
      },
      "parameters" : {
        "delayMinutes" : 25
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:00+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:15+01:00",
        "modifiedBy" : "system"
      },
      "serviceDeviationId" : "840660be96fd48c7967f90cc28ac4b34",
      "name" : "SD-2026-1"
    }
  }
}
```
