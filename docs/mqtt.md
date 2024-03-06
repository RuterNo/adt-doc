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
Ruter operates a central MQTT broker that communicates with all the vehicles. 

> _Notice_  Starting from ADT 3+ all vehicle bridges towards this broker are required to use the MQTT protocol version 5. 
> Support for MQTT v3.1 will be removed at a later stage.

All communication with the MQTT broker is encrypted during transport using TLS 1.2. 

!!! info "MQTT Brokers "
    To get access to the brokers, please reach out to [rdp-support@ruter.no](mailto:rdp-support@ruter.no).

    | Environment | Hostname                   | Description                                                    |
    |-------------|----------------------------|----------------------------------------------------------------|
    | PROD        | **mqtt.transhub.io**       | Production environment.                                        |
    | STAGE       | **mqtt.stage.transhub.io** | Test-environment. Used during PTO integration testing and CAT. | 

### MQTT bridge (On-board Vehicle)

The operator is to maintain a MQTT bridge on board the vehicle. The MQTT bridge acts as a proxy and forwards requests back and forth between the vehicle and Ruter. 

To get access to the MQTT broker, you need to reach out to Ruter to be provided with credentials. 

There is no strict requirement as to what implementation you chose of the mqtt bridge, as long as it is stable and fullfills the standard. 

