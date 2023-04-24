### Location Message
| Field         | Value                                                |
|---------------|------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/gnss/location|
| Schema        | [ location.json ](json-schemas/sensors/gnss/location/location.json)|

Describes the GNSS navigation receiver feedback in metric format. The periodicity of updates to be expected should be
described as number of seconds in configValue01 for this topic under topic:
```
ruter/{PTO}/{vehicleID}/mi/provider_clients//provided_topics
```

The GNSS type should be described in configValue11. Information about the used GNSS System. MixedGNSSTypes is used for
receivers using multiple satellite constellations. Possible values:
- GPS
- Glonass
- Galileo
- Beidou
- IRNSS
- Other
- DeadReckoning
- MixedGNSSTypes

The GNSS coordinate system should be described in configValue12, at least if other than “WGS84”. Possible values:
- GPS
- Glonass
- Galileo
- Beidou
- IRNSS
- Other
- DeadReckoning
- MixedGNSSTypes

“MixedGNSSTypes” is used for receivers using multiple satellite constellations.

Frequency is recommended at 1 message per second.
