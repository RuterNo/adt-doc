### Temperature Indoor Message

| Field         | Value                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------|
| Central Topic | {authorityId}/{operatorId}/{vehicleId}/adt/v4/sensors/temperature_indoor                                  |
| Schema        | [ temperature-indoor.json ](json-schemas/sensors/temperature-indoor/temperature-indoor.json)              |
| Maintainer    | [Miljødata](https://github.com/orgs/RuterNo/teams/miljodata)                                              |
| Producer      | PTO                                                                                                       |
| Consumer      | PTA                                                                                                       |
| Service Level | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.  |

Describes the measured air temperature inside a vehicle. Each message corresponds to one
physical sensor and includes contextual information that indicates its approximate location, based on defined
temperature zones along the vehicle’s length and its vertical level if applicable.

#### Message Specifications

- **Message frequency:** 6 times per minute (every 10 seconds)
- **Unit:** Degrees Celsius (°C)
- **Resolution:** <= 1°C

### Location Semantics

To support consistent interpretation across vehicle types, each temperature message includes:

| Field   | Type  | Description                                                                                                                                   |
|---------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `zone`  | `Int` | Position along the vehicle’s length. Divided into zones (starting from front = `1`). Zone `0` is reserved exclusively for the driver's cabin. |
| `level` | `Int` | Vertical level of the sensor. Only applicable for multi-level vehicles. If not provided, it will be interpreted as `1` (platform level).      |

> **Note:** All zones are approximate and not intended to represent exact physical locations. They serve to provide a
> general understanding of where a sensor is located within the vehicle.


![Temperature Zones](json-schemas/sensors/temperature-indoor/temperature-zones.excalidraw.png)
