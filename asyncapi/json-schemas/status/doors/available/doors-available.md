### Describe Which Doors Will Open At The Next Stop
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/doors/available                                      |
| Schema        | [ doors-available.json ](json-schemas/status/doors/available/doors-available.json)                       |
| Maintainer    | Sporveien                                                                                                   |
| Producer      | Sporveien                                                                                                   |
| Consumer      | Sporveien                                                                                                   |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

CBTC onboard, physically locking/blocking doors, and the vehicle itself will determine which doors can or cannot open when approaching a stop. This message broadcasts that information as a list of the doors that will open at the next stop, a list of doors that will not open, and a list of doors with errors.

For example, at a stop which is long enough for the entire vehicle, all the doors on the right-hand side will open. At some stops that are too short for the entire vehicle, only the front-most doors will open.

Motivation: This will likely be used by Ruter to display a visual indication in the DPI application showing passengers whether a door will open at the next stop or not.

When several vehicles are connected ("coupled") each vehicle should send its own individual `status/doors/available` message. It is important that this message be published for the next stop/quay as soon as possible on leaving the current stop/quay.
