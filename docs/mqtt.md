# MQTT

MQTT is light-weight pub-sub messaging protocol often used for machine-to-machine (M2M)/"Internet of Things" communication. It is one of the standard communication protocols defined in ITxPT, and the way vehicles are supposed to communicate with Ruter.

!!! note "ITxPT"
    MQTT is a fairly new addition to the ITxPT standard, and is currently a work in progress. 
    Ruter is an active member in the international standard committee.

For more information, see: 
- [MQTT.org](https://mqtt.org)
- [ITxPT](https://itxpt.org)

## Architecture
Two key elements of the architecture are the MQTT broker and the MQTT bridges. 

### MQTT broker (Ruter)
Ruter operates a central MQTT broker that communicates with all the vehicles. The server currently supports the MQTT protocol versions 5.0 and 3.1.1. 

?> _Notice_ To use MQTT protocol version 5.0, make sure that the client library supports it.

All communication with the MQTT broker is encrypted during transport using TLS 1.2. 

### MQTT bridge (On-board Vehicle)

The operator is to maintain a MQTT bridge on board the vehicle. The MQTT bridge acts as a proxy and forwards requests back and forth between the vehicle and Ruter. 

To get access to the MQTT broker, you need to reach out to Ruter to be provided with credentials. 

There is no strict requirement as to what implementation you chose of the mqtt bridge, as long as it is stable and fullfills the standard. 

There are multiple open-source solutions to choose from, i.e. [https://mosquitto.org](https://mosquitto.org/).  

#### Example configuration file (Mosquitto)

```
port 1883
listener 9883
protocol websockets
log_type all
log_timestamp true

connection_messages true
allow_anonymous true

#
# Ruter MQTT Bridge
#
connection bus-to-authority-bridge
address mqtt.test.transhub.io:8883
remote_username *****
remote_password *****
bridge_attempt_unsubscribe true
bridge_protocol_version mqttv311
bridge_tls_version tlsv1.2
bridge_cafile /usr/local/etc/mosquitto/conf.d/amazon.ca.pem
bridge_insecure false
cleansession true
try_private true
start_type automatic
restart_timeout 10

# Subscribe for these topics
# topic type in/out qos shortroute longroute
topic json in 1 infohub/dpi/journey/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/journey/
topic json in 1 infohub/dpi/externaldisplay/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/externaldisplay/
topic json in 1 infohub/dpi/nextstop/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/nextstop/
topic json in 1 infohub/dpi/eta/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/eta/
topic json in 1 infohub/dpi/announcement/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/announcement/
topic json in 1 infohub/dpi/deviation/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/deviation/
topic json in 1 infohub/dpi/audio/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/audio/
topic json in 1 infohub/dpi/arriving/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/arriving/
topic json in 1 infohub/dpi/c2/ OPERATOR_ID/ruter/VEHICLE_ID/itxpt/ota/dpi/c2/
topic json out 1 infohub/dpi/diagnostics/ ruter/OPERATOR_ID/VEHICLE_ID/itxpt/ota/dpi/diagnostics/

```

## Updating configurations and DPI content

Ruter reserves the right to update the topic configuration and content packages when it deems it necessary. 

While the PTO is responsible for setting up the mqtt bridge configuration correctly according to the software running on the vehicle, Ruter provides an api listing all the topics that should be made available for the services on-board the vehicle. 

A description of the process can be found in the document below: 
- [MQTT topic updates](https://ruterno.github.io/ota-schemas/mqtt-updates/index.html)


### JSON Schemas

Link to JSON schemas for communication with Ruter Backend APIs:
* [Schemas for backend APIs](https://github.com/RuterNo/ota-schemas/tree/master/schemas/cdn)

### Example payloads

Link to example Ruter Backend API payloads: 
* [Ruter Backend API payloads](https://github.com/RuterNo/ota-schemas/tree/master/examples/cdn)


