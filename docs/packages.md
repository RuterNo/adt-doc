# Packages

Ruter publishes a packages manifest that provides a list of packages that should be installed on vehicles at the following locations.

| Environment | URL                                             | Purpose                                                        |
|-------------|-------------------------------------------------|----------------------------------------------------------------|
| Prod        | https://pto-api.transhub.io/packages.json       | All vehicles running regular routes                            |
| Stage       | https://pto-api.stage.transhub.io/packages.json | Test rigs, vehicles being tested before running regular routes |

These locations should be checked once daily, at a minimum, after 16.00 CET, which is our cutoff for changes for the day, Monday to Friday.

It is expected that new packages should be installed on all vehicles running in regular traffic after 05.00 CET the following day.

## Contents of Manifest

```json
{
  "timestamp" : "2021-02-25T14:43:14Z",
  "packages" : [ {
    "destination" : "application",
    "url" : "https://bus-dpi.transhub.io/packages/application-2021-02-25T14-25-12Z.zip",
    "sha256" : "5258f1e757ab9fb1e222601c793030219b7064b21206d234fc094bbdaf546fd0"
  }, {
    "destination" : "application/media",
    "url" : "https://bus-dpi.transhub.io/packages/media-2019-10-16T15-11-00Z.zip",
    "sha256" : "44a143c13ab452b7bd5d06f4ce3373af7b5a4da0095b42a3db27bd04e172072b"
  } ]
}
```

When a new version of the packages is published the timestamp will increment.

Use the URL to fetch the packages and check that the downloaded Zip file has the same SHA256 values as in the manifest.

## Placement of Files

Currently the two zip files are organized internally slightly differently, and this affects how they need to be handled. The destination in the manifest refers to where the working directory must be when the file is unzipped.

In addition, the destination "application" should be thought of a location chosen by the operator, which we can call $APPLICATION_ROOT.

The packages should end up deployed in a structure like this:

* $APPLICATION_ROOT
  * app
  * media
  * resources
    
The directory application can actually be anything as long as it is the root of the web site that is served.

Manually setting up this structure would be done with the following steps (verified in an Alpine container in Docker):

```sh
~ # apk add curl tree
~ # curl -O https://bus-dpi.transhub.io/packages/application-2021-02-25T14-25-12Z.zip
~ # curl -O https://bus-dpi.transhub.io/packages/media-2019-10-16T15-11-00Z.zip
~ # sha256sum application-2021-02-25T14-25-12Z.zip media-2019-10-16T15-11-00Z.zip
5258f1e757ab9fb1e222601c793030219b7064b21206d234fc094bbdaf546fd0  application-2021-02-25T14-25-12Z.zip
44a143c13ab452b7bd5d06f4ce3373af7b5a4da0095b42a3db27bd04e172072b  media-2019-10-16T15-11-00Z.zip
~ # mkdir -P /var/www/application && cd /var/www/application
/var/www/application # unzip ~/application-2021-02-25T14-25-12Z.zip
/var/www/application # mkdir media && cd media
/var/www/application/media # unzip ~/media-2019-10-16T15-11-00Z.zip
/var/www/application/media # cd ..
/var/www/application # mkdir resources && cd resources
/var/www/application/resources # curl -O https://pto-api.test.transhub.io/resources/stop-requested-2020-11-02T15-02-50Z.mp3
/var/www/application/resources # curl -O https://pto-api.test.transhub.io/resources/safety_long.opus
/var/www/application/resources # cd ..
/var/www/application # tree
..
├── app
│   ├── 04889d2190d60b7f58a067bc5b3a0a99.woff2
│   ├── 1087eb494954e58ec8f09de436610b14.woff2
│   ├── 1e38058be4260221196853453c75c794.woff2
│   ├── 3e96977e3611f5114b5141ff066fb067.woff2
│   ├── 9ff5d1282d1cd14560959772a68e721d.woff2
│   ├── app.ded55e6e43e867840fc3.bundle.js
│   ├── app.ded55e6e43e867840fc3.bundle.js.map
│   ├── e0e8c1b4bcd0dd594ac08449f2dc19e6.woff2
│   ├── favicon.ico
│   ├── index.html
│   ├── static
│   │   └── img
│   │       ├── info1.png
│   │       ├── ruter-logo.png
│   │       └── tram-map.png
│   ├── vendor.ded55e6e43e867840fc3.bundle.js
│   ├── vendor.ded55e6e43e867840fc3.bundle.js.map
│   ├── vendor_app.ded55e6e43e867840fc3.bundle.js
│   └── vendor_app.ded55e6e43e867840fc3.bundle.js.map
├── media
│   ├── 1080p_Ruter_Holdning_Glad.mp4
│   ├── 1080p_Toyen_K2.mp4
│   ├── 480p_Ruter_Holdning_Glad.mp4
│   ├── 480p_Toyen_K2.mp4
│   ├── 720p_Ruter_Holdning_Glad.mp4
│   ├── 720p_Toyen_K2.mp4
│   ├── campaign34.html
│   ├── manifest.js
│   ├── manifest.json
│   └── ruter-sommerkampanje.mp4
└── resources
    ├── stop-requested-2020-10-28T19-37-00Z.mp3
    └── safety_long.opus

```
Automation should be based on these kinds of steps.

## Web Server

Using nginx or some other proxy/webserver, point the root of the site to `/var/www/application` (or wherever $APPLICATION_ROOT points to).

A very simple nginx configuration would be (for example by modifying /etc/nginx/conf.d/default.conf):

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/application;

	location / {
	}
}
```

When a web server is set up, displays in a vehicle would point to the DPI application with a url like `http://webserver.local/app/index.html`.

See [DPI Bus Monitor Screen Configuration](/screen-configs) documentation for more details about setting up displays with the correct content.
