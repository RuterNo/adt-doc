### DPI Command message:
| Field         | Value                                               |
|---------------|-----------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/pe/dpi_command       |
| Schema        | [ dpi-command.json ](json-schemas/dpi-command.json) |
  
This channels is reserved for command and control messages originated by Ruter. Typical use cases include:
  
- Diagnostics / debugging
  - Trigger transfer of debug information
  - Trigger screenshot of DPI screen
  - Trigger clearing of cache and refresh of webpage
- Content
  - Trigger display of campaign
  
The payload is defined as an object with no structure to provide flexibility.