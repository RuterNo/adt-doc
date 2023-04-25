# Traffic plan export API

The API is used for syncing traffic plans between operators and Ruter. Operators can either use the exported traffic 
plans directly for sign-on or compare their own traffic plans against the exported plans in order to find differences 
that may lead to sign-on failing. 

!!! note "comparing traffic plans"
    The following script may be used as aid for comparing plans: 
    [compare-traffic-plan](https://github.com/RuterNo/compare-traffic-plan)

## About the exports
The traffic plans are exported in NeTEx format. Each export-file contains plans related to one contract within a time 
period of 14 days. Each week new exports are generated and made available in the API. The exports have a version number 
to differentiate between exports for the same contract.

## Resources

[API Documentation](openapi/trafficplan/index.html){target=_blank .md-button }
