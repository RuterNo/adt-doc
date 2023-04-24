### Telemetry data
| Field         | Value                                                                            |
|---------------|----------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/itxpt/ota/telemetry/{telemetryId}/json  |
| Schema        | [ avl.json ](json-schemas/avl.json) |

Vehicle telemetry from systems on the bus.

Several different kinds of telemetry are available varying by vehicle type. For traditional busses, FMS is the standard defines what data about the vehicle is published on the FMS bus and out by FMStoIP. For trams VehicleToIP defines a a different and more limited set of data. In addition, electrical and hydrogen have proprietary data that is not captured by either.

This topic generalizes all such data as telemetry defined by a unique id. We will use FMS PGN ids (4-digit hex values) but otherwise use unique ids to identify data from other sources.

If we define the ids along the lines of FMS we can have 32-bit ids that use the following pattern:

| Bytes | Description                       |
|-------|-----------------------------------|
| 1     | Source identifier                 |
| 2-4   | Source-specific id, e.g. FMS PGNs |

Source identifiers will be:

| Id   | Description |
|------|-------------|
| 0x00 | FMS         |
| 0x01 | non-FMS     |
| ...  | new sources |

Therefore all FMS PGNs become "0000" + 4-digit hex PGN.

> Learn more about the telemetry concept in [this wiki article](https://ruter.atlassian.net/wiki/spaces/TAAS/pages/106004500/Telemetry+concept).

#### FMS
Each of the available data points is defined with a Parameter Group Number (PGN) with fields defined by Suspect Parameter Number (SPN).

The FMS-to-IP service in the ITxPT standard makes the desired data available on the bus's own network over UDP (multicast broadcast). It sends out only the PGNs previously requested by calling a service. The messages are sent every second, according to ITxPT, and includes all the requested PGNs. The format is in XML.

We therefore define which PGNs are needed by Ruter and that the XML message should be broken up per PGN and forwarded as JSON.

#### FMS Parameter Group Number (PGN)
This is the list of required PGNs. It should be possible to expand this over time.

| Code | Description                      | PGN  | SPN                                                                       | Purpose               | ID       | Local topic             |
|------|----------------------------------|------|---------------------------------------------------------------------------|----------------------|----------|-------------------------|
| DC1  | Door Control 1                   | FE4E | 3411 Status 2 of doors <br> 1820 Ramp/Wheel chairlift <br> 1821 Position of doors   | Doors open / closed  | 0000FE4E | telemetry/0000fe4e/json |
| DC2  | Door Control 2                   | FDA5 | XXXX Lock Status Door N <br> XXXX Enable Status Door N <br> XXXX Open Status Door N | Alternative to DC1?  | 0000FDA5 | telemetry/0000fda5/json |
| VDHR | High Resolution Vehicle Distance | FEC1 | 917 High resolution total vehicle distance                                | Supplements position | 0000FEC1 | telemetry/0000fec1/json |

