# Standard for date and timestamps in ADT

> This page specifies date and time standards between Ruter and PTO's.
>
> The date and time standards are based on the intersection of [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339)
> and [ISO 8601-1:2019](https://www.iso.org/obp/ui#iso:std:iso:8601:-1:ed-1:v1:en).

Each schema may specify how a timestamp property should be constructed. That will have precedence over what is
specified in this document.

## Time

* `T` should be used as a separator between date and timestamp
* Timestamp can be specified in both UTZ and local time. And timezone should _always_ be specified
    * `Z` for UTC
    * `+01:00` for local winter time
    * `+02:00` for local summer time

### Event timestamp

If nothing else is specified and the schema specifies that the property is a `eventTimestamp`, the following rules
apply.

* The `eventTimestamp` should have a minimum precision of milliseconds or higher e.g. nanoseconds.


## Examples date and time
| Description                                                                             | Example                            |
|-----------------------------------------------------------------------------------------|------------------------------------|
| Date with year, month, and day                                                          | `2023-04-21`                       |
| Time with hours, minutes, and seconds                                                   | `12:42:15Z`                        |
| Time with hours, minutes, seconds, and fractional seconds (up to 9 digits)              | `12:43:12.631917Z`                 |
| Date and time in UTC timezone with hours, minutes, and seconds                          | `2023-04-21T12:42:15Z`             |
| Date and time in UTC timezone with hours, minutes, seconds, and fractional seconds      | `2023-04-21T12:43:12.631917Z`      |
| Date and time with hours, minutes, seconds, and timezone offset                         | `2023-04-21T13:44:11.718742+01:00` |
| Date and time with hours, minutes, seconds, and fractional seconds, and timezone offset | `2023-04-21T13:44:11.718742+02:00` |
| Date and time with hours, minutes, and seconds, and timezone offset from UTC            | `2023-04-21T13:44:11Z`             |





