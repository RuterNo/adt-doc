#!/usr/bin/python3
"""
Quick mockup to validate Assignment and produce asyncapi spec.
TODO: Validate schemas and generate asyncapi.yaml?
"""

import json
import sys
from pathlib import Path

from jsonschema import Draft7Validator, RefResolver
from jsonschema.exceptions import RefResolutionError
from ruamel.yaml import YAML

ruamel_yaml = YAML(typ='rt')
ruamel_yaml.indent(mapping=2, sequence=4, offset=2)
ruamel_yaml.width = 4096

WRITE_CHANGES_TO_ASYNC_API_YML = False

API_VERSION_MAJOR = "3"
API_VERSION_MINOR = "0"
SCHEMA_ID_PREFIX = f"https://schemas.ruter.no/adt/ota/api/v{API_VERSION_MAJOR}.{API_VERSION_MINOR}"
JSON_SCHEMA_VERSION = "http://json-schema.org/draft-07/schema#"

SCHEMA_ROOT = Path("asyncapi/json-schemas")
PROJECT_ROOT = SCHEMA_ROOT.parent

CREATE_META_IF_MISSING = False
META_FILE_TEMPLATE = {'mode': 'TODO', 'mqtt': {'qos': 'TODO', 'retain': 'TODO'}, "topic": "TODO"}

SERVICE_LEVELS = {
    'internal': '⛔ Ruter internal API. No restrictions apply. Api may be removed or modified freely by Ruter within major version.',
    'external': '✅ External API. Restrictions apply. Only backward compatible changes may happen within the major version.'
}

TEAMS = {
    'sales': 'Ruter Sales',
    'pto': 'PTO',
    'ruter': 'Ruter BO',
    'dpi': '[Ruter DPI](https://github.com/orgs/RuterNo/teams/dpi-team)',
    'assignment': '[Ruter Assignment](https://github.com/orgs/RuterNo/teams/assignment)'
}


def j_print(dict_):
    print(json.dumps(dict_, indent=2, default=str))


def read_yaml(path):
    with open(path) as stream:
        try:
            return ruamel_yaml.load(stream)
        except Exception as exc:
            print(exc)
            return None


def read_json(path):
    with open(path, "r") as user_file:
        return json.loads(user_file.read())


def read_file(path):
    with open(path, "r") as f:
        return [line.replace("\n", "") for line in f]


def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)


def write_bytes_to_file(path, content):
    with open(path, "wb") as f:
        f.write(content)


def write_json(path, content):
    json_string = (json.dumps(content, indent=2, default=str, ensure_ascii=False) + "\n").encode("UTF-8")
    write_bytes_to_file(path, json_string)


def resolve_schemas():
    schema_paths = list(set([p for p in PROJECT_ROOT.rglob("*.json") if 'common' not in str(p) and 'meta' not in str(p) and 'example' not in str(p)]))

    res = {}
    for schema_path in schema_paths:
        examples = [str(p) for p in schema_path.parent.rglob(f"*example.json") if schema_path.stem in str(p)]
        examples.extend([str(p) for p in PROJECT_ROOT.rglob(f"*{schema_path.name}*") if 'examples' in str(p)])
        examples.extend([str(p) for p in PROJECT_ROOT.rglob(f"*{schema_path.stem}_*.json") if 'examples' in str(p)])
        meta = [str(p) for p in PROJECT_ROOT.rglob(f"*{schema_path.stem}.meta.json")]
        doc = [str(p) for p in PROJECT_ROOT.rglob(f"*{schema_path.stem}.md")]

        if not meta:
            if CREATE_META_IF_MISSING:
                print(f"Creating missing meta {str(schema_path)}")
                meta_name = f"{schema_path.stem}.meta.json"
                meta_path = schema_path.parent.joinpath(meta_name)
                write_json(meta_path, META_FILE_TEMPLATE)
                meta = [str(meta_path)]
            else:
                print(f"Skipping schema missing meta {str(schema_path)}")
                continue

        if not examples:
            raise SystemExit(f"Missing examples {str(schema_path)}")

        if not doc:
            raise SystemExit(f"Missing doc {str(schema_path)}")

        channel = str(schema_path.parent.resolve().relative_to(SCHEMA_ROOT.resolve())).replace("-", "_")
        name = schema_path.stem

        files = {
            'channel': channel,
            'schema_path': schema_path,
            'schema_name': name,
            'schema_root_path': schema_path.parent,
            'schema_title': ''.join([*map(str.title, name.replace("_", "-").split("-"))]),
            'meta': meta[0],
            'doc': doc[0],
            'examples': examples,
        }
        if channel in res:
            SystemExit(f"incorrect folder placement {channel}: {schema_path}")

        res[str(channel)] = files
    return res


