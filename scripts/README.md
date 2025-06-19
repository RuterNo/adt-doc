# AsyncAPI Schema Validator and Generator - Complete File Guide

## Project File Structure Overview

Each message in the API requires a set of coordinated files that work together to define, document, and validate the message format. Here's a detailed description of each file type and its purpose:

## 1. Schema File (`.json`)

The schema file defines the structure and validation rules for the message payload using JSON Schema Draft-07.

### Key Components:

- **`$id`**: Automatically set to `https://schemas.ruter.no/adt/ota/api/v4.x/[path]`
- **`$schema`**: Set to `http://json-schema.org/draft-07/schema#`
- **`title`**: Automatically generated from the filename (camelCase)
- **`type`**: Usually `"object"`
- **`properties`**: Defines the fields in the message
- **`required`**: Lists which properties are mandatory

### Example:

```json
{
  "$id": "https://schemas.ruter.no/adt/ota/api/v4.x/vehicle_status/vehicle_status.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VehicleStatus",
  "type": "object",
  "properties": {
    "timestamp": {
      "$id": "#/properties/timestamp",
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp for when the status was recorded"
    },
    "status": {
      "$id": "#/properties/status",
      "type": "string",
      "enum": ["active", "inactive", "outOfService"]
    }
  },
  "required": ["timestamp", "status"]
}
```

## 2. Metadata File (`.meta.json`)

The metadata file is a critical component of the schema validation and AsyncAPI generation process. Each schema must have an associated `.meta.json` file that defines how the message is used in the system.

### Required Structure

```json
{
  "mode": "publish|subscribe",
  "mqtt": {
    "qos": 0|1|2,
    "retain": true|false,
    "topic": "auto-generated-during-processing",
    "params": ["optional", "topic", "parameters"]
  },
  "service-level": "internal|external",
  "maintainers": ["team-name"],
  "producers": ["team-name"],
  "consumers": ["team-name"],
  "vehicleCentric": true|false
}
```

### Field Descriptions

#### Core Fields

- **`mode`**: Defines the message direction
    - `publish`: Messages sent from PTA to PTO
    - `subscribe`: Messages sent from PTO to PTA

- **`vehicleCentric`**: Determines the topic structure
    - `true`: Messages related to a specific vehicle (default)
    - `false`: Messages related to backoffice operations

- **`service-level`**: Defines the API stability guarantee
    - `internal`: ⛔ PTA internal API with no stability guarantees
    - `external`: ✅ External API with backward compatibility guarantees

#### Team Assignments

- **`maintainers`**: Teams responsible for maintaining the schema
    - Example: `["assignment", "dpi"]`
    - Valid options: `sales`, `pto`, `pta`, `dpi`, `assignment`

- **`producers`**: Teams that produce/send these messages
    - Example: `["pto"]`

- **`consumers`**: Teams that consume/receive these messages
    - Example: `["pta"]`

#### MQTT Configuration

- **`mqtt`**: MQTT-specific settings
    - **`qos`**: Quality of Service level (0, 1, or 2)
    - **`retain`**: Whether messages should be retained by the broker
    - **`params`**: Additional parameters to include in the topic path
        - Example: `["lineRef", "journeyRef"]` would create a topic like `{operatorId}/{authorityId}/{vehicleId}/adt/v4/channel/lineRef/journeyRef`

### Topic Generation

The tool automatically generates the MQTT topic based on the metadata:

1. Direction prefix:
    - For `mode: "publish"`: `{authorityId}/{operatorId}`
    - For other modes: `{operatorId}/{authorityId}`

2. Entity type:
    - For `vehicleCentric: true`: `/{vehicleId}`
    - For `vehicleCentric: false`: `/backoffice`

3. API path: `/adt/v4/{channel}`

4. Parameters: If `mqtt.params` is defined, each parameter is appended as `/{paramName}`

### Example Metadata Files

#### Vehicle-centric message from PTO to PTA:

