### Deviation message:
| Field         | Value                                                   |
|---------------|---------------------------------------------------------|
| Central Topic | {operatorId}/ruter/{vehicleId}/ei/deviation_information |
| Schema        | [ deviation.json ](json-schemas/deviation.json)         |

This topic provides an adapted selection of deviation and incident information that is relevant for passengers onboard 
this vehicle in scope of what the vehicle is currently doing and where it is on the current vehicle journey. The information 
is provided in the form of a list of situation messages. This topic should be blanked (provided with empty content) if 
there are no relevant situation messages. As an added precaution an expiry timestamp is included to assure that outdated information is not presented.