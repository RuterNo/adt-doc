### VIX Card Reader Diagnostics MQTT Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{PTO}/{vehicleID}/adt/v3/pe/cardreader_diagnostics/vix/{deviceRef}                                  |
| Schema        | [ vix-cardreader_diagnostics.json ](json-schemas/pe/cardreader/vix/vix-cardreader_diagnostics.json)       |
| Producer      | VIX                                                                                                       |
| Consumer      | ?                                                                                                         |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Diagnostics message sent from any Vix-validator running Ruter-firmware in the vehicle. Can be used by both PTA and PTO to monitor the operational status of these units.
