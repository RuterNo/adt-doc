# Backoffice test

## Abstract

The purpose of these tests is to verify that the operator has implemented the [Operational API](https://adt.transhub.io/4.x/operational-api/) so that it is ready for use by their traffic leaders.

## Test procedure

To run a formal test, PTO schedules a time with TET digital that will validate the results. 

1. PTO runs the tests below from their backoffice in PTA’s test environment.
2. TET Digital verifies the  results and reports to PTA
3. PTA approves

### **Prerequisites**

- The operator has MQTT credentials to the test environment. The same credentials will be used for the Operational API.
- The operator and a contract is defined
- A planned vehicle task is defined with a number of journeys (both service journeys and deadruns if applicable.)

### **Tests**

From your backoffice perform the following tests:

| Test                                                                                      |Expected result|
|-------------------------------------------------------------------------------------------|---|
| 1. Register a deviation with code=NO_SERVICE for a journey                                |Response OK|
| 2. Register a deviation with code=NO_SERVICE for a call on a journey                |Response OK|
| 3. Register a deviation with code=NO_SIGNON for a journey                           |Response OK|
| 4. Register a deviation with code=DELAY and delayMinutes=10 for a journey           |Response OK|
| 5. Register a deviation with code=DELAY and delayMinutes=10 for a call on a journey |Response OK|
|6. Get the deviations. Verify that all deviations are returned.|Response OK|
|7. Update the DELAY deviation from step 4 to delayMinutes=15|Response OK|
|8. Update the DELAY deviation from step 4 to code=NO_SERVICE|Response OK|
|9. Delete the deviation from step 4|Response OK|
|10. Get journeys by the vehicle task id.|Response OK with a list of journeys.|
|11. Sign on with all the journeys that are returned. It is up to the operator to decide which type of journey specification to use.|Response OK|
|12. Sign off with the same vehicle id that was used in Sign on.|Response OK|
 
See examples in the [Operational API](https://adt.transhub.io/4.x/operational-api/)
