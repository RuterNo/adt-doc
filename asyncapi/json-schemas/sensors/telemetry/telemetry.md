### Telemetry Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/telemetry/{telemetryId}                             |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

For telemetry not listed in the Available ADT Telemetry section below, refer to the FMS (Fleet Management System)
standard documentation. However, before using the FMS standard directly:

- Check if the data point already exists in the MQTT API or ADT telemetry listed below.
- If not listed, contact Ruter to discuss potential implementation before defaulting to the FMS standard.

Several different kinds of sensor/telemetry data are available varying by vehicle type For traditional busses, FMS is
the standard that defines what data about the vehicle is published on the FMS bus and further on by ITxPT
FMStoIP [service.In](http://service.In "http://service.In") addition, vessels, trams and different bus types have
proprietary data not captured by FMS.

According to the data centric approach from ITxPT, several of these data types (door, location, stop button etc) have
been assigned separate topics as being described in this document. However, data types required by Ruter that haven’t
yet been described in the MQTT structure from ITxPT, will still be handled by the general Telemetry topic that was
introduced by Ruter in 2019.

All such data are defined by unique, 32 bit, identifiers. Data caught from the FMS bus retain their PGN numbers as the
last 16 bits of the ID. Data not coming from the FMS bus follow a separate addressing scheme, with addresses allocated
by Ruter on request. Please note that PTOs are free to decide if they want to use FMS or a non-FMS data source to
provide the data.

To utilize FMS data in Ruter’s architecture, Operators can either set up an FMS2IP service or use any other means to
subscribe to the FMS bus data. Note that there must be one separate MQTT message per FMS PGN.

The identifiers are constructed this way:

|  Bytes  |  Description                               |
|:-------:|:-------------------------------------------|
|  **1**  | Source identifier (0x00 FMS, 0x01 Non-FMS) | 
| **2-4** | Source-specific id, e.g. FMS PGNs          |          

## Available Non-FMS standard data identifiers

See topics with specific id for more information.

| Telemetry ID | Telemetry Type                                                                                                                    | 
|:------------:|-----------------------------------------------------------------------------------------------------------------------------------|
|   0001FF25   | [Charger (deprecated)](json-schemas/sensors/telemetry/charger/charger.md)                                                         |
|   01000002   | [Temperature indoor](json-schemas/sensors/telemetry/temperature-indoor/temperature-indoor.md)                                     |
|   01000005   | [State of charge](json-schemas/sensors/telemetry/state-of-charge/state-of-charge.md)                                              |
|   01000006   | [Transmission mode](json-schemas/sensors/telemetry/transmission-mode/transmission-mode.md)                                        |
|   01000007   | [Windscreen wiper active](json-schemas/sensors/telemetry/windscreeen-wiper-active/windscreeen-wiper-active.md)                    |
|   01000008   | [Accelerometry](json-schemas/sensors/telemetry/accelerometry/accelerometry.md)                                                    |
|   01000009   | [Temperature outdoor](json-schemas/sensors/telemetry/temperature-outdoor/temperature-outdoor.md)                                  |
|   0100000A   | [Accumulated energy consumption](json-schemas/sensors/telemetry/accumulated-energy-consumption/accumulated-energy-consumption.md) |
