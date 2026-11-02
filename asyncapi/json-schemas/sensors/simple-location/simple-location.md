### Simple Location Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/sporveien_tbane/{vehicleId}/adt/v4/sensors/simple_location                                          |
| Schema        | [ simple-location.json ](json-schemas/sensors/simple-location/simple-location.json)                       |
| Maintainer    | [Progress](https://github.com/orgs/RuterNo/teams/progress)                                                |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Simplified position data for metro vehicles. Published upon receipt of a position message from the train, regardless of whether the message is received through CBTC or CMCS.

The GNSS coordinate system is expected to be "WGS84". Negative values are used south of the equator and west of Greenwich.

Frequency: on change (triggered by incoming position message from train).
