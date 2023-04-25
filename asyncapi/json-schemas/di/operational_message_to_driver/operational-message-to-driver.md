### Operational Message to Driver Message
| Field         | Value                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/adt/v3/di/operational_message_to_driver                                                   |
| Schema        | [ operational-message-to-driver.json ](json-schemas/di/operational_message_to_driver/operational-message-to-driver.json) |
| Producer      | -                                                                                                                        |
| Consumer      | PTO                                                                                                                      |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.                | 

Provides an operational message directed to the driver onboard this vehicle. Direction: From back-office to driver.
