# Resources Manifest

The resources manifest is means of describing which resources Ruter is sharing with operators. 
Initially, the list will contain an audio file intended to be played when a stop is requested
on board the vehicle. It allows us to change the sound over time and ensure a uniform aural 
experience for passengers.

This manifest should be used in a similar way as with the packages and mqtt manifests. The 
manifest should be checked at least once a day, after 16:00, and if there is a new version
of a resources, download and start using it. The intention 
is similar to the DPI application and MQTT: they should be in use by the next day. 

## Locations

The manifest will be available at the following URLs:

| Environment | URL |
| --- | --- |
| test | https://pto-api.test.transhub.io/resources.json |
| stage | https://pto-api.stage.transhub.io/resources.json |
| prod | https://pto-api.transhub.io/resources.json |

## Resources Provided

This list will be updated over time, as new resources are included. The *Name* in the table below 
corresponds to the name in the resource item in the JSON, which is illustrated in an example later on,
and in the field documentation for the Resource type.

| Name | Type | Description | Formats |
|---|---|---|---|
| stopRequestedSound | audio | the sound that should be played when a passenger presses the stop button | either mp3 or opus files |

## Example

An example of the contents of the maifest looks like:

```
{
  "timestamp": "2020-10-28T20:41:23Z",
  "environment": "prod",
  "resources": [ 
    {
      "name": "stopRequestedSound",
      "type": "audio",
      "contentType": "audio/mpeg",
      "url" : "https://bus-dpi.transhub.io/resources/stop-requested-2020-10-28T19-37-00Z.mp3",
      "sha256" : "f11de09c99b36f6097355c560d219716fc66857475f248b5196382830d5ba06a",
      "version" : "2020-10-28T19:37:00Z",
      "description": "bell3_stereo_256"
    }
  ]
}
```

## Fields
### Root

| Name | Values | Description |
| --- | --- | --- |
| timestamp | ISO date/time stamp | Time the new manifest is released |
| environment | test/stage/prod | Which environment the manifest applies to |
| resources | list of type Resource | a collection of one or more resources that Ruter shares |

### Resource

| Name | Values | Description |
|------|--------|-------------|
| name | string | names that Ruter defines, only "stopRequestedSound" is currently defined |
| type | string | types that Ruter supports, only "audio" is currently defined |
| contentType | MIME type | a MIME type that corresponds to the type of the resource that is shared |
| url | URL | the location of where the resource can be fetched, the file name has a time stamp part that corresponds to its version |
| sha256 | string | A SHA 256 hash of the resource, which can be used to verify the validity of the downloaded file |
| version | string | a version date in ISO date/time format |
| description | string | description of the content of the resource, e.g. the original file name of the resource; the field is optional |

## Schema and Example

A schema is available at: https://github.com/RuterNo/ota-schemas/blob/master/schemas/cdn/dpi-resources-manifest.json.

A corresponding example is provided here: https://github.com/RuterNo/ota-schemas/blob/master/examples/cdn/resources.json.





