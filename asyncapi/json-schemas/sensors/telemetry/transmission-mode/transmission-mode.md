### Transmission Mode Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | ruter/{operatorId}/{vehicleId}/adt/v3/sensors/telemetry/01000006                                          |
| Schema        | [ telemetry.json ](json-schemas/sensors/telemetry/telemetry.json)                                         |
| Producer      | PTO                                                                                                       |
| Consumer      | Ruter BO                                                                                                  |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. | 

Intended for hybrid vehicles. Describes the current transmission mode of the vehicle.

#### Data specification

- **Message frequency:** On change
- **Value:** `COMBUSTION` or `ELECTRIC`

#### Payload details

- **Name:** Transmission mode
- **ID:** 01000006

| Sub ID | Name              | Value Type | Description                                                                |
|--------|-------------------|------------|----------------------------------------------------------------------------|
| N/A    | Transmission mode | string     | Current transmisison mode, should be either **COMBUSTION** or **ELECTRIC** |