```json
{
  "mode": "subscribe",
  "mqtt": {
    "qos": 1,
    "retain": false
  },
  "service-level": "external",
  "maintainers": ["assignment"],
  "producers": ["pto"],
  "consumers": ["pta"],
  "vehicleCentric": true
}
```

Generated topic: `{operatorId}/{authorityId}/{vehicleId}/adt/v4/{channel}`

#### Backoffice message from PTA to PTO with parameters:

```json
{
  "mode": "publish",
  "mqtt": {
    "qos": 1,
    "retain": true,
    "params": ["lineRef"]
  },
  "service-level": "internal",
  "maintainers": ["dpi"],
  "producers": ["pta"],
  "consumers": ["pto"],
  "vehicleCentric": false
}
```

Generated topic: `{authorityId}/{operatorId}/backoffice/adt/v4/{channel}/{lineRef}`


## 3. Documentation File (`.md`)

The documentation file provides human-readable information about the message's purpose, structure, and usage.

### Required Format:

The file must include a table with specific rows that the script will automatically update:

```markdown
# Vehicle Status Message

Description of what this message represents and when it's used.

## Message Information

| Field          | Value                                      |
|----------------|:-------------------------------------------|
| Maintainer     | [PTA Assignment](https://github.com/orgs/RuterNo/teams/assignment) |
| Central Topic  | {operatorId}/{authorityId}/{vehicleId}/adt/v4/vehicle_status |
| Schema         | [vehicle_status.json](asyncapi/json-schemas/vehicle_status/vehicle_status.json) |
| Producer       | PTO |
| Consumer       | [PTA Assignment](https://github.com/orgs/RuterNo/teams/assignment) |
| Service Level  | ✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version. |

## Message Structure

Detailed explanation of the fields and their meanings...
```

The script will automatically update the table rows based on the metadata file.

## 4. Example Files (`_example.json`)

Example files demonstrate valid message payloads that conform to the schema. Each schema must have at least one example.

### Naming Conventions:

- `schema_name_example.json`: Basic example
- `schema_name_special_case_example.json`: Examples for specific scenarios

### Structure:

```json
{
  "payload": {
    "timestamp": "2025-06-19T10:30:00Z",
    "status": "active"
  }
}
```

The `payload` property contains the actual message content that would be sent over MQTT.

## 5. AsyncAPI Specification (`asyncapi.yml`)

This is the generated output file that combines all the individual schemas into a complete API specification. The script updates this file based on the schemas, metadata, and documentation.

### Key Sections:

- **`info`**: General API information
- **`channels`**: Defines all the message topics
    - Each channel includes:
        - Description (references the `.md` file)
        - Message definition (references the schema file)
        - Examples (references the example files)
        - MQTT bindings (from the metadata)
- **`components`**: Reusable components and parameters

## Usage Process

When running the script, the following steps occur for each schema:

1. **Schema Validation**:
    - Ensures the schema follows JSON Schema Draft-07 rules
    - Verifies that all required fields have corresponding property definitions
    - Updates schema IDs and references to follow the standard pattern

2. **Example Validation**:
    - Validates all examples against their corresponding schema
    - Reports any validation errors

3. **Metadata Processing**:
    - Validates the metadata file is complete
    - Generates the MQTT topic based on the metadata
    - Updates the metadata file with the generated topic

4. **Documentation Update**:
    - Updates the documentation file with information from the metadata
    - Ensures links to schemas and team references are correct

5. **AsyncAPI Generation**:
    - Updates the AsyncAPI specification with all the processed information
    - Organizes channels according to the generated topics
    - Includes references to schemas, documentation, and examples

## Command Line Usage

```bash
# Basic usage - validates and updates all files
python3 asyncapi_generator.py

# To only validate without writing changes
# (modify WRITE_CHANGES_TO_ASYNC_API_YML = False in the script)
python3 asyncapi_generator.py
```

## Error Handling

The script will exit with an error if:
- A schema is missing required documentation or examples
- Examples don't validate against their schema
- Required fields in a schema aren't defined in the properties

It will display warnings if:
- Metadata files are missing required fields
- Documentation doesn't follow the expected format
