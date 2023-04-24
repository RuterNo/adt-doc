### MADT Notification
| Field         | Value                                                                            |
|---------------|----------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/itxpt/ota/madt/notification/json   |
| Schema        | [ notification.json ](json-schemas/notification.json) |

Notification message sent to the MADT (Multi-Application Driver Terminal) device inside the bus. To be used to inform the bus driver from the Ruter backoffice.
The text message may contain the "Line Feed" character (\n), indicating line breaks.
