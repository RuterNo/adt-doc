The service mitigation API endpoints under `{baseURL}/mitigation/*` allow implementing solutions to service disruptions.

Mitigations represent actions taken to address service disruptions or deviations from planned service delivery.

**NOTE: This is for internal use and not available to PTOs.**

The API supports the following types of service mitigations:

- [`CANCELLATION`](#service-mitigation-cancellation), indicating that a journey will be canceled.
- [`REPLACEMENT_SERVICE`](#service-mitigation-replacement_service), indicating that a replacement service will be provided.
- [`STANDBY_VEHICLE_PLANNED`](#service-mitigation-standby_vehicle_planned), indicating that a standby vehicle will be used.
- [`REPLACEMENT_QUAY`](#service-mitigation-replacement_quay), indicating that a replacement quay will be used for specific journey calls.

### Service Mitigation Requests

To implement a solution for a service deviation, the operator should post a service mitigation request to the `{baseURL}/mitigation/mitigations` endpoint.

#### Service Mitigation Specifications

Each service mitigation request contains a _service mitigation specification_ describing the mitigation with the
following properties:

1. `code`, a service mitigation code describing the type of mitigation:
   - `CANCELLATION`, indicating a journey will be canceled.
   - `REPLACEMENT_SERVICE`, indicating a replacement service will be provided.
   - `STANDBY_VEHICLE_PLANNED`, indicating a standby vehicle will be used.
   - `REPLACEMENT_QUAY`, indicating a replacement quay will be used for specific journey calls.
2. `impact`, a [service mitigation impact](#service-mitigation-impact) structure describing the lines, journeys, stop
   points and journey patterns impacted by the mitigation.
3. `duration`, a date-time range with a `start` and `end` describing the active period of the mitigation. Together with
   the optional per-entry `serviceWindow` values on impact entries, it controls which dated journeys are targeted.
   See [Duration and Service Windows](intro.md#duration-and-service-windows) for details.
4. `mitigates`, a list of service deviation IDs that this mitigation addresses.
5. `metadata`, a [list of key/value pairs](#service-mitigation-metadata) for associating client-specific metadata with
   the mitigation, such as connecting service mitigations to internal / external systems.
6. `parameters`, a [service mitigation parameters](#service-mitigation-parameters) structure detailing the functional
   parameters of the mitigation.

##### Service Mitigation Impact

The service mitigation impact structure describes one or more lines, journeys, stop points or journey patterns impacted
by a service mitigation. Each entry type accepts an optional `serviceWindow` that refines which journeys within that
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

##### Service Mitigation Metadata

The service mitigation metadata structure is a list of `key` / `value` pairs describing additional metadata about the service mitigation.

###### Service Mitigation Metadata Keys

The API defines a set of well-known metadata keys that may be used by clients to associate certain metadata with a service mitigation:

| Key                      | Description                     |
|--------------------------|---------------------------------|
| `PTO_CASE_REF`           | A PTO case reference.           |
| `PTA_CASE_REF`           | A PTA case reference.           |
| `SERVICE_DEVIATION_REF`  | A service deviation reference.  |
| `SERVICE_MITIGATION_REF` | A service mitigation reference. |

_Additional metadata keys may be added in the future._

#### Register Metadata - After creation

After a mitigation is created, metadata can be added to it.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations/service-mitigation-id-001/metadata
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
##### Service Mitigation Parameters

The service mitigation parameters structure describes the functional parameters of the service mitigation:

1. `vehicleId`, optional identifier of vehicle planned to take part of the mitigation.
2. `transportMode`, transport mode of the replacement/new journey(s). Currently, only `BUS` is supported.
3. `stopPoint`, stop point specification for the replacement quay (used with `REPLACEMENT_QUAY` mitigation type).

#### Service Mitigation Draft Mode and Approval Process

> Only applicable for `REPLACEMENT_SERVICE`

Service mitigations can be created in draft mode to preview the effects before they are applied:

1. `draft`, a boolean flag indicating whether the mitigation is in draft mode:
   - When `true`, the mitigation is created but not applied, allowing for review.
   - When `false` or not provided, the mitigation is applied immediately.

For `REPLACEMENT_SERVICE` mitigations that are created as drafts, an approval process is available:

1. Create the mitigation with `draft: true` to see what replacement journeys would be created without applying them.
2. Review the proposed replacements in the response.
3. Approve the draft mitigation by sending a request to `{baseURL}/mitigation/mitigations/{serviceMitigationId}` with `action: "APPROVE"`.

Once a mitigation is created with `draft: false`, it is immediately applied and cannot be changed back to draft mode. The approval action is only applicable to mitigations that were initially created as drafts.

#### Service Mitigation Response

When a service mitigation is created or approved, the response includes:

1. The mitigation specification as provided in the request.
2. A lifecycle object with creation and modification timestamps.
3. For `REPLACEMENT_SERVICE` mitigations, a `replacements` array containing:
   - `replaced`: The original journeys that are being replaced.
   - `replacements`: The new journeys that will replace the original ones.

### Service Mitigation: CANCELLATION

To signal that the impacted journey will not be serviced, a cancellation mitigation can be created.

#### Cancellation - on Journey

To signal that the impacted journey will not be serviced
- a list of impacted journeys
- a list of mitigated deviations

In this example, we send a _cancellation_ mitigation request with a single journey.
In addition, filling an optional list of ids for mitigated deviations.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations
{
  "spec" : {
    "code" : "CANCELLATION",
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
    "mitigates" : [ "service-deviation-id-001" ]
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  },
  "mitigation" : {
    "spec" : {
      "code" : "CANCELLATION",
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
      "mitigates" : [ "service-deviation-id-001" ]
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceMitigationId" : "service-mitigation-unique-id",
      "name" : "SM-2026-1"
    }
  }
}
```
### Service Mitigation: REPLACEMENT_SERVICE

When a service deviation occurs, a replacement service can be provided as a mitigation. This involves creating a new journey to replace the affected one.

The replacement service can be created directly or through a two-step approval process:

1. **Direct Creation**: Submit a mitigation with `draft: false` to immediately create and apply the replacement service.
2. **Draft and Approval**:
   - Submit a mitigation with `draft: true` to preview the replacement journeys.
   - Approve the draft by submitting a request to `{baseURL}/mitigation/mitigations/{serviceMitigationId}` with `action: "APPROVE"`.

#### Replacement Service - on Journey

Start the process of replacing service

In this example, we send a _replacement service_ mitigation request for a single journey.
With action CREATE

> Note: `draft` can be used to check what implications a mitigation might have before they are effectuated.

* `draft = true`
  * the results of the mitigation are only returned in the response. The mitigation will then have to be Approved in a separate request
* `draft = [false | null]`
  * the results of the mitigation are effectuated immediately and also returned in the response.

 Journeys in the below HTTP response are minified to reduce vertical space in this documentation.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations
{
  "spec" : {
    "code" : "REPLACEMENT_SERVICE",
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
    "mitigates" : [ "service-deviation-id-001", "service-deviation-id-002" ],
    "parameters" : {
      "vehicleId" : "STANDBYVEHICLE001",
      "transportMode" : "BUS"
    }
  },
  "action" : "CREATE",
  "draft" : false
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
  },
  "mitigation" : {
    "spec" : {
      "code" : "REPLACEMENT_SERVICE",
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
      "mitigates" : [ "service-deviation-id-001", "service-deviation-id-002" ],
      "parameters" : {
        "vehicleId" : "STANDBYVEHICLE001",
        "transportMode" : "BUS"
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceMitigationId" : "service-mitigation-id-001",
      "name" : "SM-2026-1"
    },
    "replacements" : [ {
      "replaced" : [ {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "RUT:DatedServiceJourney:0001"
        },
        "vehicleTaskId" : "VL1001"
      } ],
      "replacements" : [ {
        "spec" : {
          "lineId" : "RUT:Line:001",
          "journeyId" : "RUT:DatedServiceJourney:0003"
        },
        "vehicleTaskId" : "VL1001"
      } ]
    } ]
  }
}
```

#### Replacement Service - Approval

When a `REPLACEMENT_SERVICE` is `CREATED` as a draft it needs to be APPROVED to be effectuated

In this example, we send a _replacement service_
mitigation request with action APPROVE for a given mitigation id.

The following process will be initiated:
  * A replacement journey with transport mode `BUS` will be created
  * The existing journey will be mitigated with `CANCELLATION`
  * The replacement journey will be mitigated with `STANDBY_VEHICLE_PLANNED` for the supplied vehicleId

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations/service-mitigation-id-001
{
  "action" : "APPROVE"
}
```

HTTP response:

```bash
201 CREATED
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  }
}
```
### Service Mitigation: STANDBY_VEHICLE_PLANNED

When a vehicle becomes unavailable, a standby vehicle can be assigned to take over the planned journeys.

#### Standby Vehicle Planned - on Journey

To signal that a journey will be serviced by a stand by vehicle:
- code `STANDBY_VEHICLE_PLANNED`
- a list of impacted journeys
- a list of mitigated deviations
- a VIN for a vehicle to be used as the replacement service

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations
{
  "spec" : {
    "code" : "STANDBY_VEHICLE_PLANNED",
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
    "mitigates" : [ "service-deviation-id-001", "service-deviation-id-002" ],
    "parameters" : {
      "vehicleId" : "STANDBYVEHICLE001"
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  },
  "mitigation" : {
    "spec" : {
      "code" : "STANDBY_VEHICLE_PLANNED",
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
      "mitigates" : [ "service-deviation-id-001", "service-deviation-id-002" ],
      "parameters" : {
        "vehicleId" : "STANDBYVEHICLE001"
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceMitigationId" : "service-mitigation-unique-id",
      "name" : "SM-2026-1"
    }
  }
}
```
### Service Mitigation: REPLACEMENT_QUAY

When a journey needs to use a different quay/stop point than originally planned, a replacement quay mitigation can be created. This allows specific journey calls to be redirected to an alternative stop point.

The mitigation requires both `impact.journeys[]` and `impact.journeys[].calls[]` to be specified:

>NOTE: Because key changes only support one journey and one call at a time, `impact.journeys[]` and `impact.journeys[].calls[]` can only contain one element each.
- `impact.journeys[].journey.spec` identifies the journey containing the affected call(s)
- `impact.journeys[].calls[]` specifies which call(s) within that journey are affected (identified by their original stop point and time). The call must reference an actual call that exists in the specified journey.
- `parameters.stopPoint` specifies the replacement quay to use instead of the original stop point

#### Replacement Quay - on Journey Calls

To signal that specific journey calls should use a replacement quay/stop point:
- code `REPLACEMENT_QUAY`
- a list of impacted journeys with their affected calls (the call must reference an actual call in the specified journey)
- a replacement stop point in the parameters

In this example, we specify a journey and one of its calls that should use a replacement quay.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations
{
  "spec" : {
    "code" : "REPLACEMENT_QUAY",
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
      } ]
    },
    "duration" : {
      "start" : "2025-03-03T09:00+01:00",
      "end" : "2025-03-03T09:20+01:00"
    },
    "mitigates" : [ "service-deviation-id-001" ],
    "parameters" : {
      "stopPoint" : {
        "quayId" : "RUT:Quay:002"
      }
    }
  }
}
```

HTTP response:

```bash
201 CREATED
{
  "result" : {
    "status" : {
      "code" : "OK",
      "reason" : "OK"
    }
  },
  "mitigation" : {
    "spec" : {
      "code" : "REPLACEMENT_QUAY",
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
        } ]
      },
      "duration" : {
        "start" : "2025-03-03T09:00+01:00",
        "end" : "2025-03-03T09:20+01:00"
      },
      "mitigates" : [ "service-deviation-id-001" ],
      "parameters" : {
        "stopPoint" : {
          "quayId" : "RUT:Quay:002"
        }
      }
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceMitigationId" : "service-mitigation-unique-id",
      "name" : "SM-2026-1"
    }
  }
}
```
### Service Mitigation Search

Service mitigations can be searched by sending a `GET` request to the `{baseURL}/mitigation/mitigations` endpoint.

**Search Parameters**

- `query`: Exact-match identifier lookup. Supported identifiers include:
  - _Dated service journey ID_ — finds all mitigations affecting a specific journey (e.g. `RUT:DatedServiceJourney:0001`).
  - _PTO case reference_ — finds mitigations tagged with a given PTO case ref via the `PTO_CASE_REF` metadata key.
  - _PTA case reference_ — finds mitigations tagged with a given PTA case ref via the `PTA_CASE_REF` metadata key.
- `fromDateTime` and `toDateTime`: Filter mitigations by when they were last modified (created or updated). Useful for
  sync clients that need to detect all changes within a time window. If not provided, no
  modification-time filter is applied.
- `effectiveFrom` and `effectiveTo`: Filter mitigations by their effective service window — i.e. when the mitigation is
  operationally active. Returns mitigations that have already started by `effectiveTo` and are still active at or after
  `effectiveFrom` — i.e. mitigations whose effective period overlaps the given range. If not provided, no
  effective-period filter is applied. See [Effective Service Window](intro.md#effective-service-window) for how the
  effective service window is derived.
- `clientMetadataKey` and `clientMetadataValue`: Filter mitigations by client metadata. When `clientMetadataKey` is
  provided, only mitigations with a matching, searchable entry for that key are returned. `clientMetadataValue` is
  optional and further narrows the match to a specific value.
- `limit` and `offset`: Pagination parameters. Default limit is 20, maximum is 200.

### Additional Service Mitigation Operations

In addition to creating service mitigations, a client may also look up, update, and delete existing service mitigations
using the `{baseURL}/mitigation/mitigations/{serviceMitigationId}` endpoint.

#### Resolved Journey Targets

When reading a service mitigation, the optional `includeTargets=true` query parameter can be used to include the
_resolved journey targets_ in the response. Resolved journey targets are the concrete dated journeys that have been
resolved from the mitigation's impact spec, as determined at the time of the last background processing run.

#### Read Service Mitigation with Resolved Journey Targets

Passing `includeTargets=true` when reading a service mitigation will include resolved journey targets in the response.
Resolved journey targets represent the concrete dated journeys affected by the variance, as resolved from the impact spec
at the time of the last background processing run.

HTTP request:

```bash
GET /api/adt/v4/operational/mitigation/mitigations/service-mitigation-unique-id?includeTargets=true
```

HTTP response:

```bash
200 OK
{
  "mitigation" : {
    "spec" : {
      "code" : "CANCELLATION",
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
      "mitigates" : [ "service-deviation-id-001" ]
    },
    "record" : {
      "lifecycle" : {
        "createdAt" : "2025-03-03T05:05+01:00",
        "createdBy" : "system",
        "modifiedAt" : "2025-03-03T05:05+01:00",
        "modifiedBy" : "system"
      },
      "serviceMitigationId" : "service-mitigation-unique-id",
      "name" : "SM-2026-1"
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
#### Read Service Mitigation by Id

A service mitigation may be retrieved up by sending a `GET` request to `{baseURL}/mitigation/mitigations/{serviceMitigationId}`.

HTTP request:

```bash
GET /api/adt/v4/operational/mitigation/mitigations/1530bf5405624db1b6b449d0edbec8c0
```

HTTP response:

```bash
200 OK
POST /api/adt/v4/operational/mitigation/mitigations
{
  "spec" : {
    "code" : "CANCELLATION",
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
    "mitigates" : [ "service-deviation-id-001" ]
  }
}
```

#### Delete Service Mitigation by Id

A service mitigation may be deleted by posting an update request with `action: "DELETE"` to
`{baseURL}/mitigation/mitigations/{serviceMitigationId}`.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations/1530bf5405624db1b6b449d0edbec8c0
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

#### Update Service Mitigation by Id

Instead of deleting and re-creating a service mitigation to functionally modify it, a client may post an update request
with `action: "UPDATE"` to
`{baseURL}/mitigation/mitigations/{serviceMitigationId}` to modify an existing mitigation.

In this example, we show how to update an existing quay replacement mitigation with a new quay.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations/840660be96fd48c7967f90cc28ac4b34
{
    "action": "UPDATE",
    "spec" : {
        "code" : "REPLACEMENT_QUAY",
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
            } ]
        },
        "duration" : {
            "start" : "2025-03-03T09:00+01:00",
            "end" : "2025-03-03T09:20+01:00"
        },
        "mitigates" : [ "service-deviation-id-001" ],
        "parameters" : {
            "stopPoint" : {
                "quayId" : "RUT:Quay:003"
            }
        }
    }
}
```

HTTP response:

```bash
200 OK
{
  "mitigation" : {
    "spec" : {
        "code" : "REPLACEMENT_QUAY",
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
            } ]
        },
        "duration" : {
            "start" : "2025-03-03T09:00+01:00",
            "end" : "2025-03-03T09:20+01:00"
        },
        "mitigates" : [ "service-deviation-id-001" ],
        "parameters" : {
            "stopPoint" : {
                "quayId" : "RUT:Quay:003"
            }
        }
    },
    "lifecycle" : {
      "created" : "2025-03-03T05:00+01:00",
      "modified" : "2025-03-03T05:15+01:00",
      "serviceMitigationId" : "840660be96fd48c7967f90cc28ac4b34"
    }
  }
}
```
