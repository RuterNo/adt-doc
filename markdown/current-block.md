### Current block message:
| Field         | Value                                                   |
|---------------|---------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/oi/current_block/state   |
| Schema        | [ current-block.json ](json-schemas/current-block.json) |

Normally this topic indicates which block this vehicle is currently signed on to according to the backoffice or that it only assigned but not yet signed on or that it is not even assigned. This is usually a result of what was proposed by the driver on-board (see ruter/{PTO}/{vehicleID}/di/assignment_attempt/block) and then confirmed as valid by the back-office. It could also be based on an overriding decision enforced by the operation control centre.

Note that if a ruter/{PTO}/{vehicleID}/di/assignment_attempt/block is not answered by the back-office within a configured duration it is assumed that contact is lost with the control centre and then the proposed block will be accepted and exposed on this topic.
