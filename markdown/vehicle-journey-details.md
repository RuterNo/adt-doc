### Vehicle Journey Details message:
| Field         | Value                                                                       |
|---------------|-----------------------------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/oi/current_vehicle_journey/details           |
| Schema        | [ vehicle-journey-details.json ](json-schemas/vehicle-journey-details.json) |

This topic provides the details of the current (monitored) vehicle journey. If there is no ongoing vehicle journey, this 
topic will provide the details of the coming vehicle journey. The information should reflect the latest production plan 
including any applied control actions as known in the back-office. Note however that this does not include neither estimated 
nor observed times at the different stops. This information is instead provided on the topic 
ruter/{PTO}/{vehicleID}/oi/current_vehicle_journey/expected_call The topic should be blanked (provided as a retained 
message with a zero-byte payload) if the vehicle has left the last stop and the next vehicle journey is not known