### Audio message:
| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/ei/audio_message                                                           |
| Schema        | [ audio.json ](json-schemas/audio.json)                                                                   |
| Producer      | [Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                               |
| Consumer      | PTO                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Topic used exclusively to transmit audio messages to be played by the speaker system. The audio messages may contain an 
array of sound bites, that are to be played in the sequence they have been received.

Multiple speaker groups may be the target of the same sound file.
