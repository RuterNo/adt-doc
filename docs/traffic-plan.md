# Traffic plan export API

The API is used for syncing traffic plans between operators and Ruter. Operators can either use the exported traffic 
plans directly for sign-on or compare their own traffic plans against the exported plans in order to find differences 
that may lead to sign-on failing.

## About the exports
The traffic plans are exported in NeTEx format. Each export-file contains plans related to one contract within a time 
period of 14 days. Each week new exports are generated and made available in the API. The exports have a version number 
to differentiate between exports for the same contract.

## Validation

The consistency of plan data can be done as follows:

1. Verify that the vehicle tasks are the same.
Vehicle tasks are found in the export by combining `Block` elements with the same `PrivateCode`.

2. Verify that the vehicle tasks contains the same journeys.
   A journey is identified by:
    - Trip id (Norwegian: turnummer).
      This is found in `ServiceJourney > KeyValue` with `Key` 'hastusIds'.
    - lineRef
    - direction

3. Verify that the journeys are correct:
    - start time
    - end time
    - correct stop places in the correct order.
      (This is important to be able to sign on/off parts of journeys.)

## Resources

[API Documentation](openapi/trafficplan/index.html){target=_blank .md-button }