There are multiple open-source solutions to choose from, i.e. [https://mosquitto.org](https://mosquitto.org/).  

#### Example configuration file (Mosquitto v2.0.17)

```

user mosquitto
log_type all
connection_messages true
log_timestamp true
listener 1883
listener 9883
protocol websockets
allow_anonymous true

#
# Ruter MQTT Bridge
#
connection ruter-central-mqtt-broker
address {MQTT_BROKER}:8883
bridge_cafile /etc/mosquitto/conf.d/amazon.ca.crt
remote_username {MQTT_USERNAME}
remote_password {MQTT_PASSWORD}
remote_clientid {CLIENT_ID_BASED_ON_VIN}
bridge_protocol_version mqttv50
bridge_tls_version tlsv1.2
notifications false
cleansession true
try_private true
start_type automatic
restart_timeout 10
keepalive_interval 60

# Subscribe for these topics
# topic in/out qos shortroute longroute
topic stop_button OUT 1 sensors/ ruter/{operator}/{vehicleid}/adt/v3/sensors/
topic stop_button IN 1 pe/input/ {operator}/ruter/{vehicleid}/adt/v3/pe/input/
topic door OUT 1 sensors/ ruter/{operator}/{vehicleid}/adt/v3/sensors/
topic location OUT 0 sensors/ ruter/{operator}/{vehicleid}/adt/v3/sensors/gnss/
topic odometer OUT 0 sensors/ ruter/{operator}/{vehicleid}/adt/v3/sensors/
topic # OUT 1 sensors/apc/ ruter/{operator}/{vehicleid}/adt/v3/sensors/apc/
topic # OUT 0 sensors/telemetry/ ruter/{operator}/{vehicleid}/adt/v3/sensors/telemetry/
topic status IN 1 operational/assignment/ {operator}/ruter/{vehicleid}/adt/v3/operational/assignment/
topic audio IN 1 pe/ {operator}/ruter/{vehicleid}/adt/v3/pe/
topic request OUT 1 operational/assignment/attempt/ ruter/{operator}/{vehicleid}/adt/v3/operational/assignment/attempt/
topic response IN 1 operational/assignment/attempt/ {operator}/ruter/{vehicleid}/adt/v3/operational/assignment/attempt/
topic request OUT 1 operational/assignment/omit/ ruter/{operator}/back_office/adt/v3/operational/assignment/omit/
topic response IN 1 operational/assignment/omit/ {operator}/ruter/back_office/adt/v3/operational/assignment/omit/
topic destination_display OUT 1 di/override_attempt/ ruter/{operator}/{vehicleid}/adt/v3/di/override_attempt/
topic available_destination_displays IN 1 di/ {operator}/ruter/{vehicleid}/adt/v3/di/
topic operational_message_to_driver IN 1 di/ {operator}/ruter/{vehicleid}/adt/v3/di/
topic diagnostics OUT 1 pe/sales/ ruter/{operator}/{vehicleid}/adt/v3/pe/sales/
topic current_stop IN 1 pe/sales/ ruter/{operator}/{vehicleid}/adt/v3/pe/sales/
topic # OUT 0 pe/cardreader_diagnostics/vix/ ruter/{operator}/{vehicleid}/adt/v3/pe/cardreader_diagnostics/vix/
topic # IN 1 pe/dpi/ {operator}/ruter/{vehicleid}/adt/v3/pe/dpi/
topic diagnostics OUT 1 pe/dpi/ ruter/{operator}/{vehicleid}/adt/v3/pe/dpi/
topic ack OUT 1 pe/dpi/ ruter/{operator}/{vehicleid}/adt/v3/pe/dpi/
topic doors_individually OUT 1 pe/ ruter/{operator}/{vehicleid}/adt/v3/pe/
topic door_lock OUT 1 pe/ ruter/{operator}/{vehicleid}/adt/v3/pe/
topic active_cab OUT 1 pe/ ruter/{operator}/{vehicleid}/adt/v3/pe/


```

## Updating configurations and DPI content

Ruter reserves the right to update the topic configuration and content packages when it deems it necessary.

While the PTO is responsible for setting up the mqtt bridge configuration correctly according to the software running on the vehicle, Ruter provides an api listing all the topics that should be made available for the services on-board the vehicle. 

!!! info "MQTT Topic configurations "
    
    | Environment | API version | Topic list                                                                             | Example config - Mosquitto 2.0                                                                         |
    |-------------|-------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
    | PROD        | ADT3        | [https://mqtt-api.transhub.io/v/adt3](https://mqtt-api.transhub.io/v/adt3)             | [https://mqtt-api.transhub.io/v/adt3/example](https://mqtt-api.transhub.io/v/adt3/example)             | 
    | PROD        | ADT2        | [https://mqtt-api.transhub.io/v/adt2](https://mqtt-api.transhub.io/v/adt2)             | [https://mqtt-api.transhub.io/v/adt2/example](https://mqtt-api.transhub.io/v/adt2/example)             |
    | PROD        | ADT1 / OTA  | [https://mqtt-api.transhub.io/v/adt1](https://mqtt-api.transhub.io/v/adt1)             | [https://mqtt-api.transhub.io/v/adt1/example](https://mqtt-api.transhub.io/v/adt1/example)             |
    | STAGE       | ADT3        | [https://mqtt-api.stage.transhub.io/v/adt3](https://mqtt-api.stage.transhub.io/v/adt3) | [https://mqtt-api.stage.transhub.io/v/adt3/example](https://mqtt-api.stage.transhub.io/v/adt3/example) | 
    | STAGE       | ADT2        | [https://mqtt-api.stage.transhub.io/v/adt2](https://mqtt-api.stage.transhub.io/v/adt2) | [https://mqtt-api.stage.transhub.io/v/adt2/example](https://mqtt-api.stage.transhub.io/v/adt2/example) |
    | STAGE       | ADT1 / OTA  | [https://mqtt-api.stage.transhub.io/v/adt1](https://mqtt-api.stage.transhub.io/v/adt1) | [https://mqtt-api.stage.transhub.io/v/adt1/example](https://mqtt-api.stage.transhub.io/v/adt1/example) |


These locations should be checked once daily, at a minimum, after 16.00 CET, which is our cutoff for changes for the day, Monday to Friday.
It is expected that new bridge configurations should be available on all vehicles running in regular traffic after 05.00 CET the following day.

### Additional information

A description of the process can be found in the document below: 
- [MQTT topic updates](https://ruterno.github.io/ota-schemas/mqtt-updates/index.html)

