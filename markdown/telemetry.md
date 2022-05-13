### Telemetry data
| Field         | Value                                                       |
|---------------|-------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/sensors/telemetry/{sensorID} |
| Schema        | [ telemetry.json ](json-schemas/telemetry.json)             |

Several different kinds of sensor/telemetry data are available varying by vehicle type For traditional busses, FMS is the standard that defines what data about the vehicle is published on the FMS bus and further on by ITxPT FMStoIP [service.In](http://service.In "http://service.In") addition, vessels, trams and different bus types have proprietary data not captured by FMS.

According to the data centric approach from ITxPT, several of these data types (door, location, stop button etc) have been assigned separate topics as being described in this document. However, data types required by Ruter that haven’t yet been described in the MQTT structure from ITxPT, will still be handled by the general Telemetry topic that was introduced by Ruter in 2019.

All such data are defined by unique, 32 bit, identifiers. Data caught from the FMS bus retain their PGN numbers as the last 16 bits of the ID. Data not coming from the FMS bus follow a separate addressing scheme, with addresses allocated by Ruter on request. Please note that PTOs are free to decide if they want to use FMS or a non-FMS data source to provide the data.

To utilize FMS data in Ruter’s architecture, Operators can either set up an FMS2IP service or use any other means to subscribe to the FMS bus data. Note that there must be one separate MQTT message per FMS PGN.

The identifiers are constructed this way:


|Bytes | Description |
| --- | --- |
**1** | Source identifier (0x00 FMS, 0x01 Non-FMS)
**2-4** | Source-specific id, e.g. FMS PGNs

## Available Non-FMS standard data identifiers
Optional unless stated explicitly in the main ADT document.

ID | Subid | Name | Value | Recommended refresh interval | Remarks
--- | --- | --- | --- | --- | ---
**0001FF25** | 10003 | Wall Charger connected | | onChange |
**0001FF25** | 10004 | Fast Charger connected | | onChange |
**0001FF25** | 10005 | Charging Active | | onChange |
**01000002** | | Temperature inside average | float | 1/min |
**01000005** | | SOC | float | 1/min |
**01000006** | | Transmission mode | combustion/electric | onChange | Intended for hybrid vehicles
**01000007** | | Windscreen wiper active | True/false | onChange | Taken to represent a measurement of the ground truth binary rainfall state, given that it is a better predictor of the binary rainfall state than radar- or gauge-based measurements
**01000008** | | Accelerometry | | 1/min | * Bandwidth >= 100 hz<br> * Resolution <= 0.01 g
| | xmin | Min x value last minute | g | | |
| | xmax | Max x value last minute | g | | |
| | xavg | Average x value last minute | g | | |
| | ymin | Min y value last minute | g | | |
| | ymax | Max y value last minute | g | | |
| | yavg | Average y value last minute | g | | |
| | zmin | Min z value last minute | g | | |
| | zmax | Max z value last minute | g | | |
| | zavg | Average z value last minute | g | | |
**01000009** | | Outdoor temperature | float | 1/min |* Unit Celcius <br>* Resolution <= 1 C <br>* Measured at front of vehicle as near as possible to the ground
**0100000A** | | Accumulated energy consumption | float | 1/min | * Energy consumed <br>* Including HVAC <br>* Unit: kWh
