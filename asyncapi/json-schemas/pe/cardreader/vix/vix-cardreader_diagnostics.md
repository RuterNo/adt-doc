### VIX Card Reader Diagnostics MQTT Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{PTO}/{vehicleID}/adt/v3/pe/cardreader_diagnostics/vix/{deviceRef}                                          |
| Schema        | [ vix-cardreader_diagnostics.json ](json-schemas/pe/cardreader/vix/vix-cardreader_diagnostics.json)               |
| Producer      | VIX                                                                                                               |
| Consumer      | Ruter BackOffice                                                                                                  |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. | 

Diagnostics message sent from any Vix-validator running Ruter-firmware in the vehicle. Can be used by both PTA and PTO to monitor the operational status of these units.
