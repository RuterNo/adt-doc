### Infohub Emergency message:
| Field         | Value                                                     |
|---------------|-----------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/infohub/dpi/emergency/json |
| Schema        | [ dpi-emergency.json ](json-schemas/dpi-emergency.json)   |

Topic used to trigger the displays to show the emergency message instead of the regular passenger information.

> ⚠️ **Notice!** The MADT is to send this message every X sec while the emergency is in progress. This is to make sure the message reaches all the displays in case of package loss on the network.
