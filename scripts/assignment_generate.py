#!/usr/bin/python3
"""
Quick mockup to validate Assignment and produce asyncapi spec.
TODO: Validate schemas and generate asyncapi.yaml?
"""

from pathlib import Path
import json
import yaml
import re

API_VERSION_MAJOR = "3"
API_VERSION_MINOR = "0"
JSON_SCHEMA_VERSION = "http://json-schema.org/draft-07/schema#"


def resolve_schemas(domain):
    res = {}

    domain_path = Path(f"./json-schemas/{domain}/")
    string_paths = [str(p) for p in domain_path.rglob(f"*.*") if 'docs' not in str(p)]

    for glob_path in domain_path.rglob("*.json"):
        if domain in str(glob_path) and "example" not in str(glob_path) and "common" not in str(glob_path) and ".meta.json" not in str(glob_path):
            name = glob_path.stem
            doc = list(filter(lambda t: str(t).endswith(f"{name}.md"), string_paths))
            examples = list(filter(lambda t: 'example.json' in str(t) and name in str(t), string_paths))
            meta = list(filter(lambda t: '.meta.json' in str(t) and name in str(t), string_paths))
            tmp = name.split("-")
            print(name)
            res[name] = {
                'schema-file': str(glob_path.absolute()),
                'schema-file-name': str(glob_path.name),
                'doc': doc[0],
                'examples': examples,
                'title': ''.join([*map(str.title, tmp)]),
                'meta': meta[0],
                'topic': str(glob_path.parent).replace('json-schemas/', '').replace('.json', '')
            }
    return res


def read_json(path):
    with open(path, "r") as user_file:
        return json.loads(user_file.read())


def read_file(path):
    with open(path, "r") as f:
        return [line.rstrip() for line in f]


def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)


def write_json(path, content):
    with open(path, "w") as f:
        json.dump(content, f, indent=2, default=str)
        f.write("\n")


def update_schema_content(domain):
    path = Path(f"./json-schemas/{domain}")

    valid = True
    for glob_path in Path(path).rglob("*.json"):
        if 'example' not in str(glob_path) and 'meta.json' not in str(glob_path):
            print(f"Updating {str(glob_path)}")
            schema = read_json(glob_path)
            expected_id = f"https://schemas.ruter.no/adt/ota/api/v{API_VERSION_MAJOR}.{API_VERSION_MINOR}/{str(glob_path).replace('json-schemas/', '')}"
            schema["$id"] = expected_id
            schema["$schema"] = JSON_SCHEMA_VERSION
            tmp = glob_path.stem.split("-")
            expected_title = ''.join([*map(str.title, tmp)])
            schema["title"] = expected_title
            if "description" not in schema:
                schema["description"] = "TODO: Missing description"
            properties = schema["properties"]
            for key, value in properties.items():
                value["$id"] = f"#/properties/{key}"
                if "description" not in value:
                    value["description"] = "TODO: Missing description"
            write_json(glob_path, schema)

    return valid


def validate(schemas_):
    valid = True
    for name, paths in schemas_.items():
        if 'assignment' in name:
            valid = docs_exists(paths) and valid
            valid = examples_exists(paths) and valid
            valid = meta_exists(paths) and valid

    if not valid:
        raise SystemExit('Some schemas are not valid')


def meta_exists(paths):
    if not paths['meta']:
        print(f"{paths['schema-file']: <100} missing meta file")
        return False
    return True


def examples_exists(paths):
    if len(paths['examples']) == 0:
        print(f"{paths['schema-file']: <100} missing example file(s)")
        return False
    return True


def docs_exists(paths):
    if not paths['doc']:
        print(f"{paths['schema-file']: <100} missing documentation file")
        return False
    return True


def update_doc(paths, meta):
    doc_path = paths['doc']
    lines = read_file(doc_path)
    res = []

    central_topic = '| Central Topic'
    schema = '| Schema'

    for line in lines:
        if central_topic in line:
            topic = meta['mqtt']['topic']
            central_topic_content = f"{central_topic} | {topic}"
            res.append(f"{central_topic_content: <{len(line) - 1}}|")
        elif schema in line:
            schema_path = re.sub(".*json-schema", "json-schema", paths['schema-file'])
            schema_content = f'{schema}        | [ {paths["schema-file-name"]} ]({schema_path})'
            res.append(f"{schema_content: <{len(line) - 1}}|")
        else:
            res.append(line)

    res[0] = f"### {paths['title']} Message"
    write_file(doc_path, "\n".join(res) + "\n")


def update_meta(paths):
    meta_path = paths['meta']
    meta = read_json(meta_path)
    include_vehicle = 'vehicleCentric' not in meta or meta['vehicleCentric']
    routing_prefix = '{operatorId}/ruter' if 'publish' != meta['mode'] else 'ruter/{operatorId}'
    if include_vehicle:
        routing_prefix = routing_prefix + "/{vehicleId}"
    prefix = f'{routing_prefix}/adt/v{API_VERSION_MAJOR}'
    topic = f"{prefix}/{paths['topic']}"
    meta['mqtt']['topic'] = topic
    write_json(Path(meta_path), meta)
    return meta


def main():
    domain = "operational"
    schemas = resolve_schemas(domain)
    validate(schemas)
    update_schema_content(domain)

    res = {}

    for name, paths in schemas.items():
        meta = update_meta(paths)
        update_doc(paths, meta)
        channel = paths['topic']
        res[channel] = {
            "description": {
                "$ref": paths['doc']
            },
            meta['mode']: {
                "message": {
                    "name": paths['title'],
                    "schemaFormat": "application/schema+json;version=draft-07",
                    "payload": {
                        "$ref": re.sub(".*json-schema", "json-schema", paths['schema-file'])
                    },
                    "examples": [{"$ref": p} for p in paths['examples']],
                    "bindings": {
                        "mqtt": {
                            "qos": meta['mqtt']['qos'],
                            "retain": meta['mqtt']['retain']
                        }
                    }
                }
            }
        }

    print(yaml.dump({"channels": res}))


if __name__ == '__main__':
    main()
