### Local Announcement From Driver Onboard The Vehicle
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/onboard_announcement                                 |
| Schema        | [ onboard-announcement.json ](json-schemas/pe/dpi/onboard_announcement/onboard-announcement.json)        |
| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Producer      | M4 / MADT                                                                                                  |
| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

Drivers must have the ability to notify passengers of special events or circumstances through buttons in the MADT. Examples of these messages are:
- "Beware - the platform is slippery"
- "Please do not hold doors"
- "Watch out for pickpockets"
- "Please leave the train"

This message is sent from the MADT to the onboard MQTT broker. Ruter's DPI application listens to this MQTT topic and displays the information on the passenger information screens.

When the driver presses an "Onboard announcement" the configuration related to each item decides which MQTT messages are sent:
1. Some contain only a textual warning to be displayed on the DPI-app screen (using this message).
2. Other messages will trigger both this message (for textual warning) and an audio message on `pe/audio`.

Please see the onboard announcement configuration file description in the ADT documentation. Briefly, the configuration file contains an ID (number) and the text to display in the list shown to the driver. Associated with each such element - the configuration file contains the payload for the DPI screens, and an audio payload. The configuration file can contain each (both `pe/dpi/onboard_announcement` and `pe/audio`), or only one or the other. The MADT has a role in listing the messages, and publishing the associated payloads on the relevant topics, but apart from this onboard systems are not affected.

These messages shall not be broadcast repeatedly - they must be sent only once.
