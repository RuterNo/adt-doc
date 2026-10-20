### Signal From MADT (Driver) To Use Offline Passenger Information
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/offline                                              |
| Schema        | [ offline.json ](json-schemas/status/offline/offline.json)                                                |
| Maintainer    | Sporveien                                                                                                   |
| Producer      | Sporveien                                                                                                   |
| Consumer      | Sporveien                                                                                                   |
| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                  |

Ruter delivers a solution for limited passenger information to be used onboard. This message triggers use of the offline solution. The message flow for audio and external signage will be:
- Ruter publishes: `pe/audio`
- Sporveien backoffice republishes this as `pe/online/audio`
- Ruter's onboard component listens on `pe/online/audio`
  - When state is "online", Ruter's offline solution republishes the message on the M4 MQTT broker as `pe/audio` (the standard ADT audio message)
  - When state is "offline", Ruter's component will publish `pe/audio` without any signal from the landside

This message is triggered from the MADT screen by the driver. When the driver exits "offline" mode in the MADT, the message should first be published with `offline = false`. When the vehicle is first powered on, it should immediately send a message with `offline = false`.

Note that the message is "retained". The last message of this type published will remain on the broker. Any new subscribing client will receive it. The topic is specified as "bridged", even though it most likely will not be sent out of the vehicle, as the vehicle will not have a network connection when this occurs.
