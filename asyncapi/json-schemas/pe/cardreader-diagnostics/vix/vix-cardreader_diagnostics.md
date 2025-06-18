### VIX Card Reader Diagnostics MQTT Message
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/cardreader_diagnostics/vix/{deviceRef}                           |
| Schema        | [ vix-cardreader_diagnostics.json ](json-schemas/pe/cardreader-diagnostics/vix/vix-cardreader_diagnostics.json)   |
| Producer      | VIX                                                                                                               |
| Consumer      | PTA Backoffice                                                                                                    |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                            |

Diagnostics message sent from any Vix-validator running Ruter-firmware in the vehicle. Can be used by both PTA and PTO to monitor the operational status of these units.
