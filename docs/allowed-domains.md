# Allowed Domains

## Overview

Tet Digital publishes a allowed domain list, this list of domains should be accessible from the screens on board the vehicle.  

| Environment | URL                                                    | Purpose                                                        |
|-------------|--------------------------------------------------------|----------------------------------------------------------------|
| Prod        | https://pto-api.transhub.io/allowed-domains.json       | All vehicles running regular routes                            |
| Stage       | https://pto-api.stage.transhub.io/allowed-domains.json | Test rigs, vehicles being tested before running regular routes |

These locations should be checked once daily, at a minimum, after 16.00 CET, which is our cutoff for changes for the day, Monday to Friday.

It is expected that new domains should be reachable on all vehicle screens running in regular traffic after 05.00 CET the following day.

## Network Requirements

- The system must have access to a DNS service to resolve domain names.
- The screen and browser must have internet access, with port 443 open for secure communication.

## Contents of file

```json
{
  "timestamp": "2025-05-31T07:49:14Z",
  "allowedDomains": [
    "*.transhub.io",
    "*.tetdigital.no"
  ]
}

```

When a new version of the packages is published the timestamp will increment.
