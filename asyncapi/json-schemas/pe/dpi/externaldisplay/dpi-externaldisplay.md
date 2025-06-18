### Externaldisplay Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/externaldisplay                                      |
| Schema        | [ dpi-externaldisplay.json ](json-schemas/pe/dpi/externaldisplay/dpi-externaldisplay.json)                |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Message to be shown on the external destination display. Usually line number (publicCode) and routeName, with support for alternative message.
