# TSP Messages

**Version 1.0**

The TSP messages (Transit Signal Priority) are used to communicate with BYMs signal priority solution.

The messages are encoded as json payloads, and you can validate any payload by using the corresponding JSON schema 
definition found in the corresponding [JSON schema repository](#JSON-Schemas).

MQTT is used as the transport mechanism for all TSP messages. MQTT is a simple pub-sub based messaging protocol, that 
works on top of TCP/IP as well as on websockets.

## Summary
The following is a summary of the messages

| Local topic                        | Change     | Receiver    | Name                                     | Comments                                                                                                                                                                                                  |
|------------------------------------|------------|-------------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bym/ruter/[vehicleRef]/[Line]/vm/v1 | yes       | BYM         | [Vehicle monitoring](#Vehicle-monitoring)| added 'v1' in topicname |
| bym/ruter/[vehicleRef]/journey/v1   | yes       | BYM         | [Journey](#Journey)                      | added 'v1' in topicname + added missing distanceMeter in journeyPattern |
| ruter/bym/[vehicleRef]/tspack/v1    | yes       | Ruter       | [TSP ack](#TSP-ack)                      | added 'v1' in topicname |

## Description of messages

### Vehicle monitoring

| | |
|-------------|-------------|
| Name          | Vehicle monitoring                                  |
| topic         | bym/ruter/[vehicleRef]/[Line]/vm/v1                 |
| qos           | 0                                                   |
| retained      | false                                               |
| frequency     | approx. 1/sec per vehicle                           |
| Schema        | vehiclemonitoring.json                              |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| offJourney          | boolean | true if the vehicle is currently off the intended journey. In that case quayRef, distanceMeter, order and delaySeconds values will freeze|
| journeyPatternRef   | string  | Reference to the journey pattern the vehicle is currently driving.|
| quayRef	          | string  | Reference to the quay that the vehicle is currently at or driving towards.|
| order               | integer | The order of the quay that the vehicle is currently at or driving towards|
| position            | geoJSON | Location of of the vehicle, GeoJSON geometry object, type Point, WGS84|
| distanceMeter	      | number  | The distance driven towards the quay that the vehicle is currently at or driving towards. Note: approximate if odometer is missing|
| occupancyPercent    | integer | The occupancy of the bus delivered in percent.|
| delaySeconds        | integer | The current delay of the vehicle compared to the plan|
| doorsOpen           | boolean | true if one or more doors are open|

#### Example payload
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "offJourney":false,
  "journeyPatternRef": "RUT:JourneyPattern:123",
  "quayRef": "NSR:Quay:123",
  "order": 1,
  "distanceMeter": 32.5,
  "position": {
    "type": "Point",
    "coordinates": [10.7522, 59.9139]
  },
  "delaySeconds": -10,
  "doorsOpen": false
}
```

### Journey

| | |
|-------------|-------------|
| Name          | Journey                                             |
| topic         | bym/ruter/[vehicleRef]/journey/v1                   |
| qos           | 1                                                   |
| retained      | true                                                |
| frequency     | approx. 1/hour per vehicle                          |
| Schema        | journey.json                                        |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| offDuty             | boolean | true if the vehicle does not currently drive a journey. If true, journeyPatternRef, line and journeyPattern will be null|
| journeyPatternRef   | string  | Reference to the journey pattern the vehicle is currently driving|
| line  	          | string  | Line number|
| destination         | string  | The name of the stopPlace of the last quay in journeyPattern|
| journeyPattern      | array   | Array of Links (see below) The complete journeyPattern the vehicle is to drive |

##### Link
| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| order               | integer | The order of the stop|
| quayRef             | string  | Reference to the quay of the stop|
| distanceMeter       | number  | The distance the vehicle intend to drive towards this stop|
| lineString          | geoJSON | The line the vehicle intend to drive. GeoJSON geometry object, type LineString, WGS84|

#### Example payload
```json
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "offDuty": false,
  "journeyPatternRef": "RUT:JourneyPattern:123",
  "line": "36E",
  "destination": "Oslo Bussterminal",
  "journeyPattern": [
    {
      "order": 1,
      "quayRef": "NSR:Quay:123",
      "distanceMeter": 0.0,
      "lineString": {
        "type": "LineString",
        "coordinates":  [[10.7522, 59.9139], [10.7522, 59.9139]]
      }
    },
    {
      "order": 2,
      "quayRef": "NSR:Quay:1234",
      "distanceMeter": 100.7,
      "lineString": {
        "type": "LineString",
        "coordinates":  [[10.7522, 59.9139], [10.7522, 59.9139]]
      }
    }
  ]
}
```

offDuty example:
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "offDuty": true,
  "journeyPatternRef": null,
  "line": null,
  "destination": null,
  "journeyPattern": null
}
```

### TSP ack

| | |
|-------------|-------------|
| Name          | TSP ack                                             |
| topic         | ruter/bym/[vehicleRef]/tspack/v1                    |
| qos           | 0                                                   |
| retained      | false                                               |
| frequency     | approx. 1/min per vehicle?                          |
| Schema        | tspack.json                                         |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| line                | string  | Line number|
| journeyPatternRef   | string  | Reference to the journey pattern the vehicle is currently driving.|
| signalRef           | string  | Reference to the signal that was triggered|
| signalName          | string  | Name of the signal/crossroads|
| signalPosition      | geoJson | Coordinates of the signal that was triggered, as defined by GeoJson type Point: [longitude, latitude]|
| priorityLevel       | string  | What priority was given|

#### Example payload
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "line": "36E",
  "journeyPatternRef": "RUT:JourneyPattern:123",
  "triggerPointRef":  "?",
  "triggerPointName":  "?",
  "triggerPointPosition": {
    "type": "Point",
    "coordinates": [10.7522, 59.9139]
  },
  "priorityLevel": "?"
}
```

## JSON Schemas

Link to JSON schemas and examples for all messages:
* [TSP MQTT schemas](https://github.com/RuterNo/tsp-mqtt-schemas)

_Notice_ The schemas are of version 0.7 of the JSON Schema standard, which is still under development. For more information, see:
[https://json-schema.org](https://json-schema.org/specification.html)