def update_schema_content(schemas):
    for channel, resolved_schema in schemas.items():
        schema_path = resolved_schema["schema_root_path"]
        spec_paths = [p for p in Path(schema_path).rglob("*.json") if "example.json" not in str(p) and "meta.json" not in str(p)]
        for spec_path in spec_paths:
            res = read_json(spec_path)
            validate_required_fields(spec_path, res)
            relative_path = spec_path.resolve().relative_to(SCHEMA_ROOT.resolve())
            expected_id = f"{SCHEMA_ID_PREFIX}/{str(relative_path)}"
            res["$id"] = expected_id
            res["$schema"] = JSON_SCHEMA_VERSION

            tmp = spec_path.stem.replace("_", "-").split("-")
            expected_title = ''.join([*map(str.title, tmp)])
            res['title'] = expected_title

            if "properties" in res:
                for key, value in res["properties"].items():
                    value["$id"] = f"#/properties/{key}"
            original = read_json(spec_path)
            if json.dumps(original) != json.dumps(res):
                write_json(spec_path, res)


def validate_required_fields(file_path, schema):
    if 'required' in schema:
        required_fields = schema["required"]
        for r in required_fields:
            if r not in schema["properties"]:
                raise SystemExit(f"Required field [{r}] not defined in {str(file_path.absolute())}")


def resolve_doc_line(line, anchor, meta, key, definitions):
    if anchor in line:
        res_key = meta[key] if key in meta else None
        res_desc = definitions[res_key] if res_key in definitions else None
        res_line = f'{anchor: <16}| {res_desc}'
        if res_key and res_desc:
            return f"{res_line: <{len(line) - 1}}|"

    return None


def update_doc(paths, meta):
    doc_path = paths['doc']
    if doc_path:
        lines = read_file(doc_path)
        res = []
        central_topic = '| Central Topic'
        schema = '| Schema'
        producer = '| Producer'
        consumer = '| Consumer'
        service_level = '| Service Level'
        for line in lines:
            res_line = None
            if central_topic in line:
                topic = meta['mqtt']['topic'] if meta else "TODO"
                central_topic_content = f"{central_topic: <16}| {topic}"
                res_line = f"{central_topic_content: <{len(line) - 1}}|"
            elif schema in line:
                schema_path = project_relative(paths['schema_path'])
                schema_content = f'{schema: <16}| [ {paths["schema_path"].name} ]({schema_path})'
                res_line = f"{schema_content: <{len(line) - 1}}|"

            res_line = resolve_doc_line(line, service_level, meta, "service-level", SERVICE_LEVELS) if not res_line else res_line
            res_line = resolve_doc_line(line, producer, meta, "producer", TEAMS) if not res_line else res_line
            res_line = resolve_doc_line(line, consumer, meta, "consumer", TEAMS) if not res_line else res_line

            if res_line:
                res.append(res_line)
            else:
                res.append(line)

        if json.dumps(lines) != json.dumps(res):
            # res[0] = f"### {paths['schema_title']} Message"
            write_file(doc_path, "\n".join(res) + "\n")


