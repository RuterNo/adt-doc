### Location Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/location                                                    |
| Schema        | [ location.json ](json-schemas/sensors/location/location.json)                                            |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Describes the GNSS navigation receiver feedback in metric format.

The GNSS type is expected to be GPS. The GNSS coordinate system is expected be “WGS84”. Negative values is used south of
the equator and west of Greenwich.

Frequency is expected to be at 1 message per second.
