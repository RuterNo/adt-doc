const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const INPUT_FILE  = path.resolve(__dirname, '../asyncapi/asyncapi_template.yml');
const OUTPUT_FILE = path.resolve(__dirname, '../asyncapi/asyncapi.yml');
const BASE_DIR    = path.dirname(INPUT_FILE);

function resolveJsonPointer(root, ref) {
  const parts = ref.replace(/^#\/?/, '').split('/').filter(Boolean);
  let node = root;
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return undefined;
    node = node[part];
  }
  return node;
}

// Expands all internal $ref starting with '#/' by resolving against the schema root.
// Handles both '#/definitions/...' and '#/properties/...' style refs.
function expandSchemaInternalRefs(schema) {
  function inlineRefs(node, depth) {
    if (depth > 20) return node;
    if (Array.isArray(node)) return node.map(n => inlineRefs(n, depth));
    if (node && typeof node === 'object') {
      if (typeof node['$ref'] === 'string' && node['$ref'].startsWith('#/')) {
        const resolved = resolveJsonPointer(schema, node['$ref']);
        if (resolved !== undefined) {
          return inlineRefs(JSON.parse(JSON.stringify(resolved)), depth + 1);
        }
      }
      return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, inlineRefs(v, depth)]));
    }
    return node;
  }

  const result = inlineRefs(schema, 0);
  const copy = { ...result };
  delete copy.definitions;
  return copy;
}

function resolveNode(node, currentDir) {
  if (Array.isArray(node)) return node.map(item => resolveNode(item, currentDir));
  if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === '$ref') {
      const ref = node['$ref'];
      if (ref.startsWith('#')) return node;
      const absPath = path.resolve(currentDir, ref);
      if (absPath.endsWith('.md')) return fs.readFileSync(absPath, 'utf8');
      if (absPath.endsWith('.json')) {
        const parsed = JSON.parse(fs.readFileSync(absPath, 'utf8'));
        const expanded = expandSchemaInternalRefs(parsed);
        return resolveNode(expanded, path.dirname(absPath));
      }
      throw new Error(`Unhandled $ref: ${ref}`);
    }
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, resolveNode(v, currentDir)])
    );
  }
  return node;
}

const doc = yaml.load(fs.readFileSync(INPUT_FILE, 'utf8'));
const resolved = resolveNode(doc, BASE_DIR);
fs.writeFileSync(OUTPUT_FILE, yaml.dump(resolved, { lineWidth: -1, noRefs: true }));
console.log('Bundled →', OUTPUT_FILE);
