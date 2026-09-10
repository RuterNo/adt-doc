### Report Which Doors Were Requested To Open Using Button
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/door_request_open                                   |
| Schema        | [ door-request-open.json ](json-schemas/status/door_request_open/door-request-open.json)                 |
| Maintainer    | Sporveien                                                                                                   |
| Producer      | Sporveien                                                                                                   |
| Consumer      | Sporveien                                                                                                   |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

This message is sent with `requestOpen` equal to Boolean True when the button on the door is pressed, requesting that it be opened at the next stop.

The message is sent with `requestOpen` equal to Boolean False for all doors that were previously requested opened (i.e., a message of this type with `requestOpen = true` was sent for this `doorRef`) when the door lock is enabled (`sensors/door` is sent with `isOpen=false`).

Motivation: It should be possible for the passenger information application (DPI) on the screen above the door to listen to this message onboard, and display whether the door will open or not. This is in addition to the button lighting up, signaling that the door will open on reaching the platform/quay.

This should be sent even if the door is on the list of doors that should be disabled (or is locked) at the next stop.
