### DPI Acknowledge message:
| Field         | Value                                                       |
|---------------|-------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/pe/dpi_ack                   |
| Schema        | [ dpi-acknowledge.json ](json-schemas/dpi-acknowledge.json) |

The DPI Ack topic is used to inform the Ruter BO about the content presented on the PTO’s own systems for Dynamic Passenger Information in the vehicle. Usually, this is destination displays. The rest of DPI is presented by Ruter’s own DPI system, and does not need this kind of acknowledgement message.
