# Backoffice test

## Abstract

The purpose of these tests is to verify that the operator has implemented the [Operational API](https://adt.transhub.io/4.x/operational-api/) so that it is ready for use by their traffic leaders.

## Test procedure

1. PTO runs the tests below from their backoffice in PTA’s test environment.
2. TET Digital verifies the  results and reports to PTA
3. PTA approves

### **Predefined data**

- Credentials for the operator
- An operator and a contract
- A planned vehicle task with a number of journeys (both service journeys and deadruns if applicable.)

### **Tests**

From your backoffice perform the following tests:

1. Register a deviation with code=NO_SERVICE for a journey
2. Register a deviation with code=NO_SERVICE for a call on a journey
3. Register a deviation with code=NO_SIGNON for a journey
4. Register a deviation with code=DELAY and delayMinutes=10 for a journey
5. Register a deviation with code=DELAY and delayMinutes=10 for a call on a journey
6. Get the deviations. Verify that all deviations are returned.
7. Update the DELAY deviation from step 4 to delayMinutes=15
8. Update the DELAY deviation from step 4 to code=NO_SERVICE
9. Delete the deviation from step 4
10. Get journeys by the vehicle task id.
11. Sign on with all the journeys that are returned.

    It is up to the operator to decide which type of journey specification to use.

12. Sign off with the same vehicle id that was used in Sign on.