#!/usr/bin/python3
"""
Quick mockup to validate Assignment and produce asyncapi spec.
TODO: Validate schemas and generate asyncapi.yaml?
"""

from pathlib import Path
import json
import yaml

API_VERSION = "3.0"


def resolve_schemas():
    res = {}
    string_paths = [str(p) for p in Path(".").rglob(f"*.*") if 'docs' not in str(p)]

    for glob_path in Path("json-schemas").rglob("*.json"):
        if "assignment" in str(glob_path) and "example" not in str(glob_path) and "common" not in str(glob_path) and "-meta.json" not in str(glob_path):
            name = glob_path.stem
            doc = list(filter(lambda t: str(t).endswith(f"{name}.md"), string_paths))[0]
            examples = list(filter(lambda t: 'example' in str(t) and name in str(t), string_paths))
            meta = list(filter(lambda t: '-meta.json' in str(t) and name in str(t), string_paths))
            tmp = name.split("-")
            res[name] = {
                'schema-file': str(glob_path),
                'schema-file-name': str(glob_path.name),
                'doc': doc,
                'examples': examples,
                'title': ''.join([*map(str.title, tmp)]),
                'meta': meta[0],
                'topic': str(glob_path.parent).replace('json-schemas/', '').replace('.json', '')
            }
    return res


def read_json(path):
    print(path)
    with open(path, "r") as user_file:
        return json.loads(user_file.read())


def read_file(path):
    print(path)
    with open(path, "r") as f:
        return [line.rstrip() for line in f]


def write_file(path, content):
    print(path)
    with open(path, "w") as f:
        f.write(content)


def correct_schema_content(name, paths):
    path = paths['schema-file']
    schema = read_json(path)
    expected_id = f"https://schemas.ruter.no/adt/ota/api/v{API_VERSION}/{path.replace('json-schemas/', '')}"
    actual_id = schema["$id"]
    if not ('$id' in schema and actual_id == expected_id):
        print(f"{paths['schema-file']: <100} wrong id [expected: {expected_id}, actual: {actual_id}]")
        return False

    expected_title = paths['title']
    actual_title = schema['title']
    if not expected_title == actual_title:
        print(f"{paths['schema-file']: <100} wrong title [expected: {expected_title}, actual: {actual_title}]")
        return False

    return True


def validate(schemas_):
    valid = True
    for name, paths in schemas_.items():
        if 'assignment' in name:
            valid = docs_exists(paths) and valid
            valid = examples_exists(paths) and valid
            valid = correct_schema_content(name, paths) and valid

    if not valid:
        raise SystemExit('Some schemas are not valid')


def examples_exists(paths):
    if len(paths['examples']) == 0:
        print(f"{paths['schema-file']: <100} missing examples")
        return False
    return True


def docs_exists(paths):
    if not paths['doc']:
        print(f"{paths['schema-file']: <100} missing documentation")
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
            prefix = '{operatorId}/ruter/{vehicleId}' if 'publish' != meta['mode'] else 'ruter/{operatorId}/{vehicleId}'
            res.append(f"{central_topic} | {prefix}/{paths['topic']} |")
        elif schema in line:
            res.append(f'{schema}        | [ {paths["schema-file-name"]} ]({paths["schema-file"]}) |')
        else:
            res.append(line)

    write_file(doc_path, "\n".join(res) + "\n")


def main():
    schemas = resolve_schemas()
    validate(schemas)

    res = {}

    for name, paths in schemas.items():
        meta = read_json(paths['meta'])
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
                        "$ref": paths['schema-file']
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
