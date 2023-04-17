### Due message:
| Field         | Value                                                       |
|---------------|-------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/ei/due_information           |
| Schema        | [ due-information.json ](json-schemas/due-information.json) |

This topic provides an adapted text indicating that the vehicle is about to arrive at a stop according to what the coordinating 
application has concluded.

This could optionally be based on information provided in real-time from a back-office AVMS. However, if contact is lost 
with the back-office for more than a configured duration the information should be based on local information.

### ⚠️ Deprecation notice! ⚠️
Please be advised this topic is marked for deletion in later major versions of ADT.  
