# Operational API

[OpenAPI Specification Documentation](openapi/operational/index.html){target=_blank .md-button }

## Introduction

The ADT Operational API consists of these functional areas:

1. [Journey API endpoints](#journey-api), for looking up up-to-date lines, stop points and journeys.
2. [Assignment API endpoints](#assignment-api), for signing vehicles on and off journeys as they are being operated.
3. [Service Deviation API endpoints](#deviation-api), for notifying about deviations from planned operations delivery.
4. [Service Mitigation API endpoints](#mitigation-api), for mitigating deviations.
**NOTE: This is for internal use and not available to PTOs.**

### Data Model

```mermaid
flowchart TB
    vehicle(("PTO<br>Vehicle"))
    operator(("PTO<br>Back Office"))
    controller(("PTA<br>Traffic<br>Controller"))

    subgraph assignment-api ["Assignment API"]
        vehicle-state("Vehicle State")
        attempt-request("<em>Attempt Request</em>")
    end
    subgraph journey-model ["Journey API"]
        line("Line")
        journey("Journey")
        journey-call("Journey Call")
        journey-state("Journey State")
        stop-point("Stop Point")
    end
    subgraph mitigation-model ["Mitigation API"]
        mitigation("Service Mitigation")
    end
    subgraph deviation-model ["Deviation API"]
        deviation-request("<em>Service Deviation Request</em>")
        deviation("Service Deviation")
        impact("impact")

        deviation-request -->|creates| deviation
    end

    vehicle .->|has| vehicle-state
    vehicle -->|sends| attempt-request
    vehicle-state -->|contains|journey

    journey -->|services| line
    journey -->|contains| journey-call
    journey -->|contains| journey-state
    journey-call -->|visits| stop-point
    journey-state .->|refers to| deviation
    journey-state .->|refers to| mitigation

    deviation -->|has| impact
    impact .->|refers to| line
    impact .->|refers to| stop-point
    impact .->|refers to| journey-state

    mitigation .->|mitigates| deviation
    operator -->|sends| deviation-request

    deviation -->|is processed by| controller
    controller .->|creates| mitigation

    attempt-request -->|refers to| journey
    attempt-request .->|refers to| journey-call
```

_Simplified data model with relationships and data flow for operational APIs._

#### Journey Identifiers

When looking up journeys via the [Journey API](#journey-api), a set of three identifiers are returned for each journey:

1. `vehicleJourneyId`: Vehicle journey id assigned by PTA traffic planner. Reused across multiple operating dates.
2. `serviceJourneyId`: Service journey id assigned by PTA back-end system. Reused across multiple operating dates.
3. `datedServiceJourneyId`: Dated service journey id assigned by PTA back-end system. Unique for a specific service journey on a
    specific date.

Of these, 1.) and 2.) may be reused across multiple operating days and are therefore not unique for a specific date.

#### Journey Specification Options

```mermaid
flowchart LR
    subgraph _spec ["<em>Specification Structures</em>"]
        journey-spec("Journey Spec")
        journey-spec-options("Journey Spec Options")
        journey-line-spec("Journey Line Spec")
        journey-stop-point-spec("Journey Stop Point Spec")
        journey-call-spec("Journey Call Spec")
    end
    subgraph _data ["Data Structures"]
        journey("Journey")
        journey-line("Journey Line")
        journey-call("Journey Call")
        journey-stop-point("Stop Point")
    end

    journey-spec-options .->|contains| journey-call-spec
    journey-spec-options .->|contains| journey-spec

    journey-spec -->|describes| journey
    journey-call-spec -->|describes| journey-call
    journey-line-spec -->|describes| journey-line
    journey-stop-point-spec -->|describes| journey-stop-point

    journey .->|contains| journey-call
    journey .->|services| journey-line
    journey-call .->|visits| journey-stop-point
    journey-call-spec .->|contains| journey-stop-point-spec
```

_Simplified data model with relationships between specification structures and the objects they describe._

Since not all journey identifiers are unique across operating days, when signing on a vehicle via the
[Assignment API](#assignment-api) or registering a service deviation for a journey via the
[Service Deviation API](#deviation-api), some additional details may be required to uniquely identify a journey
on a specific date.

This structure is modeled as _journey specification options_, each describing a specific (planned) journey, a subset of
calls in a (planned) journey or an unplanned _"ad-hoc"_ journey with two properties:

1. `calls`, a list of [journey call specifications](#journey-call-specifications) identifying specific calls in a
   journey or an ad-hoc journey.
2. `journey`, a  [journey specifications](#journey-specifications) identifying a specific (planned) journey.

##### Journey Specifications

Certain API requests allow the client to provide a list of journeys when signing on a vehicle or
registering a service deviation. In such requests, the _journey specification_ structure describes a specific (planned)
journey on a specific date:

1. `lineId`, a line identifier, such as `RUT:Line:xxx`.
2. `journeyId`, one of `vehicleJourneyId`, `serviceJourneyId` or `datedServiceJourneyId`.
3. `serviceWindow`, a date-time range with a `start` and `end` timestamp, describing the complete or partial service
   window of the journey.

###### Mapping NeTEx Data to Journey Specifications

Example _PublicationDelivery_ section from NeTEx data file format:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PublicationDelivery>
  <dataObjects>
    <CompositeFrame>
      <frames>
        <ServiceFrame>
          <routes>
            <Route id="RUT:Route:007">
              <LineRef ref="RUT:Line:1337"/>
            </Route>
          </routes>
          <lines>
            <Line id="RUT:Line:1337">
            </Line>
          </lines>
          <journeyPatterns>
            <JourneyPattern id="RUT:JourneyPattern:123456">
              <RouteRef ref="RUT:Route:007"/>
            </JourneyPattern>
          </journeyPatterns>
        </ServiceFrame>
        <TimetableFrame>
          <vehicleJourneys>
            <ServiceJourney id="RUT:ServiceJourney:1">
              <JourneyPatternRef ref="RUT:JourneyPattern:123456"/>
              <PrivateCode>505</PrivateCode>
              <passingTimes>
                <TimetabledPassingTime>
                  <StopPointInJourneyPatternRef/>
                  <DepartureTime>03:28:00</DepartureTime>
                </TimetabledPassingTime>
                <TimetabledPassingTime>
                  <StopPointInJourneyPatternRef/>
                  <DepartureTime>03:31:00</DepartureTime>
                </TimetabledPassingTime>
                <TimetabledPassingTime>
                  <StopPointInJourneyPatternRef/>
                  <ArrivalTime>03:33:00</ArrivalTime>
                </TimetabledPassingTime>
              </passingTimes>
            </ServiceJourney>
            <DatedServiceJourney id="RUT:DatedServiceJourney:a">
              <ServiceJourneyRef ref="RUT:ServiceJourney:1"/>
              <OperatingDayRef ref="RUT:OperatingDay:2024-01-01"/>
            </DatedServiceJourney>
          </vehicleJourneys>
        </TimetableFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>
```

Resolved values from above example for use in journey specification:
-  **lineId**: `RUT:Line:1337` value from
    ```
    PublicationDelivery/dataObjects/CompositeFrame/frames/ServiceFrame/lines/Line/@id
    ```
- **journeyId**: either of
    1. _vehicle journey id_ value `505` from
        ```
        PublicationDelivery/dataObjects/CompositeFrame/frames/TimetableFrame/vehicleJourneys/ServiceJourney/PrivateCode
        ```
    2. _service journey Id_ value `RUT:ServiceJourney:1` from
        ```
        PublicationDelivery/dataObjects/CompositeFrame/frames/TimetableFrame/vehicleJourneys/ServiceJourney/@Id
        ```
    3. _dated service journey id_ value `RUT:DatedServiceJourney:a` from
        ```
        PublicationDelivery/dataObjects/CompositeFrame/frames/TimetableFrame/vehicleJourneys/DatedServiceJourney/@id
        ```

- **serviceWindow.start**: value `2024-01-01T03:28:00+01:00`, constructed by combining
  - date of service
  - departure time of earliest passing from
    ```
    PublicationDelivery/dataObjects/CompositeFrame/frames/TimetableFrame/vehicleJourneys/ServiceJourney/passingTimes/TimetabledPassingTime/DepartureTime
    ```
  - current time-zone offset (CET).

- **serviceWindow.end**: value `2024-01-01T03:33:00+01:00`, constructed by combining
  - date of service
  - arrival time of latest passing time from
    ```
    PublicationDelivery/dataObjects/CompositeFrame/frames/TimetableFrame/vehicleJourneys/ServiceJourney/passingTimes/TimetabledPassingTime/ArrivalTime
    ```
  - current time-zone offset (CET).

##### Journey Call Specifications

Certain API requests allow the client to provide a list of calls for a journey when signing on a vehicle or
registering a service deviation. In such requests, a call must be uniquely specified within a journey, since a journey
contains multiple calls and may also contain multiple calls at the same stop point (at different times).

This structure is modeled as a _journey call specification_, consisting of three properties:

1. `stopPoint`, a [stop point specification](#journey-stop-point-specifications), indicating where this call occurs.
2. `arrivalDateTime`, a timestamp indicating the (planned) arrival time for the call.
3. `departureDatetime`, a timestamp indicating the (planned) departure time for the call.

`stopPoint` is always required to specify a call, but some calls may only have `arrivalDateTime` or `departureDateTime`
specified, which is typically the case for the first (departure only) and last (arrival only) call of a journey.


#### Journey Line Specifications

Certain API requests allow the client to provide a list of journey lines. In such requests, a line must be uniquely
identified using a _journey line specification_ consisting of two properties:

1. `lineId`, a line identifier, as returned by the [Journey API journey lines](#journey-lines) endpoint.
2. `direction`, a line direction:
   - `ANY`, indicating any line direction.
   - `INBOUND`, indicating an inbound line.
   - `OUTBOUND`, indicating an outbound line.

#### Journey Stop Point Specifications

Since not all stop points in the operational journey database are required to have corresponding [NSR](https://developer.entur.org/pages-nsr-nsr) quay ids,
for example, if they represent stop points which are not official NSR quays, each stop point also has an associated
_API stop point id_, returned when looking up stop points via the
[Journey API stop points endpoint](#journey-stop-points).

When supplying stop point references in API requests, either (or both) of _NSR quay id_ or _stop point id_ may be
provided in the request.

This structure is modeled as a _stop point specification_ in the API, consisting of two
properties:

1. `nsrQuayId`, an NSR quay identifier, such as `NSR:Quay:xxx`.
2. `stopPointId`, a stop point id provided by the API.

Either, or both, of these properties may be provided to specify a stop point in an API request, but if both are
provided they must both reference the same stop point.

### Authentication

This document outlines the procedures for getting and using authentication tokens from the Operational Auth Service for accessing other services.

| Endpoint             | URL                                                             | Description                                                                             |
|----------------------|-----------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Token                | `/api/adt/v4/operational/auth/oauth2/token`                     | Endpoint for exchanging credentials in tokens (especially access token)                 |
| JWKS                 | `/api/adt/v4/operational/auth/.well-known/jwks`                 | (Optional) Endpoint for fetching a public key to verify the retrieved access token      |
| OpenID Configuration | `/api/adt/v4/operational/auth/.well-known/openid-configuration` | (Optional) Endpoint for discovering all [OpenId Connect](https://openid.net/) endpoints |

Usage of the Operational API is restricted to Authenticated and Authorized Users only.

Ensure that the credentials used match those used for MQTT access in the respective environments.

Authentication supports an OpenId Connect authentication flow.

#### Access Tokens - Retrieve

A successful authentication yields a JSON response containing:
- `access_token`: JWT for authentication
- `token_type`: Typically "Bearer"
- `expires_in`: Token validity period in seconds
- `scope`: Granted scopes
- `id_token`: OpenID Connect ID token (if "openid" scope was requested)

HTTP request:

```bash
POST /api/adt/v4/operational/auth/oauth2/token
Authorization: Basic [base64-encoded-VALID-credentials]
Content-Type: application/x-www-form-urlencoded
grant_type=client_credentials&scope=openid
```

HTTP response:

```bash
200 OK
{
  "access_token" : "...",
  "token_type" : "Bearer",
  "expires_in" : 86400,
  "scope" : "openid",
  "id_token" : "..."
}
```

#### Access Tokens - Use

Any request should carry a Bearer Token in the `Authorization` header of HTTP requests.

The value of the Bearer token is found in the field `access_token` from the above HTTP response.

HTTP request:

```bash
GET /api/adt/v4/operational/journey/journeys?query=1001
Authorization: Bearer ...
```

HTTP response:

```bash
200 OK
""
```
Common HTTP status codes when using the token:
  - **401 Unauthorized**: Indicates an invalid, expired, or not permissioned enough token.
  - **403 Forbidden**: Signifies a valid token lacking permission for the requested resource.

In case of these errors, get a new token or verify the granted scopes.

### Common Headers

All API requests may contain one or more optional headers for tracing and request identification purposes:

| Header                                     | Description                                                                                           |
|:-------------------------------------------|:------------------------------------------------------------------------------------------------------|
| [`X-Trace-Id`](#x-trace-id-header)         | May be used to identify multiple requests as part of the same "operation" or "process".               |
| [`X-Client-Id`](#x-client-id-header)       | Optional client id indicating the logical name of the client making the API request.                  |
| [`X-Request-Id`](#x-request-id-header)     | May be used to identify a single request. Should be unique for each separate request made to the API. |
| [`X-Operator-Id`](#x-operator-id-header)   | Must be provided by clients with access to more than one PTO.                                         |
| [`X-Authority-Id`](#x-authority-id-header) | Must be provided by clients with access to more than one PTA.                                         |

#### `X-Trace-Id` Header

Optional trace id for request. May be used to trace multiple requests as part of the same "operation" or
"process". If set, should be different from [_request id header_](#x-request-id-header).

#### `X-Client-Id` Header

Optional client id for request. May be used to identify client system by name or other identifier. Note that
this is only treated as additional process metadata and not connected to authorization in any way.

#### `X-Request-Id` Header

Optional unique identifier of request. Should be unique for every request made by the client, even if the request is a
retry of a previous request with same [_trace id_](#x-trace-id-header).

#### `X-Operator-Id` Header

Optional operator id for request. Required by clients with access to more than one PTO.

Operator id on the form:

`<codespace>:Operator:<operator-number>`

> See
> [Entur list of NeTEx / SIRI codespaces](https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/637370434/List+of+current+Codespaces)
> list of valid codespace prefixes.

#### `X-Authority-Id` Header

Optional authority id for request. Required by clients with access to more than one PTA.

Authority id on the form:

`<authority-id>`

## Journey API

The journey API endpoints, available under `{baseURL}/journey/*`, give clients access to
look up
[planned service journeys](#journeys),
[service lines](#journey-lines) and
[stop points](#journey-stop-points)
in the operational journey database.

### Journeys

The `{baseURL}/journey/journeys` endpoint can be used for looking up journeys in the operational
journey database.

For clients who do not have their own copy of planned journeys ([See Traffic Plan API](https://adt.transhub.io/latest/traffic-plan/)), such lookups are required in order to use the [Assignment API](#assignment-api) to sign on vehicles on
journeys or use the [Deviation API](#deviation-api) to register service deviations.

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
## Assignment API

The vehicle assignment lifecycle in public transportation consists of four main stages:

1. **Vehicle State Check (optional)**: Determine the current status of the vehicle.
2. **Journey API (optional)**: Look up and retrieve accurate journey information.
3. **Sign-On**: Initialize and synchronize the vehicle for its operational duties, using journey information from the Journey API if available.
4. **Sign-Off**: End the vehicle's operational duties or remove it from service.

These stages form a continuous cycle that ensures efficient management of vehicle operations.

Before the Sign-On process, operators can use the [Journey API](#journey-api) to look up and retrieve journey information.

This step is optional but can be beneficial for ensuring accurate and up-to-date journey details. The Journey API provides:

- Detailed journey specifications
- Service windows
- Stop point information

The results obtained from the Journey API can be used directly in the Sign-On API request.

This integration ensures that the most current and accurate journey information is used when signing on a vehicle, reducing discrepancies and improving operational efficiency.


### Assignment - Vehicle State
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
### Assignment - Sign-On
- Purpose: To initialize and synchronize a vehicle for its operational duties.
- Triggers:
    - Start of an operational day
    - After system restart or reboot
    - Reconnection after lost connectivity
- Process:
    1. Perform a [Vehicle State Check](#assignment---vehicle-state).
    2. If changes to the current state are needed, perform a [Sign-Off](#assignment---sign-off) first.
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
    ...
    "vehicle": {
        "segmentCount": 2  // Optional segment count, indicating a metro train consisting of two carriage sets.
    }
}
```

#### Sign-On - Single Journey

To sign a vehicle on a single journey, an attempt request with a single
[journey specification](#journey-specifications) can be used.

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
[call specifications](#journey-call-specifications)
with two elements in each list, where the first call denotes the starting point of the ad-hoc journey and the second call denotes
the ending point.

In this example, we also used different
[journey identifiers](#journey-identifiers)
to sign on to each of the three planned journeys, illustrating how the different identifiers may be used in a
[journey specification](#journey-specifications).

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
### Assignment - Sign-Off
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
This revised version now includes information about the Journey API integration and how its results can be used directly
in the Sign-On API, providing a more comprehensive overview of the Assignment API lifecycle.

## Deviation API

The service deviation API endpoints under `{baseURL}/deviation/*` allow vehicle operators to notify transport
authorities about upcoming service deviations when planned journeys can not be serviced as initially expected.

The following types of service deviations are supported by the API:

- [`DELAY`](#service-deviation---delay), indicating a delayed start of a planned service journey.
- [`NO_SERVICE`](#service-deviation---no_service), indicating inability to service a planned service journey.
- [`NO_SIGN_ON`](#service-deviation---no_sign_on), indicating a service journey will be serviced, but without
  signing on the vehicle.
- [`BYPASS`](#service-deviation---bypass), indicating that certain calls in a journey will be bypassed by the
  operator.

### Service Deviation Requests

To notify a transport authority about an upcoming deviation in a service delivery, the operator should
post a service deviation request to the `{baseURL}/deviation/deviations` endpoint.

#### Service Deviation Specifications

Each service deviation request contains a _service deviation specification_ describing the service deviation with the
following properties:

1. `code`, a service deviation code describing the type of deviation:
   * `DELAY`, indicating a delayed journey start.
   * `NO_SERVICE`, indicating a line, stop point or journey will not be serviced by the operator.
   * `NO_SIGN_ON`, indicating a journey will be serviced by the operator, but the servicing vehicle will not be
      signing on.
   * `BYPASS`, indicating that certain calls in a journey will be bypassed by the operator.
2. `reason`, a structure containing the [reason code](#service-deviation-reason-codes) for the deviation and an
   optional `comment` describing further details about the reason.
   The comment is for internal use by PTO and PTA and is not used for travel information.
3. `impact`, a [service deviation impact](#service-deviation-impact) structure, describing the lines, journeys, stop
   points and service windows impacted by the deviation.
4. `duration`, a date-time range with a `start` and `end`, describing the duration of the deviation.
5. `metadata`, a [list of key/value pairs](#service-deviation-metadata) for associating client-specific metadata with
   the deviation, such as connecting service deviations to internal / external systems.
6. `parameters`, a [service deviation parameters](#service-deviation-parameters) structure, detailing the functional
   parameters of the deviation.

##### Service Deviation Impact

The service deviation impact structure describes one or more lines, journeys or stop points impacted by a service
deviation:

1. `lines`, a list of [line specifications](#journey-line-specifications) describing the impacted lines.
2. `journeys`, a list of [journey specification options](#journey-specification-options) describing the impacted
    journeys and / or journey calls.
3. `stopPoints`, a list of [stop point specifications](#journey-stop-point-specifications) describing the impacted stop
    points.
4. `serviceWindows`, a list of date-time ranges with a `start` and `end` date-time, optionally describing the impacted
   service window.

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
> The metadata is structured as a list, duplicate keys are allowed.

HTTP request:

```bash
POST /api/adt/v4/operational/deviation/deviations/sd-001
{
  "spec" : {
    "metadata" : [ {
      "key" : "PTO_CASE_REF",
      "value" : "PTO-1337"
    }, {
      "key" : "PTO_CASE_REF",
      "value" : "PTO-7331"
    }, {
      "key" : "ARBITRARY",
      "value" : "ArbVal"
    } ]
  },
  "action" : "METADATA"
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

### Service Deviation - DELAY

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
    "lifecycle" : {
      "created" : "2025-03-03T05:10+01:00",
      "modified" : "2025-03-03T05:10+01:00",
      "serviceDeviationId" : "840660be96fd48c7967f90cc28ac4b34"
    }
  }
}
```
### Service Deviation - NO_SERVICE

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0"
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
    "lifecycle" : {
      "created" : "2025-03-03T05:17+01:00",
      "modified" : "2025-03-03T05:17+01:00",
      "serviceDeviationId" : "69c6821a838245cb968cb0a5d1548fd2"
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
    "lifecycle" : {
      "created" : "2025-03-03T05:43+01:00",
      "modified" : "2025-03-03T05:43+01:00",
      "serviceDeviationId" : "7d6ea6e1f1264fe2858668e671786aa9"
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
    "lifecycle" : {
      "created" : "2025-03-03T05:43+01:00",
      "modified" : "2025-03-03T05:43+01:00",
      "serviceDeviationId" : "7d6ea6e1f1264fe2858668e671786aa9"
    }
  }
}
```
### Service Deviation - NO_SIGN_ON

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceDeviationId" : "16e70a9992d04ac8b4a0d598b5560606"
    }
  }
}
```
### Service Deviation - BYPASS

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
    "lifecycle" : {
      "created" : "2025-03-03T05:17+01:00",
      "modified" : "2025-03-03T05:17+01:00",
      "serviceDeviationId" : "69c6x21a838245cb568cb0a5d1548fd2"
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
### Additional Service Deviation Operations

In addition to creating service deviations, a client may also look up and delete

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceDeviationId" : "1530bf5405624db1b6b449d0edbec8c0"
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
    "lifecycle" : {
      "created" : "2025-03-03T05:00+01:00",
      "modified" : "2025-03-03T05:15+01:00",
      "serviceDeviationId" : "840660be96fd48c7967f90cc28ac4b34"
    }
  }
}
```
## Mitigation API

The service mitigation API endpoints under `{baseURL}/mitigation/*` allows for implementing solutions to service disruptions.

Mitigations represent actions taken to address service disruptions or deviations from planned service delivery.

**NOTE: This is for internal use and not available to PTOs.**

The API supports the following types of service mitigations:

- [`CANCELLATION`](#mitigation---cancellation), indicating that a journey will be canceled.
- [`REPLACEMENT_SERVICE`](#mitigation---replacement_service), indicating that a replacement service will be provided.
- [`STANDBY_VEHICLE_PLANNED`](#mitigation---standby_vehicle_planned), indicating that a standby vehicle will be used.
- [`REPLACEMENT_QUAY`](#mitigation---replacement_quay), indicating that a replacement quay will be used for specific journey calls.

### Mitigation Requests

To implement a solution for a service deviation, the operator should post a service mitigation request to the `{baseURL}/mitigation/mitigations` endpoint.

#### Mitigation Specifications

Each service mitigation request contains a _service mitigation specification_ describing the mitigation with the following properties:

1. `code`, a service mitigation code describing the type of mitigation:
   1. `CANCELLATION`, indicating a journey will be canceled.
   2. `REPLACEMENT_SERVICE`, indicating a replacement service will be provided.
   3. `STANDBY_VEHICLE_PLANNED`, indicating a standby vehicle will be used.
   4. `REPLACEMENT_QUAY`, indicating a replacement quay will be used for specific journey calls.
2. `impact`, a service impact structure, describing the journeys impacted by the mitigation.
3. `duration`, a date-time range with a `start` and `end`, describing the duration of the mitigation.
4. `mitigates`, a list of service deviation IDs that this mitigation addresses.
5. `metadata`, a [list of key/value pairs](#service-mitigation-metadata) for associating client-specific metadata with the mitigation, such as connecting service mitigations to internal / external systems.
6. `parameters`, a [service mitigation parameters](#service-mitigation-parameters) structure, detailing the functional parameters of the mitigation.

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
> The metadata is structured as a list, duplicate keys are allowed.

HTTP request:

```bash
POST /api/adt/v4/operational/mitigation/mitigations/service-mitigation-id-001
{
  "spec" : {
    "metadata" : [ {
      "key" : "PTO_CASE_REF",
      "value" : "PTO-1337"
    }, {
      "key" : "PTO_CASE_REF",
      "value" : "PTO-7331"
    }, {
      "key" : "ARBITRARY",
      "value" : "ArbVal"
    } ]
  },
  "action" : "METADATA"
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

#### Draft Mode and Approval Process

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

#### Mitigation Response

When a service mitigation is created or approved, the response includes:

1. The mitigation specification as provided in the request.
2. A lifecycle object with creation and modification timestamps.
3. For `REPLACEMENT_SERVICE` mitigations, a `replacements` array containing:
   - `replaced`: The original journeys that are being replaced.
   - `replacements`: The new journeys that will replace the original ones.

### Mitigation - CANCELLATION

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceMitigationId" : "service-mitigation-unique-id"
    }
  }
}
```
### Mitigation - REPLACEMENT_SERVICE

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceMitigationId" : "service-mitigation-id-001"
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
### Mitigation - STANDBY_VEHICLE_PLANNED

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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceMitigationId" : "service-mitigation-unique-id"
    }
  }
}
```
### Mitigation - REPLACEMENT_QUAY

When a journey needs to use a different quay/stop point than originally planned, a replacement quay mitigation can be created. This allows specific journey calls to be redirected to an alternative stop point.

The mitigation requires both `impact.journeys[]` and `impact.journeys[].calls[]` to be specified:
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
    "lifecycle" : {
      "created" : "2025-03-03T05:05+01:00",
      "modified" : "2025-03-03T05:05+01:00",
      "serviceMitigationId" : "service-mitigation-unique-id"
    }
  }
}
```
