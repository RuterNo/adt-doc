### Expected Call message:
| Field         | Value                                                                   |
|---------------|-------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/oi/current_vehicle_journey/expected_call |
| Schema        | [ expected-call.json ](json-schemas/expected-call.json)                 |

The topic should provide a consistent set of current information describing the vehicle’s current, previous and next stop(s) 
including estimated times, observed times and additional information helping the driver to adhere to the operation control 
centre’s current plan for this vehicle. The topic is focused on the stop that the vehicle is standing at or will arrive to 
next in the case that the vehicle is between stops. The topic should be blanked (provided as a retained message with a 
zero-byte payload) if the vehicle has left the last stop and if it is not known what the next vehicle journey will be.

### ⚠️ Deprecation notice! ⚠️
Please be advised this topic is marked for deletion in later major versions of ADT.  
