### Audio Message
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/audio                                                    |
| Schema        | [ audio.json ](json-schemas/pe/audio/audio.json)                                                          |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)|
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

The topic used for transmitting these audio messages is dedicated exclusively to audio playback through the vehicle's speaker system. 
The audio messages may contain an array of sound clips that should be played sequentially as they were received.

In some cases, multiple speaker groups may be targeted by the same audio message.

#### Audio Message Playback
- When a vehicle receives an MQTT message containing audio content, the PTO must play the audio, which can be in either OPUS or MP3 format.
- If the message defines an expiration timestamp that has passed, the audio content must not be played.
- If a message contains multiple audio files, these must be played in the order in which they appear in the message.
- MQTT messages with audio content must be processed synchronously, ensuring that new messages are only played after the previous one has finished.
