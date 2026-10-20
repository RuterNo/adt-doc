### Emergency Message To Passengers
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/emergency                                            |
| Schema        | [ emergency.json ](json-schemas/pe/dpi/emergency/emergency.json)                                          |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Producer      | M4 / MADT                                                                                                  |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Sporveien is required to provide the public with an evacuation message in case an emergency occurs. This message overrides the display on Ruter's DPI screens onboard the vehicle.

This message is among those that will be sent by the MADT when the driver has selected an "Emergency message". It will often be sent together with `pe/audio` (one of several pre-recorded audio messages stored onboard in a configuration file for the MADT). This message, and an audio message, must be sent repeatedly by the MADT every X seconds (where X is a configurable setting from the message definition file), until the driver disables the emergency message. Some of the emergency messages contain external signage which is to override whatever is currently set.

The message is broadcast from the MADT. The consumer is Ruter's DPI application running in browser in displays onboard the vehicle. The message direction is "out", because the message should be forwarded from the vehicle to the backoffice systems, as the driver triggering an emergency is important information to keep track of.

It is expected that the MADT will send one message to enable the emergency message. When the driver cancels the emergency message from the MADT, this same message (`pe/dpi/emergency`) must be sent with `enabled` set to Boolean `false`.
