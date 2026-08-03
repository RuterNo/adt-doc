const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

const { resolveJsonPointer, expandSchemaInternalRefs, resolveNode, bundle } = require('./bundle-asyncapi');

const FIXTURES_DIR = path.join(__dirname, '__fixtures__', 'bundle-asyncapi');

test('resolveJsonPointer resolves nested paths', () => {
  const root = { definitions: { timestamp: { type: 'string' } } };
  assert.deepEqual(resolveJsonPointer(root, '#/definitions/timestamp'), { type: 'string' });
  assert.equal(resolveJsonPointer(root, '#/definitions/missing'), undefined);
});

test('expandSchemaInternalRefs inlines internal refs and strips definitions', () => {
  const schema = {
    properties: { eventTimestamp: { $ref: '#/definitions/timestamp' } },
    definitions: { timestamp: { type: 'string', format: 'date-time' } },
  };
  const expanded = expandSchemaInternalRefs(schema);
  assert.deepEqual(expanded.properties.eventTimestamp, { type: 'string', format: 'date-time' });
  assert.equal(expanded.definitions, undefined);
});

test('resolveNode leaves internal (#-prefixed) refs untouched', () => {
  const node = { messages: { foo: { $ref: '#/components/messages/Foo' } } };
  const resolved = resolveNode(node, FIXTURES_DIR);
  assert.deepEqual(resolved.messages.foo, { $ref: '#/components/messages/Foo' });
});

test('resolveNode inlines a .md file reference as raw text', () => {
  const node = { description: { $ref: './description.md' } };
  const resolved = resolveNode(node, FIXTURES_DIR);
  assert.equal(resolved.description, fs.readFileSync(path.join(FIXTURES_DIR, 'description.md'), 'utf8'));
});

test('resolveNode inlines a .json file reference and expands its internal refs', () => {
  const node = { schema: { $ref: './schema.json' } };
  const resolved = resolveNode(node, FIXTURES_DIR);
  assert.deepEqual(resolved.schema, {
    type: 'object',
    properties: { eventTimestamp: { type: 'string', format: 'date-time' } },
  });
});

test('resolveNode throws on an unhandled file extension', () => {
  const node = { thing: { $ref: './description.md.bak' } };
  assert.throws(() => resolveNode(node, FIXTURES_DIR), /Unhandled \$ref/);
});

test('bundle end-to-end resolves the fixture template into self-contained YAML', () => {
  const inputFile = path.join(FIXTURES_DIR, 'template.yml');
  const outputFile = path.join(os.tmpdir(), `bundled-${process.pid}.yml`);

  try {
    bundle(inputFile, outputFile);
    const result = yaml.load(fs.readFileSync(outputFile, 'utf8'));

    const channel = result.channels.testChannel;
    assert.equal(channel.description, fs.readFileSync(path.join(FIXTURES_DIR, 'description.md'), 'utf8'));
    assert.deepEqual(channel.messages.testMessage, { $ref: '#/components/messages/TestMessage' });

    const message = result.components.messages.TestMessage;
    assert.deepEqual(message.payload.schema, {
      type: 'object',
      properties: { eventTimestamp: { type: 'string', format: 'date-time' } },
    });
    assert.deepEqual(message.examples, [{ eventTimestamp: '2026-08-03T12:00:00Z' }]);
  } finally {
    fs.rmSync(outputFile, { force: true });
  }
});
