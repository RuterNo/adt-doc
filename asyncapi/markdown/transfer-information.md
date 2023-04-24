### Due message:
| Field         | Value                                                                 |
|---------------|-----------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/ei/transfer_information                |
| Schema        | [ transfer-information.json ](json-schemas/transfer-information.json) |

This topic provides an adapted selection of real time information describing connecting lines at the current or the coming 
stop that passengers onboard this vehicle could transfer to. The information is provided in the form of a list of possible 
transfer options at the next stop.

This topic should be blanked (provided with empty content) when there is no relevant information to display.

As an added precaution an expiry timestamp is included to assure that outdated information is not presented.

### ⚠️ Deprecation notice! ⚠️
Please be advised this topic is marked for deletion in later major versions of ADT. 