def update_meta(paths, name):
    meta_path = paths['meta']
    if meta_path:
        meta = read_json(meta_path)
        if 'mqtt' not in meta:
            meta['mqtt'] = {
                'qos': 'TODO',
                'retain': 'TODO'
            }

        mqtt = meta['mqtt']
        if 'qos' not in mqtt:
            mqtt['qos'] = 'TODO'
        if 'retain' not in mqtt:
            mqtt['retain'] = 'TODO'

        routing_prefix = '{operatorId}/ruter' if 'publish' != meta['mode'] else 'ruter/{operatorId}'
        vehicle_centric = 'vehicleCentric' not in meta or meta['vehicleCentric']
        if vehicle_centric:
            routing_prefix = routing_prefix + "/{vehicleId}"
        else:
            routing_prefix = routing_prefix + "/back_office"
        prefix = f'{routing_prefix}/adt/v{API_VERSION_MAJOR}'
        topic = f"{prefix}/{paths['channel']}"
        topic_params = mqtt['params'] if 'params' in mqtt else []

        for topic_param in topic_params:
            topic = f'{topic}/{{{topic_param}}}'

        mqtt['topic'] = topic
        paths['channel'] = topic.replace(f"{prefix}/", "")

        write_json(Path(meta_path), meta)
        validate_meta(meta, name)
        return meta
    else:
        print(f"Missing meta file {paths}")
        return None


def project_relative(path):
    return str(Path(path).resolve().relative_to(PROJECT_ROOT.resolve()))


def validate_meta(meta, name):
    fields = [
        'consumer',
        'producer',
        'service-level'
    ]

    if not meta:
        print(f"[WARN] no meta found {meta}")
    else:
        not_defined = []
        for field in fields:
            if field not in meta:
                not_defined.append(field)
        if len(not_defined) > 0:
            print(f"[WARN] {name: <50} does not define meta value for {', '.join(not_defined)}")


def update_async_api(async_api, meta, paths):
    channel = paths['channel']
    mqtt = meta['mqtt']
    schema_params = None
    if 'params' in mqtt and len(mqtt['params']) > 0:
        tmp = {}
        for param in mqtt['params']:
            tmp[param] = {
                '$ref': f'#/components/parameters/{param}'
            }
        schema_params = tmp
    async_api['channels'][channel] = {
        "description": {
            "$ref": project_relative(paths['doc'])
        },
        "parameters": None,
        meta['mode']: {
            "message": {
                "name": paths['schema_title'],
                "schemaFormat": "application/schema+json;version=draft-07",
                "payload": {
                    "$ref": project_relative(paths['schema_path'])
                },
                "examples": [{"$ref": project_relative(p)} for p in paths['examples']],
                "bindings": {
                    "mqtt": {
                        "qos": meta['mqtt']['qos'] if meta else None,
                        "retain": meta['mqtt']['retain'] if meta else None
                    }
                }
            }
        }
    }
    if schema_params and len(schema_params.keys()) > 0:
        async_api['channels'][channel]['parameters'] = schema_params
    else:
        if 'channels' in async_api and channel in async_api['channels'] and 'parameters' in async_api['channels'][channel]:
            async_api['channels'][channel].pop('parameters')


def validate_examples(schemas_):
    valid = True
    for key, schema_ in schemas_.items():
        schema_path = Path(schema_['schema_path'])
        for example_path in schema_['examples']:

            schemas = (json.load(open(source)) for source in SCHEMA_ROOT.rglob("*.json"))
            schema_store = {schema["$id"]: schema for schema in schemas if '$id' in schema}

            schema = json.load(open(schema_path))
            instance = json.load(open(example_path))
            resolver = RefResolver.from_schema(schema, store=schema_store)
            validator = Draft7Validator(schema, resolver=resolver)

            try:
                errors = sorted(validator.iter_errors(instance['payload']), key=lambda e: e.path)
                for error in errors:
                    valid = False
                    print(f"\n************************\n"
                          f"[ERROR] Example is not valid: {Path(example_path).resolve()}"
                          f"\n************************\n")
                    print(error)
            except RefResolutionError as e:
                print(e)

    if not valid:
        raise SystemExit("Examples are not valid")


def main():
    schemas = resolve_schemas()
    validate_examples(schemas)
    update_schema_content(schemas)
    asyncapi_path = Path("asyncapi/asyncapi.yml")
    async_api = read_yaml(asyncapi_path)

    for name, paths in schemas.items():
        meta = update_meta(paths, name)
        update_doc(paths, meta)
        update_async_api(async_api, meta, paths)

    ruamel_yaml.dump(
        async_api,
        asyncapi_path if WRITE_CHANGES_TO_ASYNC_API_YML else sys.stdout
    )


if __name__ == '__main__':
    main()
