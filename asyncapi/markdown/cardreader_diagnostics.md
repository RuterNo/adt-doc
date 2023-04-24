### Card Reader Diagnostics MQTT Message
| Field         | Value                                                                     |
|---------------|---------------------------------------------------------------------------|
| Central Topic | ruter/{PTO}/{vehicleID}/pe/cardreader_diagnostics/vix/{deviceRef}         |
| Schema        | [ cardreader_diagnostics.json ](json-schemas/cardreader_diagnostics.json) |
| Producer      | ?                                                                         |
| Consumer      | ?                                                                         |
| Service Level | ?                                                                         | 

Diagnostics message sent from any Vix-validator running Ruter-firmware in the vehicle. Can be used by both PTA and PTO to monitor the operational status of these units.
