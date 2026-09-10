
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "Avtale om digitale tjenester - ADT (Metro)",
    "description": "## Ruters digitale plattform\nThis specification contains interfaces to be used between PTOs (operators) and Ruter.\nThe API describes a set of MQTT topics which are used to distribute data onboard public transport vehicles/vessels as\nwell as between the vehicle/vessel and Ruter’s Back Office or vv.\n\n### General information\n#### Upgrades to the API\nThe API follows the upgrade cycles of ADT. Major releases are done more or less once a year and usually include breaking changes.\n\nMinor/build releases are performed as continual deliveries and are non-breaking. New versions of this document will be published when new topics and/or fields are added.\n\n#### Consumer Client Requirements\nClients consuming information posted on the topics must be tolerant to:\n- That optional properties can be null or left out.\n- That arrays can contain any number of elements including zero.\n- That returned data can be extended with new properties without notice.\n\n#### Quality of Service, Retained Flag and Persistence\nGenerally, QoS level 1 is applied for most topics and the `retain` flag is true for most topics. See the respective topic for precise info.\n\nSubscribers should start with Clean Session set to True to assure that they get the latest information at reconnection (the retained info) and avoid first having to process a long queue of outdated old information that in reality hinders new relevant information to reach the subscriber.\n\n#### Translation of topic names\nGlobal topic names are generally written on the format of `{recipient}/{sender}/{vehicleid}/{topic}` to make it easy to identify the source and destination of the messages.\nLocal topic names have omitted the `{recipient}/{sender}/{vehicleid}` part in order to have onboard equipment pre-configured with vehicle independent settings.\n\nAll topic names must thus be rewritten local/global in the MQTT bridge according to a provided configuration file.\n\n#### Data format\nAll data must be JSON and UTF-8 encoded.\n\n### Overview\n\nThe diagram below shows an overview of the most important messages that manage the assignment and journey of a vehicle.\n\n![Overview of important messages](images/Overview-4.png)\n\n1. The vehicle signs on. (In ADT4, this is a synchronous REST call.)\n2. Based on the location of the vehicle, Ruter calculates which journey in the assignment the vehicle is on, which stop it is going to next, etc.\n3. If the position matches a journey in the assignmment, Ruter sends a journey message to the vehicle, \n4. ...and Ruter changes external display\n\n### More info\nFor more information, please go to: [Ruter’s ADT agreement](https://ruter.atlassian.net/wiki/spaces/DS/pages/231178249/Avtale+om+Digitale+Tjenester \"https://ruter.atlassian.net/wiki/spaces/DS/pages/231178249/Avtale+om+Digitale+Tjenester\").\n\n### Comments or suggestions\nPlease open an issue here: [ADT-DOC Issues](https://github.com/RuterNo/adt-doc/issues) \n",
    "termsOfService": "https://ruter.no",
    "contact": {
      "name": "RDP Support",
      "url": "https://ruteras.slack.com/archives/CKJ2V79SN",
      "email": "rdp-support@ruter.no"
    },
    "license": {
      "name": "GPL 3.0",
      "url": "https://ruter.no"
    },
    "version": "4.x"
  },
  "defaultContentType": "application/json",
  "servers": {
    "mqttTranshub": {
      "host": "mqtt.transhub.io",
      "protocol": "mqtt",
      "description": "Ruters central MQTT broker",
      "variables": {
        "port": {
          "description": "The mqtt broker is available through TCP (:8883) and Websockets (:9883)",
          "default": "8883",
          "enum": [
            "8883",
            "9883"
          ]
        }
      },
      "security": [
        {
          "type": "userPassword",
          "description": "Please reach out to rdp-support@ruter.no to request access."
        }
      ]
    }
  },
  "channels": {
    "di_override_attempt_destination_display": {
      "address": "di/override_attempt/destination_display",
      "description": "### Destination Display Override Message\n| Field         | Value                                                                                                                         |\n|---------------|-------------------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/di/override_attempt/destination_display                                         |\n| Schema        | [ destination-display-override.json ](json-schemas/di/override_attempt/destination_display/destination-display-override.json) |\n| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                                |\n| Producer      | PTO                                                                                                                           |\n| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                                                |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                     |\n\nTo construct a message, refer to the Available Destination Displays Message list and ensure that all fields provided in \nthe list are included in the message.\n\nIf an entry contains publicCode, destination, and alternativeMessage, all three fields must be included exactly as specified \nin the list. The only additional fields you need to provide are a current eventTimestamp and a unique traceId.\n",
      "messages": {
        "DestinationDisplayOverride": {
          "name": "DestinationDisplayOverride",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/di/override_attempt/destination_display/destination-display-override.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "DestinationDisplayOverride",
              "type": "object",
              "required": [
                "traceId",
                "eventTimestamp",
                "destination"
              ],
              "description": "Describes a request from MADT or other GUI to manually override the information shown on the destination display. It is up to the presenting system to decide how and for how long the override will apply. A rule could be until next journey begins or a new override_attempt/destination_display is received. The topic could be blanked (provided with a zero-byte payload) to indicate that any overriding information is no longer valid and that the destination display can return to normal",
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "publicCode": {
                  "$id": "#/properties/publicCode",
                  "type": "string",
                  "description": "Publicly-known number of the line"
                },
                "destination": {
                  "$id": "#/properties/destination",
                  "type": "string",
                  "description": "Destination of the bus"
                },
                "alternativeMessage": {
                  "$id": "#/properties/alternativeMessage",
                  "type": "string",
                  "description": "Alternative message to be displayed on second line of display"
                }
              }
            }
          },
          "examples": [
            {
              "name": "Destination Display Override",
              "payload": {
                "eventTimestamp": "2023-04-10T16:45:33.901Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "publicCode": "250",
                "destination": "  Oslo bussterminal",
                "alternativeMessage": "  Ingen påstigning"
              }
            }
          ],
          "x-parser-unique-object-id": "DestinationDisplayOverride"
        }
      },
      "x-parser-unique-object-id": "di_override_attempt_destination_display"
    },
    "pe_active_cab": {
      "address": "pe/active_cab",
      "description": "### ActiveCab Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/active_cab                                               |\n| Schema        | [ active-cab.json ](json-schemas/pe/active-cab/active-cab.json)                                           |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Producer      | PTO                                                                                                       |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team), [Progress](https://github.com/orgs/RuterNo/teams/progress)|\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n",
      "messages": {
        "ActiveCab": {
          "name": "ActiveCab",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/active-cab/active-cab.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "ActiveCab",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "activeCab"
              ],
              "description": "Used to keep track of what direction the train is driving",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "activeCab": {
                  "$id": "#/properties/activeCab",
                  "type": "string",
                  "description": "Text for active cab",
                  "examples": [
                    "c1",
                    "c2",
                    "inactive"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "Active CAB",
              "payload": {
                "eventTimestamp": "2020-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "activeCab": "c1"
              }
            }
          ],
          "x-parser-unique-object-id": "ActiveCab"
        }
      },
      "x-parser-unique-object-id": "pe_active_cab"
    },
    "pe_audio": {
      "address": "pe/audio",
      "description": "### Audio Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/audio                                                    |\n| Schema        | [ audio.json ](json-schemas/pe/audio/audio.json)                                                          |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)      |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)      |\n| Consumer      | PTO                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nThe topic used for transmitting these audio messages is dedicated exclusively to audio playback through the vehicle's speaker system. \nThe audio messages may contain an array of sound clips that should be played sequentially as they were received.\n\nIn some cases, multiple speaker groups may be targeted by the same audio message.\n\n#### Audio Message Playback\n- When a vehicle receives an MQTT message containing audio content, the PTO must play the audio, which can be in either OPUS or MP3 format.\n- If the message defines an expiration timestamp that has passed, the audio content must not be played.\n- If a message contains multiple audio files, these must be played in the order in which they appear in the message.\n- MQTT messages with audio content must be processed synchronously, ensuring that new messages are only played after the previous one has finished.\n",
      "messages": {
        "Audio": {
          "name": "Audio",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/audio/audio.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Audio",
              "description": "This topic provides an audio message intended for passengers onboard the vehicle that should be played on speaker(s) defined in the speaker property of the payload.",
              "type": "object",
              "additionalProperties": true,
              "required": [
                "eventTimestamp",
                "traceId",
                "expiryDateTime",
                "preferredStartDateTime",
                "ref",
                "audio"
              ],
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "expiryDateTime": {
                  "$id": "#/properties/expiryDateTime",
                  "type": "string",
                  "description": "Do not present this information after this time. As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "preferredStartDateTime": {
                  "$id": "#/properties/preferredStartDateTime",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "ref": {
                  "$id": "#/properties/ref"
                },
                "source": {
                  "$id": "#/properties/source",
                  "type": "string",
                  "description": "Audio was produced by this source"
                },
                "audio": {
                  "$id": "#/properties/audio",
                  "type": "array",
                  "items": {
                    "type": "object",
                    "title": "audio",
                    "required": [
                      "speakers"
                    ],
                    "properties": {
                      "encoding": {
                        "type": "string",
                        "description": "Optional. Audio message encoding",
                        "enum": [
                          "MP3",
                          "OPUS"
                        ],
                        "x-parser-schema-id": "<anonymous-schema-2>"
                      },
                      "content": {
                        "type": "string",
                        "description": "Optional. BASE64 encoded binary data. Do not use if contentURL is defined",
                        "x-parser-schema-id": "<anonymous-schema-3>"
                      },
                      "contentURL": {
                        "type": "string",
                        "description": "Optional. Location of content. Do not use if content is defined.",
                        "x-parser-schema-id": "<anonymous-schema-4>"
                      },
                      "speakers": {
                        "type": "object",
                        "description": "Speaker targets and volume the audio is intended for",
                        "additionalProperties": {
                          "type": "integer",
                          "x-parser-schema-id": "<anonymous-schema-6>"
                        },
                        "x-parser-schema-id": "<anonymous-schema-5>"
                      }
                    },
                    "x-parser-schema-id": "<anonymous-schema-1>"
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Audio MP3",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2018-11-13T11:40:02.749Z",
                "expiryDateTime": "2018-11-13T08:40:32.249Z",
                "preferredStartDateTime": "2018-11-13T08:39:32.749Z",
                "ref": "RUT:StopPlace:03012453",
                "source": "campaign",
                "audio": [
                  {
                    "encoding": "MP3",
                    "content": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3...",
                    "speakers": {
                      "INTERNAL": 70
                    }
                  },
                  {
                    "encoding": "MP3",
                    "content": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3...",
                    "speakers": {
                      "INTERNAL": 70,
                      "EXTERNAL": 40
                    }
                  }
                ]
              }
            },
            {
              "name": "Audio local files",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2018-11-13T11:40:02.749Z",
                "expiryDateTime": "2018-11-13T08:40:32.249Z",
                "preferredStartDateTime": "2018-11-13T08:39:32.749Z",
                "ref": "RUT:StopPlace:03012453",
                "source": "situation",
                "audio": [
                  {
                    "encoding": "OPUS",
                    "contentUrl": "http://webserver.local/resources/safety_long.opus",
                    "speakers": {
                      "INTERNAL": 70
                    }
                  },
                  {
                    "encoding": "MP3",
                    "content": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3...",
                    "speakers": {
                      "INTERNAL": 70
                    }
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "Audio"
        }
      },
      "x-parser-unique-object-id": "pe_audio"
    },
    "pe_cardreader_diagnostics_vix_deviceRef": {
      "address": "pe/cardreader_diagnostics/vix/{deviceRef}",
      "description": "### VIX Card Reader Diagnostics MQTT Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/cardreader_diagnostics/vix/{deviceRef}                           |\n| Schema        | [ vix-cardreader_diagnostics.json ](json-schemas/pe/cardreader-diagnostics/vix/vix-cardreader_diagnostics.json)   |\n| Maintainer    | [Betjent salg](https://github.com/orgs/RuterNo/teams/rutersalg)                                                   |\n| Producer      | VIX                                                                                                               |\n| Consumer      | PTA                                                                                                               |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                            |\n\nDiagnostics message sent from any Vix-validator running Ruter-firmware in the vehicle. Can be used by both PTA and PTO to monitor the operational status of these units.\n",
      "parameters": {
        "deviceRef": {
          "description": "An unique ID of the unit."
        }
      },
      "messages": {
        "VixCardreaderDiagnostics": {
          "name": "VixCardreaderDiagnostics",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/cardreader-diagnostics/vix/vix-cardreader_diagnostics.json",
              "type": "object",
              "title": "VixCardreaderDiagnostics",
              "required": [
                "eventTimestamp",
                "traceId",
                "deviceRef",
                "inService"
              ],
              "additionalProperties": false,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "Time of diagnostics generated. As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier to be able to trace this message. Also used to detect duplicate messages received."
                },
                "deviceRef": {
                  "$id": "#/properties/deviceRef",
                  "type": "string",
                  "description": "Unique identifier for the device. This value is appended to the published topic"
                },
                "inService": {
                  "$id": "#/properties/inService",
                  "type": "boolean",
                  "description": "Whether or not the device is operational",
                  "examples": [
                    "true",
                    "false"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "VIX Card Reader Diagnostics",
              "payload": {
                "eventTimestamp": "2022-05-24T07:00:25Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "deviceRef": "RUT1234",
                "inService": true
              }
            }
          ],
          "x-parser-unique-object-id": "VixCardreaderDiagnostics"
        }
      },
      "x-parser-unique-object-id": "pe_cardreader_diagnostics_vix_deviceRef"
    },
    "pe_cbtc_trip_activated": {
      "address": "pe/cbtc/trip_activated",
      "description": "### CBTC Trip Activated Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/trip_activated                                      |\n| Schema        | [ trip-activated.json ](json-schemas/pe/cbtc/trip_activated/trip-activated.json)                          |\n| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Producer      | Sporveien / CBTC                                                                                           |\n| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nPublished when the CBTC system activates a new trip. Contains enough information to uniquely identify the trip, used by Ruter's offline solution and matched with data stored onboard about the route plan.\n\nWhen vehicles have been coupled, each vehicle must send this information.\n",
      "messages": {
        "TripActivated": {
          "name": "TripActivated",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/cbtc/trip_activated/trip-activated.json",
              "title": "TripActivated",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "journeyDate",
                "datedVehicleJourneyRef"
              ],
              "description": "Published onboard when CBTC activates a new trip. Contains enough information to uniquely identify the trip, used by Ruter's offline solution and matched with data stored onboard about the route plan. When vehicles have been coupled, each vehicle must send this information.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "journeyDate": {
                  "$id": "#/properties/journeyDate",
                  "type": "string",
                  "description": "The date of the journey. Block and journey numbers are reused each day, so this is required for unique identification."
                },
                "datedVehicleJourneyRef": {
                  "$id": "#/properties/datedVehicleJourneyRef",
                  "type": "string",
                  "description": "The first 3 digits represent the Block (\"tognummer\") from Hastus. The last 3 digits represent the journey within the block. For example, 007 is the 7th journey in the block."
                }
              }
            }
          },
          "examples": [
            {
              "name": "CBTC trip activated",
              "payload": {
                "eventTimestamp": "2020-10-31T08:38:02.749Z",
                "traceId": "123412-cd5534-12332",
                "journeyDate": "2025-06-21",
                "datedVehicleJourneyRef": "401027"
              }
            }
          ],
          "x-parser-unique-object-id": "TripActivated"
        }
      },
      "x-parser-unique-object-id": "pe_cbtc_trip_activated"
    },
    "pe_cbtc_next_stop": {
      "address": "pe/cbtc/next_stop",
      "description": "### CBTC Next Stop Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/next_stop                                           |\n| Schema        | [ next-stop.json ](json-schemas/pe/cbtc/next_stop/next-stop.json)                                         |\n| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Producer      | Sporveien / CBTC                                                                                           |\n| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nWhen the vehicle starts to move with a defined destination, CBTC makes information available about the next stop of the vehicle. This information is published onboard so that the Ruter offline solution can access it.\n\nWhen vehicles have been coupled, each vehicle must send this information.\n",
      "messages": {
        "CbtcNextStop": {
          "name": "CbtcNextStop",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/cbtc/next_stop/next-stop.json",
              "title": "NextStop",
              "type": "object",
              "required": [
                "eventTimestamp",
                "platformTrackId"
              ],
              "description": "Published when CBTC knows the next stop/quay of the vehicle, so that the Ruter offline solution can access it.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "platformTrackId": {
                  "$id": "#/properties/platformTrackId",
                  "type": "string",
                  "description": "The unique platform track ID of this quay. CBTC refers to this as \"PTID\"."
                }
              }
            }
          },
          "examples": [
            {
              "name": "CBTC next stop",
              "payload": {
                "eventTimestamp": "2020-10-31T08:38:02.749Z",
                "platformTrackId": "3176"
              }
            }
          ],
          "x-parser-unique-object-id": "CbtcNextStop"
        }
      },
      "x-parser-unique-object-id": "pe_cbtc_next_stop"
    },
    "pe_cbtc_target_distance": {
      "address": "pe/cbtc/target_distance",
      "description": "### CBTC Distance To Next Quay (Target) Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/cbtc/target_distance                                     |\n| Schema        | [ target-distance.json ](json-schemas/pe/cbtc/target_distance/target-distance.json)                      |\n| Maintainer    | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Producer      | Sporveien / CBTC                                                                                           |\n| Consumer      | [Assignment](https://github.com/orgs/RuterNo/teams/assignment)                                            |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nWhen the vehicle has a known destination, CBTC publishes information about the remaining distance to the target every second.\n",
      "messages": {
        "TargetDistance": {
          "name": "TargetDistance",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/cbtc/target_distance/target-distance.json",
              "title": "TargetDistance",
              "type": "object",
              "required": [
                "eventTimestamp",
                "platformTrackId",
                "startDistance",
                "targetDistance"
              ],
              "description": "Published every second when the vehicle has a known destination, with information about the remaining distance to the target.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "platformTrackId": {
                  "$id": "#/properties/platformTrackId",
                  "type": "string",
                  "description": "The unique platform track ID of the next quay. CBTC refers to this as \"PTID\"."
                },
                "startDistance": {
                  "$id": "#/properties/startDistance",
                  "type": "integer",
                  "description": "Starts at 0 when the vehicle leaves the current stop. Counts up to the \"targetDistance\" (when at next stop)."
                },
                "targetDistance": {
                  "$id": "#/properties/targetDistance",
                  "type": "integer",
                  "description": "When the vehicle leaves the current stop, this is set to the total distance to reach the next stop. As the vehicle moves, this counts downwards. When the vehicle reaches the next stop, this value reaches 0. \"targetDistance\" and \"startDistance\" are the inverse of each other. When summed, they always yield the total distance from the previous stop to the next stop."
                }
              }
            }
          },
          "examples": [
            {
              "name": "CBTC distance to next quay (target)",
              "payload": {
                "eventTimestamp": "2020-10-31T08:38:02.749Z",
                "platformTrackId": "1234",
                "startDistance": 0,
                "targetDistance": 123123
              }
            }
          ],
          "x-parser-unique-object-id": "TargetDistance"
        }
      },
      "x-parser-unique-object-id": "pe_cbtc_target_distance"
    },
    "pe_doors_individually": {
      "address": "pe/doors_individually",
      "description": "### DoorsIndividually Message\n| Field         | Value                                                                                                       |\n|---------------|-------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/doors_individually                                         |\n| Schema        | [ doors-individually.json ](json-schemas/pe/doors-individually/doors-individually.json)                     |\n| Maintainer    | [Passasjertelling](https://github.com/orgs/RuterNo/teams/passasjertelling)                                  |\n| Producer      | PTO                                                                                                         |\n| Consumer      | PTA                                                                                                         |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.   |\n\nThis topic is used to track the individual status of doors. One use case is to improve the data quality of APC counts. See also topic sensors/door for status of anyDoorOpen/allDoorsClosed.\n",
      "messages": {
        "DoorsIndividually": {
          "name": "DoorsIndividually",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/doors-individually/doors-individually.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "DoorsIndividually",
              "type": "object",
              "required": [
                "traceId",
                "eventTimestamp",
                "messageNumber",
                "doorRef",
                "isOpen"
              ],
              "description": "This object is used to represent a door individually.",
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "$comment": "Added in version 2.5",
                  "type": "string",
                  "description": "A unique identifier to be able to trace this message. Also used to detect duplicate messages received."
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io). Reflects the current UTC time."
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "$comment": "Added in version 3.3",
                  "type": "integer",
                  "description": "The sequence number is generated per vehicle and per sensor category on the vehicle. For example, three door sensors on a vehicle would share the same messageNumber"
                },
                "doorRef": {
                  "$id": "#/properties/doorRef",
                  "type": "string",
                  "description": "A stable alpha-numeric reference unique within the vehicle scope (vehicle element/train set). When using Door Number as DoorRef, numbering must start at 1 (front of the vehicle)."
                },
                "isOpen": {
                  "$id": "#/properties/isOpen",
                  "type": "boolean",
                  "description": "True if the door is open.",
                  "examples": [
                    "true",
                    "false"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "Door Individually",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2021-10-31T12:45:50.749Z",
                "messageNumber": 123456,
                "doorRef": "1",
                "isOpen": true
              }
            }
          ],
          "x-parser-unique-object-id": "DoorsIndividually"
        }
      },
      "x-parser-unique-object-id": "pe_doors_individually"
    },
    "pe_dpi_ack": {
      "address": "pe/dpi/ack",
      "description": "### Acknowledge Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/ack                                                  |\n| Schema        | [ dpi-acknowledge.json ](json-schemas/pe/dpi/ack/dpi-acknowledge.json)                                    |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Producer      | PTO, [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nThe DPI Ack topic is used to inform the `PTA Backoffice` about the correct transfer and interpretation of messages to the vehicle.\n\nPTA shall receive an acknowledgment message for the following topics:\n\n| Topic                     | Responsible for producing ack |\n|---------------------------|-------------------------------|\n| External display messages | PTO                           |\n| Audio messages            | PTO                           |\n| Journey messages          | DPI application               |\n| NextStop messages         | DPI application               |\n\nThe ack message should be produced as soon as the message is received and validated. This is a confirmation that the system\non board the vehicle have received the data and is capable of acting on it.\n\nNo confirmation message should be returned if the system is unable to playback the content. (e.g. invalid message format)\n",
      "messages": {
        "DpiAcknowledge": {
          "name": "DpiAcknowledge",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/ack/dpi-acknowledge.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "DpiAcknowledge",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "clientId",
                "messageReceived"
              ],
              "description": "The DPI Ack topic.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "description": "The mqtt clientId of the client receiving the message. Should be persistent and not change from day to day."
                },
                "physicalId": {
                  "$id": "#/properties/physicalId",
                  "type": "string",
                  "description": "The given physical id to the screen. The property is provided by a querystring when configuring a screen"
                },
                "messageReceived": {
                  "$id": "#/properties/messageReceived",
                  "type": "object",
                  "properties": {
                    "topic": {
                      "type": "string",
                      "description": "Local MQTT topic key of received message",
                      "x-parser-schema-id": "<anonymous-schema-8>"
                    },
                    "eventTimestamp": {
                      "$id": "#/properties/eventTimestamp",
                      "type": "string",
                      "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                      "format": "date-time"
                    },
                    "traceId": {
                      "$id": "#/properties/traceId",
                      "type": "string",
                      "description": "A unique identifier - UUID"
                    }
                  },
                  "required": [
                    "topic",
                    "eventTimestamp",
                    "traceId"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Acknowledge",
              "payload": {
                "eventTimestamp": "2017-10-31T12:45:50.749Z",
                "traceId": "2ccf77aa-463f-4b98-ad19-61ec5d213e36",
                "clientId": "8fac6c64la4cap4b21R90d",
                "physicalId": "screen1",
                "messageReceived": {
                  "topic": "pe/dpi/journey",
                  "eventTimestamp": "2017-10-31T12:45:50.749Z",
                  "traceId": "b88aaf6a-b15b-415a-8c44-ac7ad42de59e"
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiAcknowledge"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_ack"
    },
    "pe_dpi_arriving": {
      "address": "pe/dpi/arriving",
      "description": "### Arriving Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/arriving                                                     |\n| Schema        | [ dpi-arriving.json ](json-schemas/pe/dpi/arriving/dpi-arriving.json)                                             |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nNotice to passengers that the bus is approaching a stop.\n",
      "messages": {
        "DpiArriving": {
          "name": "DpiArriving",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/arriving/dpi-arriving.json",
              "type": "object",
              "title": "DpiArriving",
              "description": "For display of arriving information to passengers",
              "required": [
                "eventTimestamp",
                "traceId",
                "message"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "expiryTimestamp": {
                  "$id": "#/properties/expiryTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io). Do not play or display after",
                  "format": "date-time"
                },
                "ref": {
                  "$id": "#/properties/ref",
                  "type": "string",
                  "description": "Reference to stop place id"
                },
                "order": {
                  "$id": "#/properties/order",
                  "type": "number",
                  "description": "Reference to the order of the stop (ref) on the journey"
                },
                "journeyRef": {
                  "$id": "#/properties/journeyRef",
                  "type": "string",
                  "description": "Reference to the journey"
                },
                "message": {
                  "$id": "#/properties/message",
                  "type": "object",
                  "description": "Message for one or more language",
                  "additionalProperties": true,
                  "patternProperties": {
                    "^[a-z]{2}(-[a-z]{2})?$": {
                      "$id": "#/properties/message/patternProperties/multilingualMessage",
                      "type": "object",
                      "description": "A multilingual message",
                      "additionalProperties": true,
                      "properties": {
                        "title": {
                          "$id": "#/properties/message/patternProperties/multilingualMessage/properties/title",
                          "type": "string",
                          "description": "Title"
                        },
                        "text": {
                          "$id": "#/properties/message/patternProperties/multilingualMessage/properties/text",
                          "type": "string",
                          "description": "Body text"
                        }
                      }
                    }
                  }
                },
                "zoneId": {
                  "$id": "#/properties/zoneId",
                  "type": "string",
                  "description": "Fare zone of next stop"
                }
              }
            }
          },
          "examples": [
            {
              "name": "Arriving",
              "payload": {
                "eventTimestamp": "2024-11-28T13:51:06.337903113Z",
                "traceId": "1acad49e-da9c-4ecc-8704-7b881d6cccc9",
                "expiryTimestamp": "2024-11-28T13:51:21.337909232Z",
                "ref": "NSR:StopPlace:6671",
                "order": 29,
                "journeyRef": "RUT:ServiceJourney:011578-018334-132500-31-2-Weekday-125",
                "message": {
                  "en": {
                    "title": "Arriving at",
                    "text": "Kastellet"
                  },
                  "no": {
                    "title": "Ankommer",
                    "text": "Kastellet"
                  }
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiArriving"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_arriving"
    },
    "pe_dpi_command": {
      "address": "pe/dpi/command",
      "description": "### Command Message\n\n| Field         | Value                                                                                    |\n| ------------- | ---------------------------------------------------------------------------------------- |\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/command                             |\n| Schema        | [ dpi-command.json ](json-schemas/pe/dpi/command/dpi-command.json)                       |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                    |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA |\n\nThis channel is highly unstable and should only be used by developers in TET.\n\nThis channel makes it possible for developers to debug the running application by providing real-time commands to it.\n\nThe results from each requested command is sent to pe/dpi/command_response.\n",
      "messages": {
        "DpiCommand": {
          "name": "DpiCommand",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/command/dpi-command.json",
              "type": "object",
              "title": "DpiCommand",
              "description": "Message sent to bus to control DPI functions",
              "required": [
                "eventTimestamp",
                "traceId",
                "clientId",
                "command"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "The timestamp when the message was created/sent",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier (UUIDv4) for this message"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "description": "Set this to \"*\" to send the command to all clients on the vehicle. If you want to target a specific client, put its clientId here."
                },
                "command": {
                  "$id": "#/properties/command",
                  "type": "string",
                  "description": "The command you want to send"
                },
                "args": {
                  "$id": "#/properties/args",
                  "type": "object",
                  "description": "Command arguments (if any)",
                  "additionalProperties": true
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Command",
              "payload": {
                "eventTimestamp": "2025-04-03T13:18:26.337178538Z",
                "traceId": "2fccd221-f879-43e8-9e45-62abf54a9688",
                "clientId": "*",
                "command": "GET_STATUS"
              }
            }
          ],
          "x-parser-unique-object-id": "DpiCommand"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_command"
    },
    "pe_dpi_command_response": {
      "address": "pe/dpi/command_response",
      "description": "### Command response message\n\nResponses generated from requests sent on `/pe/dpi/command`\n\n| Field         | Value                                                                                         |\n| ------------- | --------------------------------------------------------------------------------------------- |\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/command_response                         |\n| Schema        | [ dpi-command_response.json ](json-schemas/pe/dpi/command_response/dpi-command_response.json) |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                         |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA      |\n\nThis message is a response to another message sent on pe/dpi/command. It contains the result of the command.\n",
      "messages": {
        "DpiCommandResponse": {
          "name": "DpiCommandResponse",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/command_response/dpi-command_response.json",
              "type": "object",
              "title": "DpiCommandResponse",
              "description": "Message sent from vehicle as response to DPI commands",
              "required": [
                "eventTimestamp",
                "traceId",
                "correlationId",
                "command",
                "payload"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "The timestamp when the message was created/sent",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier (UUIDv4) for this message"
                },
                "correlationId": {
                  "$id": "#/properties/correlationId",
                  "type": "string",
                  "description": "The traceId in the command message that this message is responding to"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "description": "A unique identifier for the client. If you sent a command targeting \"*\" (all clients), this will be the clientId of the client that sent the command response.",
                  "examples": [
                    "53f93598-8e82-4a38-9def-10075d07bb33"
                  ],
                  "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                },
                "command": {
                  "$id": "#/properties/command",
                  "type": "string",
                  "description": "The command that was executed"
                },
                "payload": {
                  "$id": "#/properties/payload",
                  "type": "object",
                  "description": "Command response body",
                  "additionalProperties": true
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Command response",
              "payload": {
                "eventTimestamp": "2025-04-03T13:18:26.337178538Z",
                "traceId": "2fccd221-f879-43e8-9e45-62abf54a9688",
                "correlationId": "aeaa339e-cbd0-43d9-a4a8-7053d12e1a64",
                "clientId": "866f85ac-ab5a-48e2-b2db-5e9813e58a71",
                "command": "GET_FEATURES",
                "payload": {
                  "feature_1": false,
                  "feature_2": true
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiCommandResponse"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_command_response"
    },
    "pe_dpi_connection_status": {
      "address": "pe/dpi/connection_status",
      "description": "### Connection Status Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/connection_status                                            |\n| Schema        | [ dpi-connection-status.json ](json-schemas/pe/dpi/connection_status/dpi-connection-status.json)                  |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nConnection messages sent when the DPI client connects and disconnects from the MQTT broker. It is used to monitor the connection status of the DPI client and detect screens where the browser may be in restart loop.\n",
      "messages": {
        "DpiConnectionStatus": {
          "name": "DpiConnectionStatus",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/connection_status/dpi-connection-status.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "DpiConnectionStatus",
              "type": "object",
              "required": [
                "eventTimestamp",
                "clientId",
                "connected"
              ],
              "description": "DPI Connection status topic",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "Timestamp indicating when the client was last loaded (not when this message was sent)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier (UUIDv4) for this message"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "title": "Screen id",
                  "examples": [
                    "ad71dba8-c881-11e8-a8d5-f2801f1b9fd1"
                  ],
                  "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                },
                "connected": {
                  "$id": "#/properties/connected",
                  "type": "boolean",
                  "description": "Whether the screen is connected or disconnected",
                  "examples": [
                    "true",
                    "false"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "Connection Status disconnected",
              "payload": {
                "eventTimestamp": "2018-10-31T12:45:45Z",
                "traceId": "2de04b7c-321a-4ad2-b545-b8cb971e0550",
                "clientId": "ad71dba8-c881-11e8-a8d5-f2801f1b9fd1",
                "connected": false
              }
            },
            {
              "name": "Connection Status connected",
              "payload": {
                "eventTimestamp": "2018-10-31T12:45:45Z",
                "traceId": "2de04b7c-321a-4ad2-b545-b8cb971e0550",
                "clientId": "ad71dba8-c881-11e8-a8d5-f2801f1b9fd1",
                "connected": true
              }
            }
          ],
          "x-parser-unique-object-id": "DpiConnectionStatus"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_connection_status"
    },
    "pe_dpi_connections": {
      "address": "pe/dpi/connections",
      "description": "### Connections Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/connections                                                  |\n| Schema        | [ dpi-connections.json ](json-schemas/pe/dpi/connections/dpi-connections.json)                                    |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nList of connections for the remaining stops on a journey with expected departures.\n",
      "messages": {
        "DpiConnections": {
          "name": "DpiConnections",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/connections/dpi-connections.json",
              "type": "object",
              "title": "DpiConnections",
              "description": "This schema defines the connection message sent as an MQTT message to buses",
              "required": [
                "eventTimestamp",
                "traceId",
                "expiryTimestamp",
                "nextStop",
                "journeyId",
                "routeId",
                "calls"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "examples": [
                    "2020-03-10T20:56:44.864401Z"
                  ]
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "expiryTimestamp": {
                  "$id": "#/properties/expiryTimestamp",
                  "type": "string",
                  "description": "Timestamp As specified in the [ADT documentation.](https://adt.transhub.io), after which this message is invalid"
                },
                "nextStop": {
                  "$id": "#/properties/nextStop",
                  "type": "object",
                  "title": "The Next Stop Schema",
                  "description": "The ids of the next stop that this message is valid for",
                  "default": {},
                  "required": [
                    "stopPlaceId",
                    "quayId"
                  ],
                  "properties": {
                    "stopPlaceId": {
                      "$id": "#/properties/nextStop/properties/stopPlaceId",
                      "type": "string",
                      "description": "NSR stop place id for the next stop",
                      "examples": [
                        "NSR:StopPlace:3799"
                      ]
                    },
                    "quayId": {
                      "$id": "#/properties/nextStop/properties/quayId",
                      "type": "string",
                      "description": "NSR quay id for the next stop",
                      "examples": [
                        "NSR:Quay:6801"
                      ]
                    }
                  }
                },
                "journeyId": {
                  "$id": "#/properties/journeyId",
                  "type": "string",
                  "description": "An explanation about the purpose of this instance.",
                  "examples": [
                    "RUT:ServiceJourney:160-137140-16254500"
                  ]
                },
                "routeId": {
                  "$id": "#/properties/routeId",
                  "type": "string",
                  "description": "The route id, which corresponds to the route id in the journey message",
                  "examples": [
                    "RUT:Route:160-3504"
                  ]
                },
                "calls": {
                  "$id": "#/properties/calls",
                  "type": "array",
                  "description": "An array of the remaining calls on a journey, including the current next stop",
                  "items": {
                    "$id": "#/properties/calls/items",
                    "type": "object",
                    "title": "The Call Schema",
                    "description": "A future call on a journey that collects connections",
                    "required": [
                      "name",
                      "stopPlaceId",
                      "quayId",
                      "index",
                      "connections"
                    ],
                    "properties": {
                      "name": {
                        "$id": "#/properties/calls/items/properties/name",
                        "type": "string",
                        "description": "Name of stop place (optional)",
                        "default": null,
                        "examples": [
                          "Kveldsroveien"
                        ]
                      },
                      "stopPlaceId": {
                        "$id": "#/properties/calls/items/properties/stopPlaceId",
                        "type": "string",
                        "description": "NSR stop place id",
                        "examples": [
                          "NSR:StopPlace:3799"
                        ]
                      },
                      "quayId": {
                        "$id": "#/properties/calls/items/properties/quayId",
                        "type": "string",
                        "description": "NSR quay id",
                        "examples": [
                          "NSR:Quay:6801"
                        ]
                      },
                      "index": {
                        "$id": "#/properties/calls/items/properties/index",
                        "type": "integer",
                        "description": "Index to stop's position in the journey"
                      },
                      "connections": {
                        "$id": "#/properties/calls/items/properties/connections",
                        "type": "array",
                        "description": "A list of connections by line/direction",
                        "items": {
                          "$id": "#/properties/calls/items/properties/connections/items",
                          "type": "object",
                          "title": "The Connection Schema",
                          "description": "A connection for a given line/direction",
                          "required": [
                            "line",
                            "direction",
                            "departures"
                          ],
                          "properties": {
                            "line": {
                              "$id": "#/properties/calls/items/properties/connections/items/properties/line",
                              "type": "object",
                              "title": "The Line Schema",
                              "description": "Line information",
                              "required": [
                                "id",
                                "publicCode",
                                "transportMode"
                              ],
                              "properties": {
                                "id": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/line/properties/id",
                                  "type": "string",
                                  "description": "PTA's id for the line",
                                  "examples": [
                                    "RUT:Line:31"
                                  ]
                                },
                                "publicCode": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/line/properties/publicCode",
                                  "type": "string",
                                  "description": "The publically visible identifier for this line",
                                  "examples": [
                                    "31"
                                  ]
                                },
                                "transportMode": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/line/properties/transportMode",
                                  "type": "string",
                                  "description": "Transport mode",
                                  "examples": [
                                    "bus"
                                  ]
                                }
                              }
                            },
                            "direction": {
                              "$id": "#/properties/calls/items/properties/connections/items/properties/direction",
                              "type": "string",
                              "description": "An indicator of direction for a line",
                              "examples": [
                                "1",
                                "2"
                              ]
                            },
                            "quay": {
                              "$id": "#/properties/calls/items/properties/connections/items/properties/quay",
                              "type": "object",
                              "title": "The Quay Schema",
                              "description": "Information about where the connection departs from",
                              "required": [
                                "id"
                              ],
                              "properties": {
                                "id": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/quay/properties/id",
                                  "type": "string",
                                  "description": "NSR id for the quay",
                                  "examples": [
                                    "NSR:Quay:3131"
                                  ]
                                },
                                "publicCode": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/quay/properties/publicCode",
                                  "type": "string",
                                  "description": "The publically visible identifier for this quay",
                                  "examples": [
                                    "A"
                                  ]
                                },
                                "description": {
                                  "$id": "#/properties/calls/items/properties/connections/items/properties/quay/properties/description",
                                  "type": "string",
                                  "description": "Description of where quay is located",
                                  "examples": [
                                    "I Kirkeveien"
                                  ]
                                }
                              }
                            },
                            "departures": {
                              "$id": "#/properties/calls/items/properties/connections/items/properties/departures",
                              "type": "array",
                              "description": "A list of departures for the line/direction (empty if there are none)",
                              "items": {
                                "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items",
                                "type": "object",
                                "title": "The Departure Schema",
                                "description": "Information about a departure",
                                "required": [
                                  "destination",
                                  "text"
                                ],
                                "properties": {
                                  "destination": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/destination",
                                    "type": "string",
                                    "description": "Visible destination of bus",
                                    "examples": [
                                      "Bygdøy"
                                    ]
                                  },
                                  "via": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/destination/via",
                                    "type": "string",
                                    "description": "Visible via information of bus (optional)",
                                    "examples": [
                                      "Bydøysnes"
                                    ]
                                  },
                                  "text": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/display",
                                    "type": "string",
                                    "description": "Display text for departure time",
                                    "examples": [
                                      "5 min",
                                      "14:55"
                                    ]
                                  },
                                  "departureTime": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/departureTime",
                                    "type": "string",
                                    "description": "Expected departure time for UTC in ISO 8601 date/time format",
                                    "examples": [
                                      "2020-03-10T21:02:00Z"
                                    ]
                                  },
                                  "delay": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/delay",
                                    "type": "string",
                                    "description": "Recorded delay for the departure in ISO 8601 duration format",
                                    "examples": [
                                      "PT0S"
                                    ]
                                  },
                                  "journeyId": {
                                    "$id": "#/properties/calls/items/properties/connections/items/properties/departures/items/properties/journeyId",
                                    "type": "string",
                                    "description": "Journey id of the bus making the call",
                                    "examples": [
                                      "RUT:ServiceJourney:31-138571-15639955"
                                    ]
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Connections",
              "payload": {
                "eventTimestamp": "2017-10-31T12:45:50.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "expiryTimestamp": "2020-03-16T14:35:08.762206Z",
                "nextStop": {
                  "stopPlaceId": "NSR:StopPlace:6498",
                  "quayId": "NSR:Quay:11950"
                },
                "journeyId": "RUT:ServiceJourney:60-138542-15631728",
                "routeId": "RUT:Route:60-4",
                "calls": [
                  {
                    "name": "Tøyenkirken",
                    "stopPlaceId": "NSR:StopPlace:6498",
                    "quayId": "NSR:Quay:11950",
                    "index": 4,
                    "connections": []
                  },
                  {
                    "name": "Tøyen skole",
                    "stopPlaceId": "NSR:StopPlace:6480",
                    "quayId": "NSR:Quay:11910",
                    "index": 5,
                    "connections": []
                  },
                  {
                    "name": "Tøyen",
                    "stopPlaceId": "NSR:StopPlace:6478",
                    "quayId": "NSR:Quay:11908",
                    "index": 6,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:20",
                          "publicCode": "20",
                          "transportMode": "bus"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Galgeberg",
                            "text": "5 min",
                            "departureTime": "2020-03-16T14:35:37Z",
                            "delay": "PT1M37S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685688"
                          },
                          {
                            "destination": "Galgeberg",
                            "text": "10 min",
                            "departureTime": "2020-03-16T14:40:58Z",
                            "delay": "PT1M58S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685689"
                          },
                          {
                            "destination": "Galgeberg",
                            "text": "15:45",
                            "departureTime": "2020-03-16T14:45:09Z",
                            "delay": "PT1M9S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685690"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:20",
                          "publicCode": "20",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11906",
                          "description": "i Kjølberggata"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Skøyen",
                            "text": "3 min",
                            "departureTime": "2020-03-16T14:34:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685534"
                          },
                          {
                            "destination": "Skøyen",
                            "text": "8 min",
                            "departureTime": "2020-03-16T14:39:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685535"
                          },
                          {
                            "destination": "Skøyen",
                            "text": "13 min",
                            "departureTime": "2020-03-16T14:44:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685536"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Brinken",
                    "stopPlaceId": "NSR:StopPlace:6562",
                    "quayId": "NSR:Quay:12119",
                    "index": 7,
                    "connections": []
                  },
                  {
                    "name": "Kampen kirke",
                    "stopPlaceId": "NSR:StopPlace:6564",
                    "quayId": "NSR:Quay:12123",
                    "index": 8,
                    "connections": []
                  },
                  {
                    "name": "Kampen park",
                    "stopPlaceId": "NSR:StopPlace:6571",
                    "quayId": "NSR:Quay:12135",
                    "index": 9,
                    "connections": []
                  },
                  {
                    "name": "Ensjøveien",
                    "stopPlaceId": "NSR:StopPlace:6046",
                    "quayId": "NSR:Quay:11097",
                    "index": 10,
                    "connections": []
                  },
                  {
                    "name": "Tøyen stasjon",
                    "stopPlaceId": "NSR:StopPlace:6044",
                    "quayId": "NSR:Quay:11092",
                    "index": 11,
                    "connections": []
                  },
                  {
                    "name": "Hasle kirke",
                    "stopPlaceId": "NSR:StopPlace:6049",
                    "quayId": "NSR:Quay:11101",
                    "index": 12,
                    "connections": []
                  },
                  {
                    "name": "Hasle",
                    "stopPlaceId": "NSR:StopPlace:6031",
                    "quayId": "NSR:Quay:11076",
                    "index": 13,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:21",
                          "publicCode": "21",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11069",
                          "publicCode": "D"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Helsfyr T",
                            "text": "13 min",
                            "departureTime": "2020-03-16T14:44:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685155"
                          },
                          {
                            "destination": "Helsfyr T",
                            "text": "15:49",
                            "departureTime": "2020-03-16T14:49:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685156"
                          },
                          {
                            "destination": "Helsfyr T",
                            "text": "15:54",
                            "departureTime": "2020-03-16T14:54:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685157"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:21",
                          "publicCode": "21",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11070",
                          "publicCode": "C"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Tjuvholmen",
                            "text": "13 min",
                            "departureTime": "2020-03-16T14:44:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685274"
                          },
                          {
                            "destination": "Tjuvholmen",
                            "text": "15:49",
                            "departureTime": "2020-03-16T14:49:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685275"
                          },
                          {
                            "destination": "Tjuvholmen",
                            "text": "15:54",
                            "departureTime": "2020-03-16T14:54:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:21-131531-15685276"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:28",
                          "publicCode": "28",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11075",
                          "publicCode": "B"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Fornebu",
                            "text": "15:47",
                            "departureTime": "2020-03-16T14:47:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685026"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "15:54",
                            "departureTime": "2020-03-16T14:54:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685039"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:02",
                            "departureTime": "2020-03-16T15:02:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685027"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:28",
                          "publicCode": "28",
                          "transportMode": "bus"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Økern T",
                            "text": "15:48",
                            "departureTime": "2020-03-16T14:48:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685014"
                          },
                          {
                            "destination": "Økern T",
                            "text": "15:57",
                            "departureTime": "2020-03-16T14:57:43Z",
                            "delay": "PT1M43S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685006"
                          },
                          {
                            "destination": "Økern T",
                            "text": "16:03",
                            "departureTime": "2020-03-16T15:03:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685015"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Haslevangen",
                    "stopPlaceId": "NSR:StopPlace:6036",
                    "quayId": "NSR:Quay:11080",
                    "index": 14,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:28",
                          "publicCode": "28",
                          "transportMode": "bus"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Økern T",
                            "text": "15:49",
                            "departureTime": "2020-03-16T14:49:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685014"
                          },
                          {
                            "destination": "Økern T",
                            "text": "15:58",
                            "departureTime": "2020-03-16T14:58:43Z",
                            "delay": "PT1M43S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685006"
                          },
                          {
                            "destination": "Økern T",
                            "text": "16:04",
                            "departureTime": "2020-03-16T15:04:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685015"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:28",
                          "publicCode": "28",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11079"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Fornebu",
                            "text": "15:46",
                            "departureTime": "2020-03-16T14:46:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685026"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "15:53",
                            "departureTime": "2020-03-16T14:53:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685039"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:01",
                            "departureTime": "2020-03-16T15:01:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685027"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Økern",
                    "stopPlaceId": "NSR:StopPlace:5907",
                    "quayId": "NSR:Quay:10835",
                    "index": 15,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:23",
                          "publicCode": "23",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10834",
                          "publicCode": "B"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Simensbråten",
                            "text": "15:55",
                            "departureTime": "2020-03-16T14:55:18Z",
                            "delay": "PT18S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794834"
                          },
                          {
                            "destination": "Simensbråten",
                            "text": "16:05",
                            "departureTime": "2020-03-16T15:05:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794835"
                          },
                          {
                            "destination": "Simensbråten",
                            "text": "16:15",
                            "departureTime": "2020-03-16T15:15:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794836"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:23",
                          "publicCode": "23",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10832",
                          "publicCode": "A"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Lysaker",
                            "text": "16:06",
                            "departureTime": "2020-03-16T15:06:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794741"
                          },
                          {
                            "destination": "Lysaker",
                            "text": "15:56",
                            "departureTime": "2020-03-16T14:56:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794740"
                          },
                          {
                            "destination": "Lysaker",
                            "text": "16:16",
                            "departureTime": "2020-03-16T15:16:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:23-137908-16794742"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:24",
                          "publicCode": "24",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10834",
                          "publicCode": "B"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Brynseng T",
                            "text": "15:55",
                            "departureTime": "2020-03-16T14:55:46Z",
                            "delay": "PT5M46S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794944"
                          },
                          {
                            "destination": "Brynseng T",
                            "text": "16:00",
                            "departureTime": "2020-03-16T15:00:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794945"
                          },
                          {
                            "destination": "Brynseng T",
                            "text": "16:10",
                            "departureTime": "2020-03-16T15:10:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794946"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:24",
                          "publicCode": "24",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10832",
                          "publicCode": "A"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Fornebu",
                            "text": "16:11",
                            "departureTime": "2020-03-16T15:11:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794982"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:41",
                            "departureTime": "2020-03-16T15:41:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794985"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:31",
                            "departureTime": "2020-03-16T15:31:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:24-137908-16794984"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:28",
                          "publicCode": "28",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10832",
                          "publicCode": "A"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Fornebu",
                            "text": "16:43",
                            "departureTime": "2020-03-16T15:43:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685030"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:05",
                            "departureTime": "2020-03-16T15:05:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685040"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:35",
                            "departureTime": "2020-03-16T15:35:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:28-131531-15685042"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:345",
                          "publicCode": "345",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Vestvollen",
                            "text": "15:50",
                            "departureTime": "2020-03-16T14:50:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:345-138458-16752823"
                          },
                          {
                            "destination": "Vestvollen",
                            "text": "16:00",
                            "departureTime": "2020-03-16T15:00:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:345-138458-16752806"
                          },
                          {
                            "destination": "Vestvollen",
                            "text": "16:01",
                            "departureTime": "2020-03-16T15:01:22Z",
                            "delay": "PT21M22S",
                            "journeyId": "RUT:ServiceJourney:345-138458-16752805"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:67",
                          "publicCode": "67",
                          "transportMode": "bus"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Lørenskog sentrum",
                            "text": "15:51",
                            "departureTime": "2020-03-16T14:51:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:67-138542-15631987"
                          },
                          {
                            "destination": "Lørenskog sentrum",
                            "text": "16:01",
                            "departureTime": "2020-03-16T15:01:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:67-138542-15631988"
                          },
                          {
                            "destination": "Lørenskog sentrum",
                            "text": "16:11",
                            "departureTime": "2020-03-16T15:11:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:67-138542-15631989"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Økern næringspark",
                    "stopPlaceId": "NSR:StopPlace:5916",
                    "quayId": "NSR:Quay:10849",
                    "index": 16,
                    "connections": []
                  },
                  {
                    "name": "Lånekassen",
                    "stopPlaceId": "NSR:StopPlace:5918",
                    "quayId": "NSR:Quay:10852",
                    "index": 17,
                    "connections": []
                  },
                  {
                    "name": "Nedre Risløkka",
                    "stopPlaceId": "NSR:StopPlace:5928",
                    "quayId": "NSR:Quay:10872",
                    "index": 18,
                    "connections": []
                  },
                  {
                    "name": "Rabbeveien",
                    "stopPlaceId": "NSR:StopPlace:5930",
                    "quayId": "NSR:Quay:10875",
                    "index": 19,
                    "connections": []
                  },
                  {
                    "name": "Anton Tschudis vei",
                    "stopPlaceId": "NSR:StopPlace:5932",
                    "quayId": "NSR:Quay:10878",
                    "index": 20,
                    "connections": []
                  },
                  {
                    "name": "Kroklia",
                    "stopPlaceId": "NSR:StopPlace:5941",
                    "quayId": "NSR:Quay:10894",
                    "index": 21,
                    "connections": []
                  },
                  {
                    "name": "Øvre Risløkka",
                    "stopPlaceId": "NSR:StopPlace:5943",
                    "quayId": "NSR:Quay:10898",
                    "index": 22,
                    "connections": []
                  },
                  {
                    "name": "Økernbråten",
                    "stopPlaceId": "NSR:StopPlace:5945",
                    "quayId": "NSR:Quay:10902",
                    "index": 23,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:58",
                          "publicCode": "58",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10901"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Tveita T",
                            "text": "15:57",
                            "departureTime": "2020-03-16T14:57:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:58-138542-17261911"
                          },
                          {
                            "destination": "Tveita T",
                            "text": "16:12",
                            "departureTime": "2020-03-16T15:12:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:58-138542-17261912"
                          },
                          {
                            "destination": "Tveita T",
                            "text": "16:27",
                            "departureTime": "2020-03-16T15:27:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:58-138542-17261913"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Linne hotell",
                    "stopPlaceId": "NSR:StopPlace:5952",
                    "quayId": "NSR:Quay:10916",
                    "index": 24,
                    "connections": []
                  },
                  {
                    "name": "Linderud T",
                    "stopPlaceId": "NSR:StopPlace:5950",
                    "quayId": "NSR:Quay:10911",
                    "index": 25,
                    "connections": []
                  },
                  {
                    "name": "Veitvetstubben",
                    "stopPlaceId": "NSR:StopPlace:5967",
                    "quayId": "NSR:Quay:10946",
                    "index": 26,
                    "connections": []
                  },
                  {
                    "name": "Linderud senter",
                    "stopPlaceId": "NSR:StopPlace:5974",
                    "quayId": "NSR:Quay:10960",
                    "index": 27,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10959"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:02",
                            "departureTime": "2020-03-16T15:02:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843154"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:09",
                            "departureTime": "2020-03-16T15:09:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843009"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843010"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10959"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Grorud T",
                            "text": "16:04",
                            "departureTime": "2020-03-16T15:04:11Z",
                            "delay": "PT2M11S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639652"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:12",
                            "departureTime": "2020-03-16T15:12:01Z",
                            "delay": "PT1H10M1S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639647"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:14",
                            "departureTime": "2020-03-16T15:14:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639653"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10959"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:03",
                            "departureTime": "2020-03-16T15:03:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632327"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:18",
                            "departureTime": "2020-03-16T15:18:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632328"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:33",
                            "departureTime": "2020-03-16T15:33:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632329"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Linderudsletta",
                    "stopPlaceId": "NSR:StopPlace:5972",
                    "quayId": "NSR:Quay:10956",
                    "index": 28,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Majorstuen",
                            "text": "16:01",
                            "departureTime": "2020-03-16T15:01:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843093"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:09",
                            "departureTime": "2020-03-16T15:09:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843094"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:16",
                            "departureTime": "2020-03-16T15:16:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843170"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Snarøya",
                            "text": "16:07",
                            "departureTime": "2020-03-16T15:07:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639845"
                          },
                          {
                            "destination": "Snarøya",
                            "text": "16:19",
                            "departureTime": "2020-03-16T15:19:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639846"
                          },
                          {
                            "destination": "Snarøya",
                            "text": "16:27",
                            "departureTime": "2020-03-16T15:27:31Z",
                            "delay": "PT56M31S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639842"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:2031",
                          "publicCode": "31E",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10950"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Kalbakken",
                            "text": "16:03",
                            "departureTime": "2020-03-16T15:03:55Z",
                            "delay": "PT1M55S",
                            "journeyId": "RUT:ServiceJourney:2031-138571-15640592"
                          },
                          {
                            "destination": "Kalbakken",
                            "text": "16:12",
                            "departureTime": "2020-03-16T15:12:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:2031-138571-15640593"
                          },
                          {
                            "destination": "Kalbakken",
                            "text": "16:22",
                            "departureTime": "2020-03-16T15:22:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:2031-138571-15640594"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Filipstad",
                            "text": "16:09",
                            "departureTime": "2020-03-16T15:09:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632358"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:24",
                            "departureTime": "2020-03-16T15:24:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632359"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:39",
                            "departureTime": "2020-03-16T15:39:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632360"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:380",
                          "publicCode": "380",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10955"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659813"
                          },
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:37",
                            "departureTime": "2020-03-16T15:37:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659814"
                          },
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:57",
                            "departureTime": "2020-03-16T15:57:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659815"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:380",
                          "publicCode": "380",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10950"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Lillestrøm",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659969"
                          },
                          {
                            "destination": "Lillestrøm",
                            "text": "16:37",
                            "departureTime": "2020-03-16T15:37:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659970"
                          },
                          {
                            "destination": "Lillestrøm",
                            "text": "16:57",
                            "departureTime": "2020-03-16T15:57:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:380-136266-16659971"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:390",
                          "publicCode": "390",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10950"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Kongskog",
                            "text": "16:08",
                            "departureTime": "2020-03-16T15:08:19Z",
                            "delay": "PT42M19S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660240"
                          },
                          {
                            "destination": "Nittedal sentrum",
                            "text": "16:16",
                            "departureTime": "2020-03-16T15:16:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660219"
                          },
                          {
                            "destination": "Nittedal sentrum",
                            "text": "16:46",
                            "departureTime": "2020-03-16T15:46:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660220"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:390",
                          "publicCode": "390",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10955"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:03",
                            "departureTime": "2020-03-16T15:03:04Z",
                            "delay": "PT1M4S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660178"
                          },
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660203"
                          },
                          {
                            "destination": "Oslo bussterminal",
                            "text": "16:32",
                            "departureTime": "2020-03-16T15:32:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:390-136266-16660179"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Kolåsbakken",
                    "stopPlaceId": "NSR:StopPlace:5978",
                    "quayId": "NSR:Quay:10969",
                    "index": 29,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10968"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:01",
                            "departureTime": "2020-03-16T15:01:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843154"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:08",
                            "departureTime": "2020-03-16T15:08:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843009"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:16",
                            "departureTime": "2020-03-16T15:16:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843010"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Majorstuen",
                            "text": "16:02",
                            "departureTime": "2020-03-16T15:02:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843093"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:10",
                            "departureTime": "2020-03-16T15:10:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843094"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843170"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10968"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Grorud T",
                            "text": "16:02",
                            "departureTime": "2020-03-16T15:02:05Z",
                            "delay": "PT1M5S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639652"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:11",
                            "departureTime": "2020-03-16T15:11:01Z",
                            "delay": "PT1H10M1S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639647"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:14",
                            "departureTime": "2020-03-16T15:14:24Z",
                            "delay": "PT1M24S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639653"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Snarøya",
                            "text": "16:08",
                            "departureTime": "2020-03-16T15:08:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639845"
                          },
                          {
                            "destination": "Snarøya",
                            "text": "16:20",
                            "departureTime": "2020-03-16T15:20:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639846"
                          },
                          {
                            "destination": "Snarøya",
                            "text": "16:28",
                            "departureTime": "2020-03-16T15:28:31Z",
                            "delay": "PT56M31S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639842"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Filipstad",
                            "text": "16:09",
                            "departureTime": "2020-03-16T15:09:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632358"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:24",
                            "departureTime": "2020-03-16T15:24:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632359"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:39",
                            "departureTime": "2020-03-16T15:39:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632360"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:10968"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:03",
                            "departureTime": "2020-03-16T15:03:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632327"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:18",
                            "departureTime": "2020-03-16T15:18:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632328"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:33",
                            "departureTime": "2020-03-16T15:33:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632329"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "Tonsenhagen",
                    "stopPlaceId": "NSR:StopPlace:6008",
                    "quayId": "NSR:Quay:11023",
                    "index": 30,
                    "connections": [
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Majorstuen",
                            "text": "16:19",
                            "departureTime": "2020-03-16T15:19:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843170"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:35",
                            "departureTime": "2020-03-16T15:35:36Z",
                            "delay": "PT1M36S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843096"
                          },
                          {
                            "destination": "Majorstuen",
                            "text": "16:42",
                            "departureTime": "2020-03-16T15:42:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843097"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:25",
                          "publicCode": "25",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11024"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:15",
                            "departureTime": "2020-03-16T15:15:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843010"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:37",
                            "departureTime": "2020-03-16T15:37:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843012"
                          },
                          {
                            "destination": "Lørenskog stasjon",
                            "text": "16:45",
                            "departureTime": "2020-03-16T15:45:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:25-138571-16843013"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Fornebu",
                            "text": "16:04",
                            "departureTime": "2020-03-16T15:04:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639929"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "17:04",
                            "departureTime": "2020-03-16T16:04:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639934"
                          },
                          {
                            "destination": "Fornebu",
                            "text": "16:28",
                            "departureTime": "2020-03-16T15:28:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639931"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:31",
                          "publicCode": "31",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11024"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Grorud T",
                            "text": "16:48",
                            "departureTime": "2020-03-16T15:48:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639656"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:12",
                            "departureTime": "2020-03-16T15:12:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639653"
                          },
                          {
                            "destination": "Grorud T",
                            "text": "16:58",
                            "departureTime": "2020-03-16T15:58:28Z",
                            "delay": "PT22M28S",
                            "journeyId": "RUT:ServiceJourney:31-138571-15639655"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "quay": {
                          "id": "NSR:Quay:11024"
                        },
                        "direction": "1",
                        "departures": [
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:17",
                            "departureTime": "2020-03-16T15:17:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632328"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "17:02",
                            "departureTime": "2020-03-16T16:02:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632331"
                          },
                          {
                            "destination": "Ellingsrudåsen T",
                            "text": "16:32",
                            "departureTime": "2020-03-16T15:32:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632329"
                          }
                        ]
                      },
                      {
                        "line": {
                          "id": "RUT:Line:33",
                          "publicCode": "33",
                          "transportMode": "bus"
                        },
                        "direction": "2",
                        "departures": [
                          {
                            "destination": "Filipstad",
                            "text": "16:10",
                            "departureTime": "2020-03-16T15:10:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632358"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:40",
                            "departureTime": "2020-03-16T15:40:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632360"
                          },
                          {
                            "destination": "Filipstad",
                            "text": "16:25",
                            "departureTime": "2020-03-16T15:25:00Z",
                            "delay": "PT0S",
                            "journeyId": "RUT:ServiceJourney:33-138542-15632359"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "DpiConnections"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_connections"
    },
    "pe_dpi_diagnostics": {
      "address": "pe/dpi/diagnostics",
      "description": "### Diagnostics Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/diagnostics                                                  |\n| Schema        | [ dpi-diagnostics.json ](json-schemas/pe/dpi/diagnostics/dpi-diagnostics.json)                                    |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nReport to PTA BO about a screen.\n\nThe DPI application itself produces diagnostic messages.\nThe payload is defined as an object with no pre-defined structure to provide flexibility.\n",
      "messages": {
        "DpiDiagnostics": {
          "name": "DpiDiagnostics",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/diagnostics/dpi-diagnostics.json",
              "type": "object",
              "title": "DpiDiagnostics",
              "required": [
                "eventTimestamp",
                "traceId",
                "clientId",
                "type"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "title": "Screen id",
                  "examples": [
                    "ad71dba8-c881-11e8-a8d5-f2801f1b9fd1"
                  ],
                  "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                },
                "type": {
                  "$id": "#/properties/type",
                  "type": "string",
                  "description": "Diagnostics type",
                  "examples": [
                    "INFO",
                    "HEARTBEAT",
                    "ERROR",
                    "STATISTICS",
                    "SCREEN"
                  ]
                },
                "payload": {
                  "$id": "#/properties/payload",
                  "type": "object",
                  "description": "Diagnostics payload, a dictionary of key/values"
                }
              }
            }
          },
          "examples": [
            {
              "name": "Diagnostics Heartbeat",
              "payload": {
                "eventTimestamp": "2019-10-09T10:16:07.000Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "clientId": "638f47b7-d0d4-4043-9125-2dd8db6b8a84",
                "type": "HEARTBEAT",
                "payload": {
                  "client": {
                    "version": "2019-08-16T08-11-58Z",
                    "display": "1",
                    "windowHeight": 1080,
                    "windowWidth": 1920
                  },
                  "routeId": "RUT:Route:0-54012"
                }
              }
            },
            {
              "name": "DPI Diagnostics",
              "payload": {
                "eventTimestamp": "2018-10-31T12:45:50.010Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "clientId": "ad71dba8-c881-11e8-a8d5-f2801f1b9fd1",
                "type": "STATUS",
                "payload": {
                  "version": {
                    "application": "2018-10-03T12:45:50Z",
                    "media": "2018-10-05T12:45:50Z"
                  },
                  "display": {
                    "type": "1",
                    "res": {
                      "height": 360,
                      "width": 1080
                    }
                  },
                  "stats": {
                    "logEntries": {
                      "error": 0,
                      "warning": 14,
                      "info": 123
                    },
                    "lastLoaded": "2018-10-31T12:45:45Z",
                    "pingFreq": 3600,
                    "usedStorage": "124kb"
                  }
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiDiagnostics"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_diagnostics"
    },
    "pe_dpi_display_status": {
      "address": "pe/dpi/display_status",
      "description": "### DPI Display Status\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/display_status                                       |\n| Schema        | [ dpi-display-status.json ](json-schemas/pe/dpi/display_status/dpi-display-status.json)                   |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Consumer      | PTO, [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nThe DPI Display status topic is used to inform the Ruter BO about the current state (Tilstandsmelding) for DPI.\n\nThis messages is produced every fifth minute and every time a message is received on `pe/dpi/journey` and used in SLA measurement. \n",
      "messages": {
        "DpiDisplayStatus": {
          "name": "DpiDisplayStatus",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/display_status/dpi-display-status.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "DpiDisplayStatus",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "type",
                "browser",
                "client",
                "journey"
              ],
              "description": "DPI Display status topic",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "type": {
                  "$id": "#/properties/type",
                  "type": "string",
                  "description": "Type of status message"
                },
                "browser": {
                  "$id": "#/properties/browser",
                  "type": "object",
                  "properties": {
                    "userAgent": {
                      "type": "string",
                      "description": "Browser user agent string",
                      "x-parser-schema-id": "<anonymous-schema-9>"
                    }
                  },
                  "required": [
                    "userAgent"
                  ]
                },
                "client": {
                  "$id": "#/properties/client",
                  "type": "object",
                  "properties": {
                    "url": {
                      "type": "string",
                      "description": "Current url for screen",
                      "x-parser-schema-id": "<anonymous-schema-10>"
                    },
                    "version": {
                      "type": "string",
                      "description": "Current dpi client version",
                      "x-parser-schema-id": "<anonymous-schema-11>"
                    },
                    "screenTypeId": {
                      "type": "string",
                      "description": "The screen type being used on the client that sent this message",
                      "x-parser-schema-id": "<anonymous-schema-12>"
                    },
                    "clientId": {
                      "type": "string",
                      "description": "The mqtt clientId of the client receiving the message. Should be a stable UUID v4 and not change",
                      "x-parser-schema-id": "<anonymous-schema-13>"
                    },
                    "physicalId": {
                      "type": "string",
                      "description": "The given physical id to the screen. The property is provided by a querystring when configuring a screen",
                      "x-parser-schema-id": "<anonymous-schema-14>"
                    },
                    "connectivity": {
                      "type": "string",
                      "description": "If the browser has internet connection",
                      "enum": [
                        "ONLINE",
                        "OFFLINE",
                        "UNKNOWN"
                      ],
                      "x-parser-schema-id": "<anonymous-schema-15>"
                    }
                  },
                  "required": [
                    "url",
                    "version",
                    "screenTypeId",
                    "clientId",
                    "connectivity"
                  ]
                },
                "media": {
                  "$id": "#/properties/media",
                  "type": "object",
                  "properties": {
                    "version": {
                      "type": "string",
                      "description": "Current dpi media version",
                      "x-parser-schema-id": "<anonymous-schema-16>"
                    }
                  },
                  "required": [
                    "version"
                  ]
                },
                "journey": {
                  "$id": "#/properties/journey",
                  "type": "object",
                  "properties": {
                    "traceId": {
                      "type": "string",
                      "description": "TraceId from the latest received journey message",
                      "x-parser-schema-id": "<anonymous-schema-17>"
                    },
                    "journeyRef": {
                      "type": "string",
                      "description": "Journey ref from the latest received journey message",
                      "x-parser-schema-id": "<anonymous-schema-18>"
                    },
                    "assignmentId": {
                      "type": "string",
                      "description": "Assignment id from the latest received journey message",
                      "x-parser-schema-id": "<anonymous-schema-19>"
                    }
                  },
                  "required": [
                    "traceId",
                    "journeyRef",
                    "assignmentId"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Display Status",
              "payload": {
                "eventTimestamp": "2025-05-20T15:45:22.789Z",
                "traceId": "cd5cfa81-8e44-4205-b6be-a753259b8976",
                "type": "DISPLAY_STATUS",
                "browser": {
                  "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
                },
                "client": {
                  "url": "http://webserver.local/app?clientId=bdfc2922-38e6-4dec-9421-da902277e645&physicalId=127.0.0.1#/display/1",
                  "version": "2025-05-12T08-21-51Z",
                  "screenTypeId": "1",
                  "clientId": "bdfc2922-38e6-4dec-9421-da902277e645",
                  "physicalId": "127.0.0.1",
                  "connectivity": "ONLINE"
                },
                "media": {
                  "version": "2025-05-14T10:17:21Z"
                },
                "journey": {
                  "traceId": "550e8400-e29b-41d4-a716-446655440002",
                  "journeyRef": "820-2025-05-20T07:45:00+02:00",
                  "assignmentId": "ab599917ed214472a40c79c18e6cb6b0"
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiDisplayStatus"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_display_status"
    },
    "pe_dpi_emergency": {
      "address": "pe/dpi/emergency",
      "description": "### Emergency Message To Passengers\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/emergency                                            |\n| Schema        | [ emergency.json ](json-schemas/pe/dpi/emergency/emergency.json)                                          |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Producer      | M4 / MADT                                                                                                  |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nSporveien is required to provide the public with an evacuation message in case an emergency occurs. This message overrides the display on Ruter's DPI screens onboard the vehicle.\n\nThis message is among those that will be sent by the MADT when the driver has selected an \"Emergency message\". It will often be sent together with `pe/audio` (one of several pre-recorded audio messages stored onboard in a configuration file for the MADT). This message, and an audio message, must be sent repeatedly by the MADT every X seconds (where X is a configurable setting from the message definition file), until the driver disables the emergency message. Some of the emergency messages contain external signage which is to override whatever is currently set.\n\nThe message is broadcast from the MADT. The consumer is Ruter's DPI application running in browser in displays onboard the vehicle. The message direction is \"out\", because the message should be forwarded from the vehicle to the backoffice systems, as the driver triggering an emergency is important information to keep track of.\n\nIt is expected that the MADT will send one message to enable the emergency message. When the driver cancels the emergency message from the MADT, this same message (`pe/dpi/emergency`) must be sent with `enabled` set to Boolean `false`.\n",
      "messages": {
        "DpiEmergency": {
          "name": "DpiEmergency",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/emergency/emergency.json",
              "title": "Emergency",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "enabled",
                "icon",
                "message"
              ],
              "description": "Emergency message to passengers. Sporveien is required to provide the public with an evacuation message in case an emergency occurs. This message overrides the display on Ruter's DPI screens onboard the vehicle. This message is among those that will be sent by the MADT when the driver has selected an \"Emergency message\". It will often be sent together with pe/audio (one of several pre-recorded audio messages stored onboard in a configuration file for the MADT). This message, and an audio message, must be sent repeatedly by the MADT until the driver disables the emergency message.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "icon": {
                  "$id": "#/properties/icon",
                  "type": "string",
                  "description": "Icon to be displayed together with the message. Ruter will provide a list of allowed strings. The MADT does not need to \"know\" which strings are used - this is preconfigured in the emergency message JSON configuration file.",
                  "examples": [
                    "EXCLAMATION"
                  ]
                },
                "enabled": {
                  "$id": "#/properties/enabled",
                  "type": "boolean",
                  "description": "When the message is triggered, and the emergency message is to be displayed, this should be Boolean \"true\". When the driver disables the emergency message from the MADT, a new message must be sent with Boolean \"false\"."
                },
                "message": {
                  "$id": "#/properties/message",
                  "type": "object",
                  "description": "JSON object properties referring to ISO-639 Set-1 language codes. For example, \"no\" for Norwegian, \"se\" for Swedish, \"es\" for Spanish, \"en\" for English. The object contains a single MessageText (title and text).",
                  "additionalProperties": true,
                  "patternProperties": {
                    "^[a-z]{2}(-[a-z]{2})?$": {
                      "$id": "#/properties/message/patternProperties/messageText",
                      "type": "object",
                      "title": "MessageText",
                      "description": "A multilingual message",
                      "required": [
                        "title",
                        "text"
                      ],
                      "additionalProperties": true,
                      "properties": {
                        "title": {
                          "$id": "#/properties/message/patternProperties/messageText/properties/title",
                          "type": "string",
                          "description": "The title of the message in this language."
                        },
                        "text": {
                          "$id": "#/properties/message/patternProperties/messageText/properties/text",
                          "type": "string",
                          "description": "The message text for this language."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Emergency message enabled",
              "payload": {
                "eventTimestamp": "2017-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "enabled": true,
                "icon": "EXCLAMATION",
                "message": {
                  "en": {
                    "title": "afsdf",
                    "text": "Lorem ipsum dolor sit amet"
                  },
                  "no": {
                    "title": "afsdf",
                    "text": "Lorem ipsum dolor sit amet"
                  }
                }
              }
            },
            {
              "name": "Emergency message disabled",
              "payload": {
                "eventTimestamp": "2017-10-31T08:40:12.749Z",
                "traceId": "9841b268-0c03-1337-b476-211be0f26a0d",
                "enabled": false,
                "icon": "EXCLAMATION",
                "message": {
                  "en": {
                    "title": "afsdf",
                    "text": "Lorem ipsum dolor sit amet"
                  },
                  "no": {
                    "title": "afsdf",
                    "text": "Lorem ipsum dolor sit amet"
                  }
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiEmergency"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_emergency"
    },
    "pe_dpi_eta": {
      "address": "pe/dpi/eta",
      "description": "### Eta Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/eta                                                          |\n| Schema        | [ dpi-eta.json ](json-schemas/pe/dpi/eta/dpi-eta.json)                                                            |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                            |\n\nEstimated arrival at the remaining stops.\n",
      "messages": {
        "DpiEta": {
          "name": "DpiEta",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/eta/dpi-eta.json",
              "type": "object",
              "title": "DpiEta",
              "description": "Estimated time of arrival for future stops on a journey",
              "required": [
                "eventTimestamp",
                "traceId",
                "estimatedCalls"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "estimatedCalls": {
                  "$id": "#/properties/estimatedCalls",
                  "type": "array",
                  "description": "List of ETAs for remaining stops on route",
                  "items": {
                    "$id": "#/properties/estimatedCalls/items",
                    "type": "object",
                    "title": "Estimated call for a future stop",
                    "required": [
                      "eta",
                      "stopPlaceId",
                      "text"
                    ],
                    "additionalProperties": true,
                    "properties": {
                      "eta": {
                        "$id": "#/properties/estimatedCalls/items/properties/eta",
                        "type": "string",
                        "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                        "format": "date-time"
                      },
                      "stopPlaceId": {
                        "$id": "#/properties/estimatedCalls/items/properties/stopPlaceId",
                        "type": "string",
                        "description": "Stop Place Id"
                      },
                      "text": {
                        "$id": "#/properties/estimatedCalls/items/properties/text",
                        "type": "string",
                        "description": "Display text for arrival time"
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Eta",
              "payload": {
                "eventTimestamp": "2017-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "estimatedCalls": [
                  {
                    "eta": "2017-10-13T12:27:04.416Z",
                    "stopPlaceId": "RUT:StopPlace:03010510",
                    "text": "Nå"
                  },
                  {
                    "eta": "2017-10-13T12:27:04.416Z",
                    "stopPlaceId": "RUT:StopPlace:03010511",
                    "text": "1 Min"
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "DpiEta"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_eta"
    },
    "pe_dpi_externaldisplay": {
      "address": "pe/dpi/externaldisplay",
      "description": "### Externaldisplay Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/externaldisplay                                      |\n| Schema        | [ dpi-externaldisplay.json ](json-schemas/pe/dpi/externaldisplay/dpi-externaldisplay.json)                |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                     |\n| Consumer      | PTO                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nMessage to be shown on the external destination display. Usually line number (publicCode) and routeName, with support for alternative message.\n",
      "messages": {
        "DpiExternaldisplay": {
          "name": "DpiExternaldisplay",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/externaldisplay/dpi-externaldisplay.json",
              "type": "object",
              "title": "DpiExternaldisplay",
              "description": "Notification that the external displays should show new destination information",
              "required": [
                "eventTimestamp",
                "traceId",
                "destination"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "publicCode": {
                  "$id": "#/properties/publicCode",
                  "type": "string",
                  "description": "Publically-known number of the line"
                },
                "destination": {
                  "$id": "#/properties/destination",
                  "type": "string",
                  "description": "Destination of the bus"
                },
                "alternativeMessage": {
                  "$id": "#/properties/alternativeMessage",
                  "type": "string",
                  "description": "Alternative message to be displayed on second line of display"
                }
              }
            }
          },
          "examples": [
            {
              "name": "External Display",
              "payload": {
                "eventTimestamp": "2017-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "publicCode": "20",
                "destination": "Galgeberg",
                "alternativeMessage": "Duis aute irure dolor"
              }
            },
            {
              "name": "External Display - Deadrun",
              "payload": {
                "eventTimestamp": "2021-03-04T15:08:07.519Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "destination": "Ikke i trafikk"
              }
            }
          ],
          "x-parser-unique-object-id": "DpiExternaldisplay"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_externaldisplay"
    },
    "pe_dpi_feature_toggle": {
      "address": "pe/dpi/feature_toggle",
      "description": "### Feature Toggle Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/feature_toggle                                               |\n| Schema        | [ dpi-feature-toggle.json ](json-schemas/pe/dpi/feature_toggle/dpi-feature-toggle.json)                           |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nMessage with all active and inactive features.\n",
      "messages": {
        "DpiFeatureToggle": {
          "name": "DpiFeatureToggle",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/feature_toggle/dpi-feature-toggle.json",
              "type": "object",
              "title": "DpiFeatureToggle",
              "description": "Message sent to vehicle to feature toggle DPI functions",
              "required": [
                "eventTimestamp",
                "traceId",
                "features"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "features": {
                  "$id": "#/properties/features",
                  "type": "object",
                  "description": "Active and inactive features",
                  "additionalProperties": {
                    "type": "boolean",
                    "x-parser-schema-id": "<anonymous-schema-20>"
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Feature Toggle",
              "payload": {
                "eventTimestamp": "2025-05-20T09:07:39.927Z",
                "traceId": "f59a4ade-1e65-4b02-8def-edd3641852e8",
                "features": {
                  "qr_feedback": true,
                  "other_feedback": false
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiFeatureToggle"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_feature_toggle"
    },
    "pe_dpi_journey": {
      "address": "pe/dpi/journey",
      "description": "### Journey Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/journey                                                      |\n| Schema        | [ dpi-journey.json ](json-schemas/pe/dpi/journey/dpi-journey.json)                                                |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nMessage containing the stops included in the journey, connections to other lines, positions ++.\n",
      "messages": {
        "DpiJourney": {
          "name": "DpiJourney",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/journey/dpi-journey.json",
              "type": "object",
              "title": "DpiJourney",
              "description": "List of stops for current journey in block",
              "required": [
                "eventTimestamp",
                "traceId",
                "route"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "journeyId": {
                  "$id": "#/properties/journeyId",
                  "type": "string",
                  "description": "PTA's external journey id"
                },
                "journeyRef": {
                  "$id": "#/properties/journeyRef",
                  "type": "string",
                  "description": "PTA's internal journey reference"
                },
                "assignmentId": {
                  "$id": "#/properties/assignmentId",
                  "type": "string",
                  "description": "PTA's internal assignment reference"
                },
                "routeChangeTimestamp": {
                  "$id": "#/properties/routeChangeTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "route": {
                  "$id": "#/properties/route",
                  "type": "object",
                  "description": "Route information",
                  "required": [
                    "id",
                    "name",
                    "line",
                    "journeyPatternRef",
                    "stopPlaces"
                  ],
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "$id": "#/properties/route/properties/id",
                      "type": "string",
                      "description": "Route id"
                    },
                    "name": {
                      "$id": "#/properties/route/properties/name",
                      "type": "string",
                      "description": "Public name of route"
                    },
                    "line": {
                      "$id": "#/properties/route/properties/line",
                      "type": "object",
                      "description": "Line information",
                      "required": [
                        "id",
                        "name",
                        "publicCode"
                      ],
                      "additionalProperties": true,
                      "properties": {
                        "id": {
                          "$id": "#/properties/route/properties/line/properties/id",
                          "type": "string",
                          "description": "Line id"
                        },
                        "name": {
                          "$id": "#/properties/route/properties/line/properties/name",
                          "type": "string",
                          "description": "Public name of line"
                        },
                        "publicCode": {
                          "$id": "#/properties/route/properties/line/properties/publicCode",
                          "type": "string",
                          "description": "Public code of line"
                        },
                        "color": {
                          "$id": "#/properties/route/properties/line/properties/color",
                          "type": "object",
                          "description": "Color theme for the line. Omitted when no color data is available.",
                          "required": [
                            "default",
                            "dark"
                          ],
                          "additionalProperties": true,
                          "properties": {
                            "default": {
                              "$id": "#/properties/route/properties/line/properties/color/properties/default",
                              "type": "object",
                              "description": "Default (light) color scheme",
                              "required": [
                                "background",
                                "text"
                              ],
                              "additionalProperties": true,
                              "properties": {
                                "background": {
                                  "type": "string",
                                  "description": "Background color in HEX format, e.g. '#76A300'",
                                  "x-parser-schema-id": "<anonymous-schema-21>"
                                },
                                "text": {
                                  "type": "string",
                                  "description": "Text color in HEX format, e.g. '#FFFFFF'",
                                  "x-parser-schema-id": "<anonymous-schema-22>"
                                }
                              }
                            },
                            "dark": {
                              "$id": "#/properties/route/properties/line/properties/color/properties/dark",
                              "type": "object",
                              "description": "Dark mode color scheme",
                              "required": [
                                "background",
                                "text"
                              ],
                              "additionalProperties": true,
                              "properties": {
                                "background": {
                                  "type": "string",
                                  "description": "Background color in HEX format, e.g. '#76A300'",
                                  "x-parser-schema-id": "<anonymous-schema-23>"
                                },
                                "text": {
                                  "type": "string",
                                  "description": "Text color in HEX format, e.g. '#FFFFFF'",
                                  "x-parser-schema-id": "<anonymous-schema-24>"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "journeyPatternRef": {
                      "$id": "#/properties/route/properties/journeyPatternRef",
                      "type": "string",
                      "description": "Id identifying the journey pattern. Should be comparable to the JourneyPattern reference used by Entur."
                    },
                    "stopPlaces": {
                      "$id": "#/properties/route/properties/stopPlaces",
                      "type": "array",
                      "description": "Ordered list of stop places on journey",
                      "items": {
                        "$id": "#/properties/route/properties/stopPlaces/items",
                        "type": "object",
                        "description": "Stop place info",
                        "required": [
                          "id",
                          "name",
                          "location",
                          "tariffZones"
                        ],
                        "additionalProperties": true,
                        "properties": {
                          "id": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/id",
                            "type": "string",
                            "description": "Stop place id"
                          },
                          "name": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/name",
                            "type": "string",
                            "description": "Public name of stop"
                          },
                          "cancelled": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/cancelled",
                            "type": "boolean",
                            "description": "Indicated if the stop has been cancelled according to the original plan for the journey"
                          },
                          "location": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/location",
                            "type": "object",
                            "description": "Coordinates of stop place",
                            "required": [
                              "latitude",
                              "longitude"
                            ],
                            "additionalProperties": true,
                            "properties": {
                              "latitude": {
                                "$id": "#/properties/route/properties/stopPlaces/items/properties/location/properties/latitude",
                                "type": "number",
                                "description": "Latitude",
                                "minimum": -90,
                                "maximum": 90
                              },
                              "longitude": {
                                "$id": "#/properties/route/properties/stopPlaces/items/properties/location/properties/longitude",
                                "type": "number",
                                "description": "Longitude",
                                "minimum": -180,
                                "maximum": 180
                              }
                            }
                          },
                          "tariffZones": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/tariffZones",
                            "type": "array",
                            "items": {
                              "type": "string",
                              "x-parser-schema-id": "<anonymous-schema-25>"
                            },
                            "description": "List of tariff zones for the specific stop."
                          },
                          "description": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/description",
                            "type": "string",
                            "description": "Description for travelers"
                          },
                          "publicCode": {
                            "$id": "#/properties/route/properties/stopPlaces/items/properties/publicCode",
                            "type": "string",
                            "description": "Public code for a stop"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Journey",
              "payload": {
                "eventTimestamp": "2017-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "journeyId": "RUT:ServiceJourney:31-117215-13227462",
                "journeyRef": "31001-2019-02-17T21:55:00+01:00",
                "assignmentId": "ab599917ed214472a40c79c18e6cb6b0",
                "route": {
                  "id": "RUT:Route:31-1041",
                  "name": "Fornebu vest-Tonsenhagen",
                  "line": {
                    "id": "RUT:Line:31",
                    "name": "Snarøya - Fornebu - Tonsenhagen - Grorud",
                    "publicCode": "31",
                    "color": {
                      "default": {
                        "background": "#E60000",
                        "text": "#FFFFFF"
                      },
                      "dark": {
                        "background": "#E60000",
                        "text": "#FFFFFF"
                      }
                    }
                  },
                  "journeyPatternRef": "RUT:JourneyPattern:011579",
                  "stopPlaces": [
                    {
                      "id": "RUT:StopPlace:02190017",
                      "name": "Fornebu vest",
                      "cancelled": false,
                      "location": {
                        "latitude": 12.33345,
                        "longitude": 12.33345
                      },
                      "tariffZones": [
                        "OST:TariffZone:227",
                        "RUT:TariffZone:1"
                      ]
                    },
                    {
                      "id": "RUT:StopPlace:03010013",
                      "name": "Jernbanetorget",
                      "cancelled": false,
                      "location": {
                        "latitude": 12.33345,
                        "longitude": 12.33345
                      },
                      "tariffZones": [
                        "RUT:TariffZone:1"
                      ]
                    }
                  ]
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiJourney"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_journey"
    },
    "pe_dpi_key_stops": {
      "address": "pe/dpi/key_stops",
      "description": "### Key Stops Message\n| Field         | Value                                                   |\n|---------------|---------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/key_stops|\n| Schema        | [ dpi-key_stops.json ](json-schemas/pe/dpi/key_stops/dpi-key_stops.json)|\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nList of X number of most trafficked stops in the rest of the journey. Based on predicted number of passengers leaving\non each stop\n",
      "messages": {
        "DpiKeyStops": {
          "name": "DpiKeyStops",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/key_stops/dpi-key_stops.json",
              "type": "object",
              "title": "DpiKeyStops",
              "description": "This schema defines the Key Stops message sent as an MQTT message to vehicles",
              "required": [
                "eventTimestamp",
                "traceId",
                "id",
                "lineId",
                "linePublicCode",
                "stopPlaces"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "id": {
                  "$id": "#/properties/id",
                  "type": "string",
                  "examples": [
                    "RUT:ServiceJourney:18-164036-22694106"
                  ]
                },
                "lineId": {
                  "$id": "#/properties/lineId",
                  "type": "string",
                  "examples": [
                    "RUT:Line:18"
                  ]
                },
                "linePublicCode": {
                  "$id": "#/properties/linePublicCode",
                  "type": "string",
                  "examples": [
                    "18"
                  ]
                },
                "stopPlaces": {
                  "$id": "#/properties/stopPlaces",
                  "type": "array",
                  "items": {
                    "$id": "#/properties/stopPlaces/items",
                    "title": "Items",
                    "type": "object",
                    "required": [
                      "stopPlaceId",
                      "stopPlaceIndex",
                      "boarding",
                      "alighting"
                    ],
                    "properties": {
                      "stopPlaceId": {
                        "$id": "#/properties/stopPlaces/items/stopPlaceId",
                        "type": "string",
                        "examples": [
                          "NSR:StopPlace:3986"
                        ]
                      },
                      "stopPlaceIndex": {
                        "$id": "#/properties/stopPlaces/items/stopPlaceIndex",
                        "type": "integer",
                        "examples": [
                          11
                        ]
                      },
                      "boarding": {
                        "$id": "#/properties/stopPlaces/items/boarding",
                        "type": "object",
                        "required": [
                          "predictedValue",
                          "qualityIndicator"
                        ],
                        "properties": {
                          "predictedValue": {
                            "$id": "#/properties/stopPlaces/items/boarding/predictedValue",
                            "type": "number",
                            "examples": [
                              1.4375
                            ]
                          },
                          "qualityIndicator": {
                            "$id": "#/properties/stopPlaces/items/boarding/qualityIndicator",
                            "type": "string",
                            "default": "",
                            "examples": [
                              "GOOD",
                              "MEDIOCRE",
                              "UNKNOWN"
                            ]
                          }
                        }
                      },
                      "alighting": {
                        "$id": "#/properties/stopPlaces/items/alighting",
                        "type": "object",
                        "required": [
                          "predictedValue",
                          "qualityIndicator"
                        ],
                        "properties": {
                          "predictedValue": {
                            "$id": "#/properties/stopPlaces/items/alighting/predictedValue",
                            "type": "number",
                            "examples": [
                              0.4375
                            ]
                          },
                          "qualityIndicator": {
                            "$id": "#/properties/stopPlaces/items/alighting/qualityIndicator",
                            "type": "string",
                            "examples": [
                              "GOOD",
                              "MEDIOCRE",
                              "UNKNOWN"
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Key Stops",
              "payload": {
                "eventTimestamp": "2022-05-10T10:35:16.708Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "id": "RUT:ServiceJourney:18-164036-22694106",
                "lineId": "RUT:Line:18",
                "linePublicCode": "18",
                "stopPlaces": [
                  {
                    "stopPlaceId": "NSR:StopPlace:3986",
                    "stopPlaceIndex": 11,
                    "boarding": {
                      "predictedValue": 0.33333334,
                      "qualityIndicator": "GOOD"
                    },
                    "alighting": {
                      "predictedValue": 5.233333,
                      "qualityIndicator": "GOOD"
                    }
                  },
                  {
                    "stopPlaceId": "NSR:StopPlace:6258",
                    "stopPlaceIndex": 16,
                    "boarding": {
                      "predictedValue": 1.4375,
                      "qualityIndicator": "GOOD"
                    },
                    "alighting": {
                      "predictedValue": 0.28125,
                      "qualityIndicator": "GOOD"
                    }
                  },
                  {
                    "stopPlaceId": "NSR:StopPlace:6269",
                    "stopPlaceIndex": 20,
                    "boarding": {
                      "predictedValue": 6.6968083,
                      "qualityIndicator": "GOOD"
                    },
                    "alighting": {
                      "predictedValue": 12.484042,
                      "qualityIndicator": "GOOD"
                    }
                  },
                  {
                    "stopPlaceId": "NSR:StopPlace:6266",
                    "stopPlaceIndex": 26,
                    "boarding": {
                      "predictedValue": 1.5,
                      "qualityIndicator": "GOOD"
                    },
                    "alighting": {
                      "predictedValue": 0.4375,
                      "qualityIndicator": "GOOD"
                    }
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "DpiKeyStops"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_key_stops"
    },
    "pe_dpi_logs": {
      "address": "pe/dpi/logs",
      "description": "### Command Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/pe/dpi/logs                                                         |\n| Schema        | [ dpi-logs.json ](json-schemas/pe/dpi/logs/dpi-logs.json)                                                         |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nLogs from the DPI client are published to this topic. The payload includes the log level and message, and may include a stack trace when available.\n",
      "messages": {
        "DpiLogs": {
          "name": "DpiLogs",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/logs/dpi-logs.json",
              "type": "object",
              "title": "DpiLogs",
              "description": "Logs from the DPI client",
              "required": [
                "eventTimestamp",
                "traceId",
                "clientId",
                "payload"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "clientId": {
                  "$id": "#/properties/clientId",
                  "type": "string",
                  "description": "clientId used in client that produced this message",
                  "examples": [
                    "53f93598-8e82-4a38-9def-10075d07bb33"
                  ],
                  "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                },
                "payload": {
                  "$id": "#/properties/payload",
                  "type": "object",
                  "description": "Logs from the DPI client",
                  "required": [
                    "level",
                    "message"
                  ],
                  "additionalProperties": true,
                  "properties": {
                    "level": {
                      "$id": "#/properties/payload/properties/level",
                      "type": "string",
                      "description": "Log level"
                    },
                    "message": {
                      "$id": "#/properties/payload/properties/message",
                      "type": "string",
                      "description": "Log message"
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "DPI Logs",
              "payload": {
                "eventTimestamp": "2017-10-31T12:45:50.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "payload": {
                  "level": "ERROR",
                  "message": "Connection timed out"
                }
              }
            }
          ],
          "x-parser-unique-object-id": "DpiLogs"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_logs"
    },
    "pe_dpi_nextstop": {
      "address": "pe/dpi/nextstop",
      "description": "### Nextstop Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/nextstop                                                     |\n| Schema        | [ dpi-nextstop.json ](json-schemas/pe/dpi/nextstop/dpi-nextstop.json)                                             |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nNext stop on the buss route after leaving a stop.\n",
      "messages": {
        "DpiNextstop": {
          "name": "DpiNextstop",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/nextstop/dpi-nextstop.json",
              "type": "object",
              "title": "DpiNextstop",
              "description": "Notification that vehicle has a new next stop",
              "required": [
                "eventTimestamp",
                "traceId",
                "stopPlaceId",
                "index"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "stopPlaceId": {
                  "$id": "#/properties/stopPlaceId",
                  "type": "string",
                  "description": "Stop place id"
                },
                "index": {
                  "$id": "#/properties/index",
                  "type": "integer",
                  "description": "Index of stop place in journey data"
                }
              }
            }
          },
          "examples": [
            {
              "name": "NextStop",
              "payload": {
                "eventTimestamp": "2017-10-31T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "stopPlaceId": "RUT:StopPlace:03012453",
                "index": 0
              }
            }
          ],
          "x-parser-unique-object-id": "DpiNextstop"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_nextstop"
    },
    "pe_dpi_pa": {
      "address": "pe/dpi/pa",
      "description": "### Pa Message\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/dpi/pa                                                           |\n| Schema        | [ dpi-pa.json ](json-schemas/pe/dpi/pa/dpi-pa.json)                                                               |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nMessage to be shown on internal displays. May contain references to videos, html, images, text etc.\n",
      "messages": {
        "DpiPa": {
          "name": "DpiPa",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/dpi/pa/dpi-pa.json",
              "title": "DpiPa",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "ref"
              ],
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "ref": {
                  "$id": "#/properties/ref",
                  "type": "string",
                  "examples": [
                    "757fd8b4-2e57-4ad3-9aee-76e793c514d9"
                  ]
                },
                "content": {
                  "$id": "#/properties/content",
                  "title": "Content",
                  "type": "array",
                  "items": {
                    "$id": "#/properties/content/items",
                    "type": "object",
                    "required": [
                      "type"
                    ],
                    "properties": {
                      "type": {
                        "$id": "#/properties/content/items/type",
                        "title": "Content type",
                        "type": "string",
                        "examples": [
                          "VIDEO",
                          "IMAGE",
                          "HTML",
                          "TEXT"
                        ]
                      },
                      "duration": {
                        "$id": "#/properties/content/items/duration",
                        "type": "integer",
                        "examples": [
                          10
                        ]
                      },
                      "src": {
                        "$id": "#/properties/content/items/src",
                        "type": "string",
                        "examples": [
                          "../media/1080p_Ruter_Takk.mp4"
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Passenger Announcement - Clear display",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "ref": "CLEAR_SCREEN"
              }
            },
            {
              "name": "Passenger Announcement - Multiple contents",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "ref": "757fd8b4-2e57-4ad3-9aee-76e793c514d9",
                "content": [
                  {
                    "type": "IMAGE",
                    "duration": 5,
                    "src": "../media/logo.png"
                  },
                  {
                    "type": "HTML",
                    "duration": 10,
                    "src": "../media/kampanje.html"
                  }
                ]
              }
            },
            {
              "name": "Passenger Announcement - Text",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "ref": "757fd8b4-2e57-4ad3-9aee-76e793c514d9",
                "content": [
                  {
                    "type": "TEXT",
                    "duration": 10,
                    "colorScheme": "INFO",
                    "icon": "ARROW_UP",
                    "iconAnchor": "LEFT",
                    "message": {
                      "no": {
                        "title": "Tittel på melding",
                        "paragraphs": [
                          "En tekst",
                          "En annen tekst"
                        ]
                      }
                    }
                  }
                ]
              }
            },
            {
              "name": "Passenger Announcement - Video",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "ref": "757fd8b4-2e57-4ad3-9aee-76e793c514d9",
                "content": [
                  {
                    "type": "VIDEO",
                    "duration": 10,
                    "src": "../media/1080p_Ruter_Takk.mp4"
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "DpiPa"
        }
      },
      "x-parser-unique-object-id": "pe_dpi_pa"
    },
    "pe_vehicle_api": {
      "address": "pe/vehicle/api",
      "description": "### Vehicle API\n| Field         | Value                                                                                                             |\n|---------------|-------------------------------------------------------------------------------------------------------------------|\n| Central Topic | {operatorId}/{authorityId}/{vehicleId}/adt/v4/pe/vehicle/api                                                      |\n| Schema        | [ api.json ](json-schemas/pe/vehicle/api/api.json)                                                                |\n| Maintainer    | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Producer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team)                                                             |\n| Consumer      | [DPI](https://github.com/orgs/RuterNo/teams/dpi-team), [Betjent salg](https://github.com/orgs/RuterNo/teams/rutersalg)      |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                           |\n\nMessage used by the PTA to distribute information about the vehicle and it's supported APIs as provided by the PTO.\n",
      "messages": {
        "Api": {
          "name": "Api",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/pe/vehicle/api/api.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Api",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "operatorRef",
                "vehicleId",
                "apiVersion"
              ],
              "description": "Vehicle API topic",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)",
                  "format": "date-time"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "authorityId": {
                  "$id": "#/properties/authorityId",
                  "type": "string",
                  "description": "A unique identifier of the PTA. This is the same as the authorityId in the topic"
                },
                "operatorRef": {
                  "$id": "#/properties/operatorRef",
                  "type": "string",
                  "description": "A unique identifier of the PTO. This is the same as the operatorId in the topic"
                },
                "vehicleId": {
                  "$id": "#/properties/vehicleId",
                  "type": "string",
                  "description": "A unique identifier of the vehicle - VIN"
                },
                "apiVersion": {
                  "$id": "#/properties/apiVersion",
                  "type": "string",
                  "description": "Specifies which version of the API the vehicle is using"
                }
              }
            }
          },
          "examples": [
            {
              "name": "Vehicle API",
              "payload": {
                "eventTimestamp": "2021-03-04T15:08:07.519Z",
                "traceId": "2ccf77aa-463f-4b98-ad19-61ec5d213e36",
                "authorityId": "ruter",
                "operatorRef": "nobina",
                "vehicleId": "VNE5046N40M039404",
                "apiVersion": "3"
              }
            }
          ],
          "x-parser-unique-object-id": "Api"
        }
      },
      "x-parser-unique-object-id": "pe_vehicle_api"
    },
    "status_coupling": {
      "address": "status/coupling",
      "description": "### Coupling Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/coupling                                             |\n| Schema        | [ coupling.json ](json-schemas/status/coupling/coupling.json)                                             |\n| Maintainer    | Sporveien / DRIV                                                                                           |\n| Producer      | Sporveien / DRIV                                                                                           |\n| Consumer      | Sporveien / DRIV                                                                                           |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                  |\n\nM4 cars can be coupled (\"connected\") with each other, and they can be decoupled (\"disconnected\"). Both vehicles being connected or disconnected must send information. Hence, each coupling/decoupling action will result in two such messages - one from each vehicle.\n\nThe message topic from each vehicle contains the vehicle number of that vehicle. The `carId` and `withCarId` fields refer to the individual cars (parts) of the vehicle (MC1, M, or MC2).\n\nMotivation: Connecting and disconnecting carriages is key information required in backend systems, for example for DRIV.\n",
      "messages": {
        "Coupling": {
          "name": "Coupling",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/status/coupling/coupling.json",
              "title": "Coupling",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "carId",
                "withCarId",
                "coupled"
              ],
              "description": "Sent from both vehicles when M4 cars are coupled or decoupled. Vehicles can be coupled (\"connected\") with each other, and they can be decoupled (\"disconnected\"). Both vehicles being connected or disconnected must send information, so each coupling/decoupling action results in two such messages - one from each vehicle.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "carId": {
                  "$id": "#/properties/carId",
                  "type": "string",
                  "description": "The ID of the car in this vehicle which another car is connecting to."
                },
                "withCarId": {
                  "$id": "#/properties/withCarId",
                  "type": "string",
                  "description": "The ID of the car from the other vehicle being connected with this carId."
                },
                "coupled": {
                  "$id": "#/properties/coupled",
                  "type": "boolean",
                  "description": "If the vehicles are being coupled (connected) then this is true. If the vehicles are being decoupled (disconnected) then this is false.",
                  "examples": [
                    true,
                    false
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "Coupling from 40002",
              "payload": {
                "eventTimestamp": "2025-05-27T08:38:02.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "carId": "41002",
                "withCarId": "41001",
                "coupled": false
              }
            },
            {
              "name": "Coupling from 40001",
              "payload": {
                "eventTimestamp": "2025-05-27T08:38:02.749Z",
                "traceId": "9841b268-0c03-1337-b476-211be0f26a0d",
                "carId": "41001",
                "withCarId": "41002",
                "coupled": false
              }
            }
          ],
          "x-parser-unique-object-id": "Coupling"
        }
      },
      "x-parser-unique-object-id": "status_coupling"
    },
    "status_offline": {
      "address": "status/offline",
      "description": "### Signal From MADT (Driver) To Use Offline Passenger Information\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/offline                                              |\n| Schema        | [ offline.json ](json-schemas/status/offline/offline.json)                                                |\n| Maintainer    | Sporveien                                                                                                   |\n| Producer      | Sporveien                                                                                                   |\n| Consumer      | Sporveien                                                                                                   |\n| Service Level | ⛔ PTA internal API. No restrictions apply. May be removed or modified freely by the PTA                  |\n\nRuter delivers a solution for limited passenger information to be used onboard. This message triggers use of the offline solution. The message flow for audio and external signage will be:\n- Ruter publishes: `pe/audio`\n- Sporveien backoffice republishes this as `pe/online/audio`\n- Ruter's onboard component listens on `pe/online/audio`\n  - When state is \"online\", Ruter's offline solution republishes the message on the M4 MQTT broker as `pe/audio` (the standard ADT audio message)\n  - When state is \"offline\", Ruter's component will publish `pe/audio` without any signal from the landside\n\nThis message is triggered from the MADT screen by the driver. When the driver exits \"offline\" mode in the MADT, the message should first be published with `offline = false`. When the vehicle is first powered on, it should immediately send a message with `offline = false`.\n\nNote that the message is \"retained\". The last message of this type published will remain on the broker. Any new subscribing client will receive it. The topic is specified as \"bridged\", even though it most likely will not be sent out of the vehicle, as the vehicle will not have a network connection when this occurs.\n",
      "messages": {
        "Offline": {
          "name": "Offline",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/status/offline/offline.json",
              "title": "Offline",
              "type": "object",
              "required": [
                "eventTimestamp",
                "source",
                "offline"
              ],
              "description": "Signal from MADT (driver) to use offline passenger information. Ruter delivers a solution for limited passenger information to be used onboard. This message triggers use of the offline solution. The message is retained - the last message of this type published will remain on the broker, and any new subscribing client will receive it.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "source": {
                  "$id": "#/properties/source",
                  "type": "string",
                  "description": "Source of the \"offline\" event. If sent by the onboard MADT it should be \"MADT\". If sent due to automatic detection of network failure, it should be, for example, \"automatic\". Anything which sends the \"offline\" event should be explicit and clear about its unique source.",
                  "examples": [
                    "MADT",
                    "automatic"
                  ]
                },
                "offline": {
                  "$id": "#/properties/offline",
                  "type": "boolean",
                  "description": "True when the offline solution is to be used. False when the online solution must be used."
                }
              }
            }
          },
          "examples": [
            {
              "name": "Offline signal from MADT",
              "payload": {
                "eventTimestamp": "2020-10-31T08:38:02.749Z",
                "source": "MADT",
                "offline": true
              }
            }
          ],
          "x-parser-unique-object-id": "Offline"
        }
      },
      "x-parser-unique-object-id": "status_offline"
    },
    "status_doors_available": {
      "address": "status/doors/available",
      "description": "### Describe Which Doors Will Open At The Next Stop\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/doors/available                                      |\n| Schema        | [ doors-available.json ](json-schemas/status/doors/available/doors-available.json)                       |\n| Maintainer    | Sporveien                                                                                                   |\n| Producer      | Sporveien                                                                                                   |\n| Consumer      | Sporveien                                                                                                   |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nCBTC onboard, physically locking/blocking doors, and the vehicle itself will determine which doors can or cannot open when approaching a stop. This message broadcasts that information as a list of the doors that will open at the next stop, a list of doors that will not open, and a list of doors with errors.\n\nFor example, at a stop which is long enough for the entire vehicle, all the doors on the right-hand side will open. At some stops that are too short for the entire vehicle, only the front-most doors will open.\n\nMotivation: This will likely be used by Ruter to display a visual indication in the DPI application showing passengers whether a door will open at the next stop or not.\n\nWhen several vehicles are connected (\"coupled\") each vehicle should send its own individual `status/doors/available` message. It is important that this message be published for the next stop/quay as soon as possible on leaving the current stop/quay.\n",
      "messages": {
        "DoorsAvailable": {
          "name": "DoorsAvailable",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/status/doors/available/doors-available.json",
              "title": "DoorsAvailable",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "messageNumber",
                "availableDoorRefList",
                "unavailableDoorRefList",
                "errorDoorRefList"
              ],
              "description": "Describes which doors will open at the next stop. CBTC onboard, physically locking/blocking doors, and the vehicle itself will determine which doors can or cannot open when approaching a stop. This message broadcasts that information as a list of the doors that will open at the next stop, a list of doors that will not open, and a list of doors with errors.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "type": "integer",
                  "description": "Sequence number - increased by one for each new message on this topic. Used to validate consistency in the data stream."
                },
                "availableDoorRefList": {
                  "$id": "#/properties/availableDoorRefList",
                  "type": "array",
                  "description": "Array containing the unique ID (doorRef) for each door that will open at the next stop.",
                  "items": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-26>"
                  }
                },
                "unavailableDoorRefList": {
                  "$id": "#/properties/unavailableDoorRefList",
                  "type": "array",
                  "description": "Array containing doorRef of each door which will not open. Reasons for not opening could be: Physically locked, CBTC data, driver selected to block certain doors.",
                  "items": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-27>"
                  }
                },
                "errorDoorRefList": {
                  "$id": "#/properties/errorDoorRefList",
                  "type": "array",
                  "description": "Array containing doorRef of each door that cannot open due to some error.",
                  "items": {
                    "type": "string",
                    "x-parser-schema-id": "<anonymous-schema-28>"
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "Doors available at next stop",
              "payload": {
                "eventTimestamp": "2021-10-31T12:45:50.749Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "messageNumber": 12345,
                "availableDoorRefList": [
                  "1",
                  "3",
                  "5",
                  "7",
                  "9",
                  "10"
                ],
                "unavailableDoorRefList": [
                  "2",
                  "4",
                  "6",
                  "8",
                  "11",
                  "12"
                ],
                "errorDoorRefList": [
                  "2",
                  "4",
                  "6",
                  "8",
                  "11",
                  "12"
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "DoorsAvailable"
        }
      },
      "x-parser-unique-object-id": "status_doors_available"
    },
    "status_door_request_open": {
      "address": "status/door_request_open",
      "description": "### Report Which Doors Were Requested To Open Using Button\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/status/door_request_open                                   |\n| Schema        | [ door-request-open.json ](json-schemas/status/door_request_open/door-request-open.json)                 |\n| Maintainer    | Sporveien                                                                                                   |\n| Producer      | Sporveien                                                                                                   |\n| Consumer      | Sporveien                                                                                                   |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nThis message is sent with `requestOpen` equal to Boolean True when the button on the door is pressed, requesting that it be opened at the next stop.\n\nThe message is sent with `requestOpen` equal to Boolean False for all doors that were previously requested opened (i.e., a message of this type with `requestOpen = true` was sent for this `doorRef`) when the door lock is enabled (`sensors/door` is sent with `isOpen=false`).\n\nMotivation: It should be possible for the passenger information application (DPI) on the screen above the door to listen to this message onboard, and display whether the door will open or not. This is in addition to the button lighting up, signaling that the door will open on reaching the platform/quay.\n\nThis should be sent even if the door is on the list of doors that should be disabled (or is locked) at the next stop.\n",
      "messages": {
        "DoorRequestOpen": {
          "name": "DoorRequestOpen",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/status/door_request_open/door-request-open.json",
              "title": "DoorRequestOpen",
              "type": "object",
              "required": [
                "eventTimestamp",
                "traceId",
                "doorRef",
                "requestOpen"
              ],
              "description": "Report which doors were requested to open using the door button. This topic is used to track whether the passengers have pressed the door_request button.",
              "additionalProperties": true,
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "doorRef": {
                  "$id": "#/properties/doorRef",
                  "type": "string",
                  "description": "Unique \"doorRef\" ID for each door. Must be consistent with other messages which refer to doors by ID."
                },
                "requestOpen": {
                  "$id": "#/properties/requestOpen",
                  "type": "boolean",
                  "description": "True when the button on the door is pressed. False for all doors that were previously requested opened (i.e., this message was sent earlier with Boolean true) when the general door lock is enabled before leaving quay (that is - when the \"sensors/door\" message is sent with isOpen=false)."
                }
              }
            }
          },
          "examples": [
            {
              "name": "Door request open",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2021-10-31T12:45:50.749Z",
                "doorRef": "12",
                "requestOpen": true
              }
            }
          ],
          "x-parser-unique-object-id": "DoorRequestOpen"
        }
      },
      "x-parser-unique-object-id": "status_door_request_open"
    },
    "sensors_apc_sensorId": {
      "address": "sensors/apc/{sensorId}",
      "description": "### Apc Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/apc/{sensorId}                                      |\n| Schema        | [ apc.json ](json-schemas/sensors/apc/apc.json)                                                           |\n| Maintainer    | [Passasjertelling](https://github.com/orgs/RuterNo/teams/passasjertelling)                                |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n",
      "parameters": {
        "sensorId": {
          "description": "Identification of the physical sensor, e.g. serial number"
        }
      },
      "messages": {
        "Apc": {
          "name": "Apc",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/apc/apc.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Apc",
              "type": "object",
              "required": [
                "traceId",
                "eventTimestamp",
                "messageNumber",
                "doorRef",
                "alightingCount",
                "boardingCount",
                "categoryActivities"
              ],
              "description": "Raw-data from door-sensor for later evaluation.",
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "$comment": "Added in version 2.5",
                  "type": "string",
                  "description": "A unique identifier to be able to trace this message. Also used to detect duplicate messages received."
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io). Reflects the current UTC time."
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "$comment": "Added in version 2.1",
                  "type": "integer",
                  "description": "The sequence number is generated per vehicle and per sensor category on the vehicle. For example, three apc sensors on a vehicle would share the same messageNumber"
                },
                "doorRef": {
                  "$id": "#/properties/doorRef",
                  "type": "string",
                  "description": "Stable alfa-numeric reference that is unique within scope of vehicle (vehicle element/train set). If Door Number is used as DoorRef, Door Number should start at 1 (The front of the vehicle)"
                },
                "alightingCount": {
                  "$id": "#/properties/alightingCount",
                  "type": "integer",
                  "description": "Total number of alighting passengers detected by this sensor since the last APC message was produced."
                },
                "boardingCount": {
                  "$id": "#/properties/boardingCount",
                  "type": "integer",
                  "description": "Total number of boarding passengers detected by this sensor since the last APC message was produced."
                },
                "categoryActivities": {
                  "$id": "#/properties/categoryActivities",
                  "type": "array",
                  "description": "A list describing APC activity at each individual door divided per handled object category.",
                  "items": {
                    "type": "object",
                    "required": [
                      "categoryRef",
                      "alightingCount",
                      "boardingCount"
                    ],
                    "properties": {
                      "categoryRef": {
                        "type": "string",
                        "description": "Object class reference. Any of the following object categories.",
                        "enum": [
                          "ADULT",
                          "CHILD",
                          "PRAM",
                          "BIKE",
                          "WHEELCHAIR",
                          "UNKNOWN"
                        ],
                        "x-parser-schema-id": "<anonymous-schema-31>"
                      },
                      "alightingCount": {
                        "type": "integer",
                        "description": "Number of alighting in this category detected by this sensor since the last APC message was produced.",
                        "x-parser-schema-id": "<anonymous-schema-32>"
                      },
                      "boardingCount": {
                        "type": "integer",
                        "description": "Number of boarding in this category detected by this sensor since the last APC message was produced.",
                        "x-parser-schema-id": "<anonymous-schema-33>"
                      }
                    },
                    "x-parser-schema-id": "<anonymous-schema-30>"
                  }
                }
              }
            }
          },
          "examples": [
            {
              "name": "APC Sensors",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2023-10-31T12:45:50.749Z",
                "messageNumber": 123456,
                "doorRef": "1",
                "alightingCount": 23,
                "boardingCount": 12,
                "categoryActivities": [
                  {
                    "categoryRef": "ADULT",
                    "alightingCount": 23,
                    "boardingCount": 9
                  },
                  {
                    "categoryRef": "CHILD",
                    "alightingCount": 0,
                    "boardingCount": 3
                  }
                ]
              }
            }
          ],
          "x-parser-unique-object-id": "Apc"
        }
      },
      "x-parser-unique-object-id": "sensors_apc_sensorId"
    },
    "sensors_door": {
      "address": "sensors/door",
      "description": "### Door Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/door                                                |\n| Schema        | [ door.json ](json-schemas/sensors/door/door.json)                                                        |\n| Maintainer    | [Passasjertelling](https://github.com/orgs/RuterNo/teams/passasjertelling)                                |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n\nFrequency: on change\n",
      "messages": {
        "Door": {
          "name": "Door",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/door/door.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Door",
              "type": "object",
              "required": [
                "traceId",
                "eventTimestamp",
                "messageNumber",
                "doorOpen"
              ],
              "description": "Door status - indicates if passengers are able to open the doors (the door lock is released). When false, doors are locked and cannot be opened by passengers.",
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "$comment": "Added in version 2.5",
                  "type": "string",
                  "description": "A unique identifier to be able to trace this message. Also used to detect duplicate messages received."
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io). Reflects the current UTC time."
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "$comment": "Added in version 3.3",
                  "type": "integer",
                  "description": "Sequence number that should be generated on the vehicle and increased by one for each new message. Used to validate consistency in the data stream."
                },
                "doorOpen": {
                  "$id": "#/properties/doorOpen",
                  "type": "boolean",
                  "description": "True if passengers are able to open (the door lock is released). When false, doors are locked and cannot be opened by passengers.",
                  "examples": [
                    "true",
                    "false"
                  ]
                }
              }
            }
          },
          "examples": [
            {
              "name": "Door Sensor",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2017-10-31T12:45:50.749Z",
                "messageNumber": 123456,
                "doorOpen": true
              }
            }
          ],
          "x-parser-unique-object-id": "Door"
        }
      },
      "x-parser-unique-object-id": "sensors_door"
    },
    "sensors_location": {
      "address": "sensors/location",
      "description": "### Location Message\n\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/location                                            |\n| Schema        | [ location.json ](json-schemas/sensors/location/location.json)                                            |\n| Maintainer    | [Progress](https://github.com/orgs/RuterNo/teams/progress)                                                |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |\n\nDescribes the GNSS navigation receiver feedback in metric format.\n\nThe GNSS type is expected to be GPS. The GNSS coordinate system is expected be “WGS84”. Negative values is used south of\nthe equator and west of Greenwich.\n\nFrequency is expected to be at 1 message per second.\n",
      "messages": {
        "Location": {
          "name": "Location",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/location/location.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Location",
              "type": "object",
              "description": "Location sensor data",
              "required": [
                "traceId",
                "eventTimestamp",
                "latitudeDegree",
                "longitudeDegree",
                "altitude",
                "messageNumber",
                "speedOverGround",
                "trackDegreeTrue",
                "signalQuality",
                "numberOfSatellites",
                "hdop"
              ],
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "A unique identifier - UUID"
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io). Reflects the UTC time provided by the GNSS equipment for position fix. This is the point in time the location applies to. Millisecond precision is preferred, if available"
                },
                "latitudeDegree": {
                  "$id": "#/properties/latitudeDegree",
                  "type": "number",
                  "description": "Latitude coordinate in decimal degrees."
                },
                "longitudeDegree": {
                  "$id": "#/properties/longitudeDegree",
                  "type": "number",
                  "description": "Longitude coordinate in decimal degrees."
                },
                "altitude": {
                  "$id": "#/properties/altitude",
                  "type": "number",
                  "description": "Altitude value (meter) above mean sea level."
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "$comment": "Added in version 2.1. Mandatory since 3.0",
                  "type": "integer",
                  "description": "Sequence number, increased by one for each new message. Used to validate consistency in the data stream."
                },
                "speedOverGround": {
                  "$id": "#/properties/speedOverGround",
                  "type": "number",
                  "description": "GNSS based speed over ground (m/s)."
                },
                "trackDegreeTrue": {
                  "$id": "#/properties/trackDegreeTrue",
                  "type": "number",
                  "description": "Direction of travel in relation to the geographical North Pole (0-360 degrees)."
                },
                "signalQuality": {
                  "$id": "#/properties/signalQuality",
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 8,
                  "description": "GPS quality indicator. 0 - Fix not available. 1 - GPS fix. 2 - Differential GPS fix. 3 = PPS fix. 4 = Real Time Kinematic. 5 = Float RTK. 6 = Estimated (dead reckoning). 7 = Manual input mode. 8 = Simulation mode"
                },
                "numberOfSatellites": {
                  "$id": "#/properties/numberOfSatellites",
                  "type": "integer",
                  "description": "Number of satellites used."
                },
                "hdop": {
                  "$id": "#/properties/hdop",
                  "type": "number",
                  "description": "Value of precision in horizontal dilution."
                }
              }
            }
          },
          "examples": [
            {
              "name": "Location",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2017-10-31T12:45:50.749Z",
                "latitudeDegree": 59.251356,
                "longitudeDegree": 11.581231,
                "altitude": 124,
                "messageNumber": 12345,
                "speedOverGround": 15.3,
                "trackDegreeTrue": 324,
                "signalQuality": 1,
                "numberOfSatellites": 12,
                "hdop": 2.4
              }
            }
          ],
          "x-parser-unique-object-id": "Location"
        }
      },
      "x-parser-unique-object-id": "sensors_location"
    },
    "sensors_odometer": {
      "address": "sensors/odometer",
      "description": "### Odometer Message\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/odometer                                            |\n| Schema        | [ odometer.json ](json-schemas/sensors/odometer/odometer.json)                                            |\n| Maintainer    | [Progress](https://github.com/orgs/RuterNo/teams/progress)                                                |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n\nDescribes an odometer value in meters based on total vehicle distance or similar. Absolute value of less importance but\nshould be increasing within the scope of a journey.\n\nFrequency is expected to be at 1 message per second.\n",
      "messages": {
        "Odometer": {
          "name": "Odometer",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/odometer/odometer.json",
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "Odometer",
              "type": "object",
              "required": [
                "traceId",
                "eventTimestamp",
                "distance",
                "messageNumber"
              ],
              "description": "Odometer data",
              "additionalProperties": true,
              "properties": {
                "traceId": {
                  "$id": "#/properties/traceId",
                  "$comment": "Added in version 2.5",
                  "type": "string",
                  "description": "A unique identifier to be able to trace this message. Also used to detect duplicate messages received."
                },
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "As specified in the [ADT documentation.](https://adt.transhub.io)"
                },
                "distance": {
                  "$id": "#/properties/distance",
                  "type": "integer",
                  "description": "Describes absolute odometer value in metres."
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "$comment": "Added in version 2.1. Mandatory since 3.0",
                  "type": "integer",
                  "description": "Sequence number, increased by one for each new message. Used to validate consistency in the data stream."
                }
              }
            }
          },
          "examples": [
            {
              "name": "Odometer",
              "payload": {
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "eventTimestamp": "2017-11-30T23:45:52.006Z",
                "distance": 23434556,
                "messageNumber": 12345
              }
            }
          ],
          "x-parser-unique-object-id": "Odometer"
        }
      },
      "x-parser-unique-object-id": "sensors_odometer"
    },
    "sensors_temperature_indoor": {
      "address": "sensors/temperature_indoor",
      "description": "### Temperature Indoor Message\n\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/temperature_indoor                                  |\n| Schema        | [ temperature-indoor.json ](json-schemas/sensors/temperature-indoor/temperature-indoor.json)              |\n| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata)                                              |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n\nDescribes the measured air temperature inside a vehicle. Each message corresponds to one\nphysical sensor and includes contextual information that indicates its approximate location, based on defined\ntemperature zones along the vehicle’s length and its vertical level if applicable.\n\n#### Message Specifications\n\n- **Message frequency:** 6 times per minute (every 10 seconds)\n- **Unit:** Degrees Celsius (°C)\n- **Resolution:** <= 1°C\n\n### Location Semantics\n\nTo support consistent interpretation across vehicle types, each temperature message includes:\n\n| Field   | Type  | Description                                                                                                                                   |\n|---------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------|\n| `zone`  | `Int` | Position along the vehicle’s length. Divided into zones (starting from front = `1`). Zone `0` is reserved exclusively for the driver's cabin. |\n| `level` | `Int` | Vertical level of the sensor. Only applicable for multi-level vehicles. If not provided, it will be interpreted as `1` (platform level).      |\n\n> **Note:** All zones are approximate and not intended to represent exact physical locations. They serve to provide a\n> general understanding of where a sensor is located within the vehicle.\n\n\n![Temperature Zones](json-schemas/sensors/temperature-indoor/temperature-zones.excalidraw.png)\n",
      "messages": {
        "TemperatureIndoor": {
          "name": "TemperatureIndoor",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/temperature-indoor/temperature-indoor.json",
              "type": "object",
              "title": "TemperatureIndoor",
              "description": "Schema for indoor temperature sensor data. The value represents the measured air temperature in degrees Celsius (°C) at a specific location within the vehicle. Location is defined by the car, zone (front, middle, rear, driver cabin), and level (e.g. below platform, platform, or upper level).",
              "required": [
                "eventTimestamp",
                "traceId",
                "messageNumber",
                "sensorId",
                "zone",
                "value"
              ],
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "ISO 8601 timestamp in UTC (must end with 'Z'), indicating when the measurement was taken.",
                  "example": "2025-05-13T12:00:00.000Z"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "Unique identifier for tracing the message.",
                  "example": "baf3d8ac-1234-4e0c-9e9e-abc123def456"
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "type": "integer",
                  "description": "Sequence number, increased by one for each new message.",
                  "example": 27
                },
                "sensorId": {
                  "$id": "#/properties/sensorId",
                  "type": "string",
                  "description": "Unique identifier for the sensor. Typically the serial number (S/N) from the sensor.",
                  "example": "SN-456789"
                },
                "zone": {
                  "$id": "#/properties/zone",
                  "type": "integer",
                  "minimum": 0,
                  "description": "Position along the vehicle's lengthwise direction from its defined front, divided into zones (0 .. n)",
                  "example": 2
                },
                "level": {
                  "$id": "#/properties/level",
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 2,
                  "description": "Vertical level of the sensor. If not provided, the default is 1 (platform level).",
                  "example": 2
                },
                "value": {
                  "$id": "#/properties/value",
                  "type": "number",
                  "minimum": -40,
                  "maximum": 50,
                  "description": "Indoor temperature in degrees Celsius (°C), with a resolution better or equal to 1°C",
                  "example": 21.5
                }
              },
              "additionalProperties": true
            }
          },
          "examples": [
            {
              "name": "Temperature indoor with sensor located in zone one",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "messageNumber": 1,
                "sensorId": "XB7F-9T2M-L4FC-3R8Q",
                "zone": 1,
                "value": 20.7
              }
            },
            {
              "name": "Temperature indoor with sensor located in zone three on second level",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "messageNumber": 1,
                "sensorId": "XB7F-9T2M-L4FC-3R8Q",
                "zone": 3,
                "level": 2,
                "value": 20.7
              }
            }
          ],
          "x-parser-unique-object-id": "TemperatureIndoor"
        }
      },
      "x-parser-unique-object-id": "sensors_temperature_indoor"
    },
    "sensors_temperature_outdoor": {
      "address": "sensors/temperature_outdoor",
      "description": "### Temperature Outdoor Message\n\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/temperature_outdoor                                 |\n| Schema        | [ temperature-outdoor.json ](json-schemas/sensors/temperature-outdoor/temperature-outdoor.json)           |\n| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata)                                              |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n\nMeasurement of the external temperature around the vehicle.\n\n#### Message Specifications\n\n- **Message frequency:** Once per minute (every 60 seconds)\n- **Unit:** Degrees Celsius (°C)\n- **Resolution:** <= 1°C\n",
      "messages": {
        "TemperatureOutdoor": {
          "name": "TemperatureOutdoor",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/temperature-outdoor/temperature-outdoor.json",
              "type": "object",
              "title": "TemperatureOutdoor",
              "description": "Schema for outdoor temperature sensor data",
              "required": [
                "eventTimestamp",
                "traceId",
                "messageNumber",
                "sensorId",
                "value"
              ],
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "ISO 8601 timestamp in UTC (must end with 'Z'), indicating when the measurement was taken",
                  "example": "2025-05-13T12:00:00.000Z"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "Unique identifier for tracing this message",
                  "example": "baf3d8ac-1234-4e0c-9e9e-abc123def456"
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "type": "integer",
                  "description": "Sequence number, increased by one for each new message",
                  "example": 27
                },
                "sensorId": {
                  "$id": "#/properties/sensorId",
                  "type": "string",
                  "description": "Unique identifier for the sensor. Typically the serial number (S/N) from the sensor.",
                  "example": "SN-456789"
                },
                "value": {
                  "$id": "#/properties/value",
                  "type": "number",
                  "description": "Outdoor temperature in degrees Celsius (°C), with a resolution better or equal to 1°C",
                  "example": 15.4
                }
              },
              "additionalProperties": true
            }
          },
          "examples": [
            {
              "name": "Temperature outdoor",
              "payload": {
                "eventTimestamp": "2022-05-09T13:27:59.624Z",
                "traceId": "3841a268-0c03-4588-b476-211be0f26a0d",
                "messageNumber": 1,
                "sensorId": "XB7F-9T2M-L4FC-3R8Q",
                "value": 20.7
              }
            }
          ],
          "x-parser-unique-object-id": "TemperatureOutdoor"
        }
      },
      "x-parser-unique-object-id": "sensors_temperature_outdoor"
    },
    "sensors_accelerometer": {
      "address": "sensors/accelerometer",
      "description": "### Accelerometer Message\n\n| Field         | Value                                                                                                     |\n|---------------|-----------------------------------------------------------------------------------------------------------|\n| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/accelerometer                                       |\n| Schema        | [ accelerometer.json ](json-schemas/sensors/accelerometer/accelerometer.json)                             |\n| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata)                                              |\n| Producer      | PTO                                                                                                       |\n| Consumer      | PTA                                                                                                       |\n| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |\n\nExpects a message that provides aggregated acceleration measurements over a 10-second interval. Each payload must\ninclude the **minimum**, **maximum**, and **average** acceleration values along the X, Y, and Z axes.\n\n#### Message Specifications\n\n- **Message Frequency:** 6 messages per minute (every 10 seconds)\n- **Unit:** All acceleration values are reported in **g** (1 g ≈ 9.81 m/s²)\n- **Sampling Bandwidth:** ≥ 100 Hz\n- **Resolution:** ≤ 0.01 g\n\n#### Expected Orientation\n\nBy default, the schema assumes the accelerometer is mounted so that:\n\n- **X-axis** points **forward** (toward the vehicle’s front)\n- **Y-axis** points **left** (toward the vehicle’s left side)\n- **Z-axis** points **up** (toward the vehicle’s roof)\n\nIf no orientation override fields are present, consumers should interpret the numerical values according to these\ndefaults.\n\n#### Orientation Overrides\n\nProducers may optionally set `xOrientation`, `yOrientation` or `zOrientation`, each of which must be one of the six\nvalues: **F** (forward), **B** (backward), **L** (left), **R** (right), **U** (up) or **D** (down). If none are\nprovided, the system assumes `xOrientation = \"F\"`, `yOrientation = \"L\"`, and `zOrientation = \"U\"`.\n\nFor a valid override, exactly one axis must be aligned along the forward/backward direction (F or B), exactly one along\nthe up/down direction (U or D), and exactly one along the left/right direction (L or R). In other words, among the three\nfields there must be one value from { F, B }, one from { U, D }, and one from { L, R }. Any other combination is\nconsidered invalid and must be corrected before publishing.\n",
      "messages": {
        "Accelerometer": {
          "name": "Accelerometer",
          "payload": {
            "schemaFormat": "application/schema+json;version=draft-07",
            "schema": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/sensors/accelerometer/accelerometer.json",
              "type": "object",
              "title": "Accelerometer",
              "description": "Schema for accelerometer sensor data. Accelerations are measured along the sensor's axes: X points forward, Y points left, and Z points upward. 'Forward' is defined relative to the vehicle's front (as configured or physically marked). All acceleration values are in units of g (where 1g ≈ 9.81 m/s²). Any divergence from the standard must be specified using the optional axis orientation overrides (fields xOrientation, yOrientation, and zOrientation).",
              "required": [
                "eventTimestamp",
                "traceId",
                "messageNumber",
                "sensorId",
                "xMin",
                "xMax",
                "xAvg",
                "yMin",
                "yMax",
                "yAvg",
                "zMin",
                "zMax",
                "zAvg"
              ],
              "properties": {
                "eventTimestamp": {
                  "$id": "#/properties/eventTimestamp",
                  "type": "string",
                  "description": "ISO 8601 timestamp in UTC (must end with 'Z'), indicating when the measurement was taken",
                  "example": "2025-05-13T12:00:00.000Z"
                },
                "traceId": {
                  "$id": "#/properties/traceId",
                  "type": "string",
                  "description": "Unique identifier for tracing this message",
                  "example": "baf3d8ac-1234-4e0c-9e9e-abc123def456"
                },
                "messageNumber": {
                  "$id": "#/properties/messageNumber",
                  "type": "integer",
                  "description": "Sequence number, increased by one for each new message",
                  "example": 27
                },
                "sensorId": {
                  "$id": "#/properties/sensorId",
                  "type": "string",
                  "description": "Unique identifier for the sensor. Typically the serial number (S/N) from the sensor.",
                  "example": "SN-456789"
                },
                "xMin": {
                  "$id": "#/properties/xMin",
                  "type": "number",
                  "description": "Minimum X acceleration (in g)",
                  "example": -0.059570834
                },
                "xMax": {
                  "$id": "#/properties/xMax",
                  "type": "number",
                  "description": "Maximum X acceleration (in g)",
                  "example": 0.108400127
                },
                "xAvg": {
                  "$id": "#/properties/xAvg",
                  "type": "number",
                  "description": "Average X acceleration (in g)",
                  "example": 0.027750913
                },
                "yMin": {
                  "$id": "#/properties/yMin",
                  "type": "number",
                  "description": "Minimum Y acceleration (in g)",
                  "example": 0.023440518
                },
                "yMax": {
                  "$id": "#/properties/yMax",
                  "type": "number",
                  "description": "Maximum Y acceleration (in g)",
                  "example": 0.129880276
                },
                "yAvg": {
                  "$id": "#/properties/yAvg",
                  "type": "number",
                  "description": "Average Y acceleration (in g)",
                  "example": 0.073010342
                },
                "zMin": {
                  "$id": "#/properties/zMin",
                  "type": "number",
                  "description": "Minimum Z acceleration (in g)",
                  "example": 0.878910442
                },
                "zMax": {
                  "$id": "#/properties/zMax",
                  "type": "number",
                  "description": "Maximum Z acceleration (in g)",
                  "example": 1.109380158
                },
                "zAvg": {
                  "$id": "#/properties/zAvg",
                  "type": "number",
                  "description": "Average Z acceleration (in g)",
                  "example": 0.993550981
                },
                "xOrientation": {
                  "$id": "#/definitions/axisOrientation",
                  "type": "string",
                  "enum": [
                    "F",
                    "B",
                    "L",
                    "R",
                    "U",
                    "D"
                  ],
                  "description": "Override for an axis orientation: F=forward, B=backward, L=left, R=right, U=up, D=down."
                },
                "yOrientation": {
                  "$id": "#/definitions/axisOrientation",
                  "type": "string",
                  "enum": [
                    "F",
                    "B",
                    "L",
                    "R",
                    "U",
                    "D"
                  ],
                  "description": "Override for an axis orientation: F=forward, B=backward, L=left, R=right, U=up, D=down."
                },
                "zOrientation": {
                  "$id": "#/definitions/axisOrientation",
                  "type": "string",
                  "enum": [
                    "F",
                    "B",
                    "L",
                    "R",
                    "U",
                    "D"
                  ],
                  "description": "Override for an axis orientation: F=forward, B=backward, L=left, R=right, U=up, D=down."
                }
              },
              "additionalProperties": true
            }
          },
          "examples": [
            {
              "name": "Accelerometer with no orientation overrides",
              "payload": {
                "eventTimestamp": "2025-05-13T12:00:00.000Z",
                "traceId": "baf3d8ac-1234-4e0c-9e9e-abc123def456",
                "messageNumber": 27,
                "sensorId": "SN-456789",
                "xMin": -0.059570834,
                "xMax": 0.108400127,
                "xAvg": 0.027750913,
                "yMin": 0.023440518,
                "yMax": 0.129880276,
                "yAvg": 0.073010342,
                "zMin": 0.878910442,
                "zMax": 1.109380158,
                "zAvg": 0.993550981
              }
            },
            {
              "name": "Accelerometer with x and Y orientation override",
              "payload": {
                "eventTimestamp": "2025-05-13T12:00:00.000Z",
                "traceId": "baf3d8ac-1234-4e0c-9e9e-abc123def456",
                "messageNumber": 27,
                "sensorId": "SN-456789",
                "xMin": 0.023440518,
                "xMax": 0.129880276,
                "xAvg": 0.073010342,
                "yMin": 0.059570834,
                "yMax": -0.108400127,
                "yAvg": -0.027750913,
                "zMin": 0.878910442,
                "zMax": 1.109380158,
                "zAvg": 0.993550981,
                "xOrientation": "L",
                "yOrientation": "B"
              }
            },
            {
              "name": "Accelerometer with X, Y and Z orientation override",
              "payload": {
                "eventTimestamp": "2025-05-13T12:00:00.000Z",
                "traceId": "baf3d8ac-1234-4e0c-9e9e-abc123def456",
                "messageNumber": 27,
                "sensorId": "SN-456789",
                "yMin": 0.059570834,
                "yMax": -0.108400127,
                "yAvg": -0.027750913,
                "xMin": -0.023440518,
                "xMax": 0.129880276,
                "xAvg": 0.073010342,
                "zMin": -0.878910442,
                "zMax": -1.109380158,
                "zAvg": -0.993550981,
                "xOrientation": "R",
                "yOrientation": "B",
                "zOrientation": "D"
              }
            }
          ],
          "x-parser-unique-object-id": "Accelerometer"
        }
      },
      "x-parser-unique-object-id": "sensors_accelerometer"
    }
  },
  "operations": {
    "sendDestinationDisplayOverride": {
      "action": "send",
      "channel": "$ref:$.channels.di_override_attempt_destination_display",
      "messages": [
        "$ref:$.channels.di_override_attempt_destination_display.messages.DestinationDisplayOverride"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDestinationDisplayOverride"
    },
    "sendActiveCab": {
      "action": "send",
      "channel": "$ref:$.channels.pe_active_cab",
      "messages": [
        "$ref:$.channels.pe_active_cab.messages.ActiveCab"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "sendActiveCab"
    },
    "receiveAudio": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_audio",
      "messages": [
        "$ref:$.channels.pe_audio.messages.Audio"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "receiveAudio"
    },
    "sendVixCardreaderDiagnostics": {
      "action": "send",
      "channel": "$ref:$.channels.pe_cardreader_diagnostics_vix_deviceRef",
      "messages": [
        "$ref:$.channels.pe_cardreader_diagnostics_vix_deviceRef.messages.VixCardreaderDiagnostics"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendVixCardreaderDiagnostics"
    },
    "sendCbtcTripActivated": {
      "action": "send",
      "channel": "$ref:$.channels.pe_cbtc_trip_activated",
      "messages": [
        "$ref:$.channels.pe_cbtc_trip_activated.messages.TripActivated"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendCbtcTripActivated"
    },
    "sendCbtcNextStop": {
      "action": "send",
      "channel": "$ref:$.channels.pe_cbtc_next_stop",
      "messages": [
        "$ref:$.channels.pe_cbtc_next_stop.messages.CbtcNextStop"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendCbtcNextStop"
    },
    "sendCbtcTargetDistance": {
      "action": "send",
      "channel": "$ref:$.channels.pe_cbtc_target_distance",
      "messages": [
        "$ref:$.channels.pe_cbtc_target_distance.messages.TargetDistance"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendCbtcTargetDistance"
    },
    "sendDoorsIndividually": {
      "action": "send",
      "channel": "$ref:$.channels.pe_doors_individually",
      "messages": [
        "$ref:$.channels.pe_doors_individually.messages.DoorsIndividually"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDoorsIndividually"
    },
    "sendDpiAcknowledge": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_ack",
      "messages": [
        "$ref:$.channels.pe_dpi_ack.messages.DpiAcknowledge"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiAcknowledge"
    },
    "receiveDpiArriving": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_arriving",
      "messages": [
        "$ref:$.channels.pe_dpi_arriving.messages.DpiArriving"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "receiveDpiArriving"
    },
    "receiveDpiCommand": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_command",
      "messages": [
        "$ref:$.channels.pe_dpi_command.messages.DpiCommand"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "receiveDpiCommand"
    },
    "sendDpiCommandResponse": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_command_response",
      "messages": [
        "$ref:$.channels.pe_dpi_command_response.messages.DpiCommandResponse"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiCommandResponse"
    },
    "sendDpiConnectionStatus": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_connection_status",
      "messages": [
        "$ref:$.channels.pe_dpi_connection_status.messages.DpiConnectionStatus"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "sendDpiConnectionStatus"
    },
    "receiveDpiConnections": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_connections",
      "messages": [
        "$ref:$.channels.pe_dpi_connections.messages.DpiConnections"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "receiveDpiConnections"
    },
    "sendDpiDiagnostics": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_diagnostics",
      "messages": [
        "$ref:$.channels.pe_dpi_diagnostics.messages.DpiDiagnostics"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiDiagnostics"
    },
    "sendDpiDisplayStatus": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_display_status",
      "messages": [
        "$ref:$.channels.pe_dpi_display_status.messages.DpiDisplayStatus"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiDisplayStatus"
    },
    "sendDpiEmergency": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_emergency",
      "messages": [
        "$ref:$.channels.pe_dpi_emergency.messages.DpiEmergency"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiEmergency"
    },
    "receiveDpiEta": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_eta",
      "messages": [
        "$ref:$.channels.pe_dpi_eta.messages.DpiEta"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "receiveDpiEta"
    },
    "receiveDpiExternaldisplay": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_externaldisplay",
      "messages": [
        "$ref:$.channels.pe_dpi_externaldisplay.messages.DpiExternaldisplay"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiExternaldisplay"
    },
    "receiveDpiFeatureToggle": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_feature_toggle",
      "messages": [
        "$ref:$.channels.pe_dpi_feature_toggle.messages.DpiFeatureToggle"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiFeatureToggle"
    },
    "receiveDpiJourney": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_journey",
      "messages": [
        "$ref:$.channels.pe_dpi_journey.messages.DpiJourney"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiJourney"
    },
    "receiveDpiKeyStops": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_key_stops",
      "messages": [
        "$ref:$.channels.pe_dpi_key_stops.messages.DpiKeyStops"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiKeyStops"
    },
    "sendDpiLogs": {
      "action": "send",
      "channel": "$ref:$.channels.pe_dpi_logs",
      "messages": [
        "$ref:$.channels.pe_dpi_logs.messages.DpiLogs"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDpiLogs"
    },
    "receiveDpiNextstop": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_nextstop",
      "messages": [
        "$ref:$.channels.pe_dpi_nextstop.messages.DpiNextstop"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiNextstop"
    },
    "receiveDpiPa": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_dpi_pa",
      "messages": [
        "$ref:$.channels.pe_dpi_pa.messages.DpiPa"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveDpiPa"
    },
    "receiveApi": {
      "action": "receive",
      "channel": "$ref:$.channels.pe_vehicle_api",
      "messages": [
        "$ref:$.channels.pe_vehicle_api.messages.Api"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "receiveApi"
    },
    "sendCoupling": {
      "action": "send",
      "channel": "$ref:$.channels.status_coupling",
      "messages": [
        "$ref:$.channels.status_coupling.messages.Coupling"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendCoupling"
    },
    "sendOffline": {
      "action": "send",
      "channel": "$ref:$.channels.status_offline",
      "messages": [
        "$ref:$.channels.status_offline.messages.Offline"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "sendOffline"
    },
    "sendDoorsAvailable": {
      "action": "send",
      "channel": "$ref:$.channels.status_doors_available",
      "messages": [
        "$ref:$.channels.status_doors_available.messages.DoorsAvailable"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDoorsAvailable"
    },
    "sendDoorRequestOpen": {
      "action": "send",
      "channel": "$ref:$.channels.status_door_request_open",
      "messages": [
        "$ref:$.channels.status_door_request_open.messages.DoorRequestOpen"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendDoorRequestOpen"
    },
    "sendApc": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_apc_sensorId",
      "messages": [
        "$ref:$.channels.sensors_apc_sensorId.messages.Apc"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendApc"
    },
    "sendDoor": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_door",
      "messages": [
        "$ref:$.channels.sensors_door.messages.Door"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": true
        }
      },
      "x-parser-unique-object-id": "sendDoor"
    },
    "sendLocation": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_location",
      "messages": [
        "$ref:$.channels.sensors_location.messages.Location"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendLocation"
    },
    "sendOdometer": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_odometer",
      "messages": [
        "$ref:$.channels.sensors_odometer.messages.Odometer"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendOdometer"
    },
    "sendTemperatureIndoor": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_temperature_indoor",
      "messages": [
        "$ref:$.channels.sensors_temperature_indoor.messages.TemperatureIndoor"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendTemperatureIndoor"
    },
    "sendTemperatureOutdoor": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_temperature_outdoor",
      "messages": [
        "$ref:$.channels.sensors_temperature_outdoor.messages.TemperatureOutdoor"
      ],
      "bindings": {
        "mqtt": {
          "qos": 0,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendTemperatureOutdoor"
    },
    "sendAccelerometer": {
      "action": "send",
      "channel": "$ref:$.channels.sensors_accelerometer",
      "messages": [
        "$ref:$.channels.sensors_accelerometer.messages.Accelerometer"
      ],
      "bindings": {
        "mqtt": {
          "qos": 1,
          "retain": false
        }
      },
      "x-parser-unique-object-id": "sendAccelerometer"
    }
  },
  "components": {
    "messages": {
      "DestinationDisplayOverride": "$ref:$.channels.di_override_attempt_destination_display.messages.DestinationDisplayOverride",
      "ActiveCab": "$ref:$.channels.pe_active_cab.messages.ActiveCab",
      "Audio": "$ref:$.channels.pe_audio.messages.Audio",
      "VixCardreaderDiagnostics": "$ref:$.channels.pe_cardreader_diagnostics_vix_deviceRef.messages.VixCardreaderDiagnostics",
      "TripActivated": "$ref:$.channels.pe_cbtc_trip_activated.messages.TripActivated",
      "CbtcNextStop": "$ref:$.channels.pe_cbtc_next_stop.messages.CbtcNextStop",
      "TargetDistance": "$ref:$.channels.pe_cbtc_target_distance.messages.TargetDistance",
      "DoorsIndividually": "$ref:$.channels.pe_doors_individually.messages.DoorsIndividually",
      "DpiAcknowledge": "$ref:$.channels.pe_dpi_ack.messages.DpiAcknowledge",
      "DpiArriving": "$ref:$.channels.pe_dpi_arriving.messages.DpiArriving",
      "DpiCommand": "$ref:$.channels.pe_dpi_command.messages.DpiCommand",
      "DpiCommandResponse": "$ref:$.channels.pe_dpi_command_response.messages.DpiCommandResponse",
      "DpiConnectionStatus": "$ref:$.channels.pe_dpi_connection_status.messages.DpiConnectionStatus",
      "DpiConnections": "$ref:$.channels.pe_dpi_connections.messages.DpiConnections",
      "DpiDiagnostics": "$ref:$.channels.pe_dpi_diagnostics.messages.DpiDiagnostics",
      "DpiDisplayStatus": "$ref:$.channels.pe_dpi_display_status.messages.DpiDisplayStatus",
      "DpiEmergency": "$ref:$.channels.pe_dpi_emergency.messages.DpiEmergency",
      "DpiEta": "$ref:$.channels.pe_dpi_eta.messages.DpiEta",
      "DpiExternaldisplay": "$ref:$.channels.pe_dpi_externaldisplay.messages.DpiExternaldisplay",
      "DpiFeatureToggle": "$ref:$.channels.pe_dpi_feature_toggle.messages.DpiFeatureToggle",
      "DpiJourney": "$ref:$.channels.pe_dpi_journey.messages.DpiJourney",
      "DpiKeyStops": "$ref:$.channels.pe_dpi_key_stops.messages.DpiKeyStops",
      "DpiLogs": "$ref:$.channels.pe_dpi_logs.messages.DpiLogs",
      "DpiNextstop": "$ref:$.channels.pe_dpi_nextstop.messages.DpiNextstop",
      "DpiPa": "$ref:$.channels.pe_dpi_pa.messages.DpiPa",
      "Api": "$ref:$.channels.pe_vehicle_api.messages.Api",
      "Coupling": "$ref:$.channels.status_coupling.messages.Coupling",
      "Offline": "$ref:$.channels.status_offline.messages.Offline",
      "DoorsAvailable": "$ref:$.channels.status_doors_available.messages.DoorsAvailable",
      "DoorRequestOpen": "$ref:$.channels.status_door_request_open.messages.DoorRequestOpen",
      "Apc": "$ref:$.channels.sensors_apc_sensorId.messages.Apc",
      "Door": "$ref:$.channels.sensors_door.messages.Door",
      "Location": "$ref:$.channels.sensors_location.messages.Location",
      "Odometer": "$ref:$.channels.sensors_odometer.messages.Odometer",
      "TemperatureIndoor": "$ref:$.channels.sensors_temperature_indoor.messages.TemperatureIndoor",
      "TemperatureOutdoor": "$ref:$.channels.sensors_temperature_outdoor.messages.TemperatureOutdoor",
      "Accelerometer": "$ref:$.channels.sensors_accelerometer.messages.Accelerometer"
    },
    "parameters": {
      "authorityId": {
        "description": "The ID of the Public Transport Authority / PTA"
      },
      "operatorId": {
        "description": "The ID of the Public Transport Operator / PTO"
      },
      "vehicleId": {
        "description": "The vehicle ID."
      },
      "sensorId": "$ref:$.channels.sensors_apc_sensorId.parameters.sensorId",
      "deviceRef": "$ref:$.channels.pe_cardreader_diagnostics_vix_deviceRef.parameters.deviceRef"
    },
    "securitySchemes": {
      "user-password": "$ref:$.servers.mqttTranshub.security[0]"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault","useChannelAddressAsIdentifier":true}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  