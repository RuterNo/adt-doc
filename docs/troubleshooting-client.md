# Troubleshooting client

### Error Codes

We want to reduce technical jargon to passengers onboard the vehicle. We still need some technical info when debugging issues however.

Here is a list of the possible error codes we show in the bottom right corner of the screen:

- `NOC` – Client lost connection to MQTT broker (ws://mqtt-broker:9883)
- `NOJ` – Client has not received any journey message
- `EDO` – Client received an external display override message (driver decided to show something else on external displays)
- `DER` – Client received a journey message indicating this vehicle should not be transporting passengers (commonly referred to as a deadrun)
- `OFR` – The client received an eta-message with information indicating the vehicle has deviated from its planned route.

### Locating screen

If the clientId is not sufficient, you could use the more flexible/human readable `physicalId` to identify each screen amongst several onboard the vehicle.

`physicalId` can be anything the operator feels helps them to locate the screen.

The application will include both `clientId` and `physicalId` in all diagnostic messages. Please refer do [MQTT API spec](https://adt.transhub.io/latest/mqtt-api/) to read more about payload format in diagnostic messages.
