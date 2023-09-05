### RuterSalg diagnostics
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/pe/sales/diagnostics                                                        |
| Schema        | [ sales-diagnostics.json ](json-schemas/pe/sales/diagnostics/sales-diagnostics.json)                              |
| Producer      | RuterSalg                                                                                                         |
| Consumer      | RuterSalg                                                                                                         |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. | 

Diagnostics message generated by RuterSalg.

This topic is intended for applications interested in health status for the RuterSalg application on each bus. The health status is intended both as a real time surveillance of health status for each individual bus as well as for aggregating data per operator to see larger, more general issues. The topic can also, when enriched by other data, determine whether or not RuterSalg was used and working on a specific departure.