### RuterSalg current_stop
| Field         | Value                                                                                                             |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v4/pe/sales/current_stop                                                       |
| Schema        | [ sales-current_stop.json ](json-schemas/pe/sales/current_stop/sales-current_stop.json)                           |
| Producer      | Betjent salg                                                                                                      |
| Consumer      | Betjent salg                                                                                                      |
| Service Level | ⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version. | 

Used to alert the RuterSalg app about the current stop. This message is triggered when the Progress entity determines that the bus is arriving
at the quay, meaning it is maximum 35 meters from the quay, approaching it. Contains information about the zone the current stop belongs to.

The message also contains information about the NEXT stop and its zone. This is used to determine if the bus is approaching a zone border. One
use for this is whether or not to sell a "smart ticket" if the passenger has funds in their travel purse.
