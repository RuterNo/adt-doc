# ADT 3 - AsyncApi Documentation

## Prerequisites
- Node.js

## Installing the AsyncApi Generator
```shell
npm install -g @asyncapi/generator
```

## Building documentation

To build the documentation, run the following command:

```shell
ag asyncapi.yml @asyncapi/html-template -o docs --force-write
```

## More information
[AsyncApi HTML generator](https://github.com/asyncapi/html-template)
