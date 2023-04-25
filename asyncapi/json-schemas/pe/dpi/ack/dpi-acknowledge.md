### DpiAcknowledge Message
| Field         | Value                                                                  |
|---------------|------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/pe/dpi/ack                       |
| Schema        | [ dpi-acknowledge.json ](json-schemas/pe/dpi/ack/dpi-acknowledge.json) |

The DPI Ack topic is used to inform the Ruter BO about the correct transfer and interpretation of messages to the vehicle.

Ruter shall receive an acknowledgment message for the following topics:

| Topic                     | Responsible for producing ack |
|---------------------------|-------------------------------|
| External display messages | PTO                           |
| Audio messages            | PTO                           |
| Journey messages          | DPI application               |
| NextStop messages         | DPI application               |

The ack message should be produced as soon as the message is received and validated. This is a confirmation that the system
on board the vehicle have received the data and is capable of acting on it.

No confirmation message should be returned if the system is unable to playback the content. (e.g. invalid message format)
