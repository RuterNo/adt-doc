# Web Content

## Overview

Ruter publishes content that is to be available on the web server on board the vehicle.
This is to be done using `rclone` which is a command line program to manage files on cloud storage. It is a powerful tool that can be used to sync files between different storage systems, including local file systems and cloud storage providers.

Please refer to [`rclone` documentation](https://rclone.org) for more information on how to use it: https://rclone.org/docs/.

## General information regarding update procedures

- Synchronization of web content is done using `rclone` to download the latest content from Ruter's web server.
- The synchronization should happen periodically throughout the day to ensure that the files are always up to date.
- A minimum of 16 GB of storage must be available on the vehicle to store the PTA's content.
- The SLA-requirements are for the time being the same as it was for ADT 3:
  - Any content updated before 16:00 must at minimum be available in the vehicle before it starts the route the following morning.
  - Ruter do however expect that the PTO will update the content at the frequency that is indicated in the `rclone` installation instructions below. If the PTO does not update the content at the frequency indicated, Ruter will adjust the SLA-requirements accordingly in future releases.
- The PTO should download new versions from a pre-production channel in a test environment and ensure the version is thoroughly tested before being deployed to production.

## Installation instructions


Please refer to [`rclone` documentation](https://rclone.org) on how to install.

### `rclone` version requirements

`rclone` version must be upgraded to latest version within a year after the release of a new version. This is to ensure that the latest features and bug fixes are available to users.

## Configuration of `rclone`
### Create Rclone configuration file

Create a new configuration file at the location: `/opt/rclone/rclone.conf`. If the directory does not exist, you can create it using the command:
```bash
mkdir -p /opt/rclone
```

Add the following configuration to the file, replacing `<ENTER_VIN_HERE>` with the Vehicle Identification Number (VIN) of the vehicle you are configuring:

```text
[web-content]
headers = Vehicle,<ENTER_VIN_HERE>
type = http
url = <ENTER_URL_HERE>
```

**Note:** The `headers` field must be set to the VIN of the vehicle. This is used to identify the vehicle when syncing files.
**Note2:** The `url` field must be set to the URL of the web server where the content is hosted. The URL should be one of the following, depending on the environment you are working in:

| Environment | URL                                   | Purpose                                                        |
|-------------|---------------------------------------|----------------------------------------------------------------|
| Prod        | https://pto-api-v2.transhub.io/       | All vehicles running regular routes                            |
| Stage       | https://pto-api-v2.stage.transhub.io/ | Test rigs, vehicles being tested before running regular routes |

### Create folder to store logs from Rclone

Create a folder to store the logfile from `rclone`:

```bash
sudo mkdir -p /var/log/rclone
sudo chown youruser:youruser /var/log/rclone
```

**Note:** Replace `youruser` with the user that will run the `rclone` commands.

### Setup cron job to run rclone

Setup rclone to run periodically to ensure that the files are always up to date. Scheduling it with cron or another task scheduler.

```bash
crontab -e
```

Add the following lines:

```bash

RCLONE_CONFIG=/opt/rclone/rclone.conf
*/5 * * * * /usr/bin/rclone sync --create-empty-src-dirs web-content:. /var/www/html/ >> /var/log/rclone/rclone.log 2>&1

# Optional:
#
# If you want to run `rclone` with more verbose output and statistics, you can modify the command as follows:
# */5 * * * * /usr/bin/rclone sync -v --stats-one-line-date --create-empty-src-dirs web-content:. /var/www/html/ >> /var/log/rclone/rclone.log 2>&1
``` 

Adjust the paths as necessary. The above command will sync the files every 5 minutes from the HTTP server to the local file system at `/var/www/html/`.

### Setup log rotation for rclone logs

To prevent the `rclone.log` file from growing indefinitely, it is recommended to set up log rotation. This can be done using `logrotate`, which is a system utility that manages the rotation and compression of log files.

To verify that `logrotate` is installed, you can run the following command:

```bash
logrotate --version
```

#### Setup logrotate configuration for rclone
Create a logrotate configuration file for `rclone`:

```bash
sudo nano /etc/logrotate.d/rclone
```
Add the following content to the file:

```text
/var/log/rclone/rclone.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    copytruncate
}
```


## Placement of Files

The root folder where all the web content is stored, is a location chosen by the operator, which we can call $WEB_CONTENT_ROOT. Our recommendation is to use `/var/www/html` as the root folder, but it can be any location that is suitable for your web server configuration.
The files should end up deployed in a structure like this:

* $WEB_CONTENT_ROOT
  * app
  * media
  * resources
    
The directory application can actually be anything as long as it is the root of the website that is served.

Example output of running the `tree` command in the `$WEB_CONTENT_ROOT` directory:

```sh
/var/www/html # tree
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

## Web Server

Using nginx or some other proxy/webserver, point the root of the site to `/var/www/html` (or wherever $WEB_CONTENT_ROOT points to).

### Important functionality for the web server

| Functionality                | Description                                                                                                                                                                                                                                          |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Disable caching of content   | It is important to disable all caches (HTTP `Cache-Control` header), as this can cause issues during updates.                                                                                                                                        |
| Setting correct Content-Type | It is important to include the correct HTTP `Content-Type` header in the response. This is to ensure that the files are served correctly to the client. If this is incorrectly configured, some illustraions might fail to load correctly in client. |


### Verifying the setup
When the web server is set up, displays in a vehicle should be able to access the DPI application using an url like `http://webserver.local/app/index.html#display/1`.

See [DPI Bus Monitor Screen Configuration](../screen-configs) documentation for more details about setting up displays with the correct content.
