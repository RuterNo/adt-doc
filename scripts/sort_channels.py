#!/usr/bin/env python3

from pathlib import Path
from ruamel.yaml import YAML

yaml = YAML(typ='rt')
yaml.indent(mapping=2, sequence=4, offset=2)
yaml.width = 4096

def load_asyncapi_file():
    """
    Supports running the script from either the root or `scripts/` directory.
    """
    cwd = Path.cwd()
    if cwd.name == "scripts":
        asyncapi_path = cwd.parent / "asyncapi" / "asyncapi.yml"
    else:
        asyncapi_path = cwd / "asyncapi" / "asyncapi.yml"

    if not asyncapi_path.exists():
        raise FileNotFoundError(f"Could not find asyncapi.yml at {asyncapi_path}")

    return asyncapi_path

def sort_channels(asyncapi_path):
    with asyncapi_path.open("r") as f:
        asyncapi = yaml.load(f)

    if "channels" in asyncapi:
        sorted_channels = dict(sorted(asyncapi["channels"].items()))
        asyncapi["channels"] = sorted_channels
        with asyncapi_path.open("w") as f:
            yaml.dump(asyncapi, f)
        print(f"[OK] Sorted channels in: {asyncapi_path}")
    else:
        print("[WARN] No `channels` section found in asyncapi.yml")

if __name__ == "__main__":
    path = load_asyncapi_file()
    sort_channels(path)