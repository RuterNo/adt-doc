# Web Content

## Overview

Ruter publishes content that is to be available on the web server on board the vehicle. This is done using `rclone`, a command line program to manage files on cloud storage. `rclone` can sync files between local file systems and cloud storage providers.

For more information, see the [`rclone` documentation](https://rclone.org/docs/).

## General information regarding update procedures

- Synchronization of web content is performed using `rclone` to download the latest content from Ruter's web server.
- Synchronization should occur periodically throughout the day to keep files up to date.
- At least **16 GB** of storage must be available on the vehicle to store the PTA's content.
- **SLA requirements:**
  - Any content updated before 16:00 must be available in the vehicle before it starts its route the following morning.
  - Ruter expects the PTO to update content at the frequency indicated in the installation instructions below. If not, SLA requirements may be adjusted in future releases.
- The PTO should download new versions from a pre-production channel in a test environment and ensure the version is thoroughly tested before deploying to production.

## Installation Instructions

Refer to the [`rclone` documentation](https://rclone.org) for installation steps.

### Rclone Version Requirements

The `rclone` version must be upgraded to the latest version within a year after a new release. This ensures access to the latest features and bug fixes.

## Architectural overview

The recommended setup is to sync directly from TET to vehicles. This means installing `rclone` on the vehicle computer and giving it access to `https://pto-api-v2.transhub.io` (see more details in _Rclone Configuration_).

We understand this can be a major architectural change for some PTO setups. In some cases, synchronization has previously been handled in a PTO back office, and the final transfer from back office to vehicle has been handled by custom solutions.

Because of this, we provide an interim solution where PTOs can still synchronize to the back office, as long as they also implement additional features for targeted deployments. See the _Interim PTO backoffice setup_ section later in this article.

## Rclone Configuration

### 1. Create the Rclone Configuration File

Create a configuration file at `/opt/rclone/rclone.conf`. If the directory does not exist, create it:

```bash
mkdir -p /opt/rclone
```

Add the following configuration to the file. Replace `<ENTER_VIN_HERE>` with the Vehicle Identification Number (VIN) of the vehicle, and `<ENTER_URL_HERE>` with the appropriate URL (see table below):

```ini
[web-content]
headers = X-Vehicle-Id,<ENTER_VIN_HERE>
type = http
url = <ENTER_URL_HERE>
```

> **Note:**
>
> - The `headers` field must be set to the VIN of the vehicle. This identifies the vehicle when syncing files.
> - The `url` field must be set to the URL of the web server where the content is hosted. Use the appropriate URL for your environment:

| Environment | URL                                               | Purpose                                                        |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Prod        | https://pto-api-v2.transhub.io/web-content/       | All vehicles running regular routes                            |
| Stage       | https://pto-api-v2.stage.transhub.io/web-content/ | Test rigs, vehicles being tested before running regular routes |

### 2. Create a Folder for Rclone Logs

Create a folder to store the logfile from `rclone`:

```bash
sudo mkdir -p /var/log/rclone
sudo chown <youruser>:<youruser> /var/log/rclone
```

> **Note:** Replace `<youruser>` with the user that will run the `rclone` commands.

### 3. Set Up a Cron Job to Run Rclone

Set up `rclone` to run periodically to keep files up to date. Use `cron` or another scheduler.

```bash
crontab -e
```

Add the following lines (adjust paths as necessary):

```bash
RCLONE_CONFIG=/opt/rclone/rclone.conf
*/5 * * * * /usr/bin/rclone sync --create-empty-src-dirs --delete-before web-content:. /var/www/html/ >> /var/log/rclone/rclone.log 2>&1

# Optional:
# For more verbose output and statistics:
# */5 * * * * /usr/bin/rclone sync -v --stats-one-line-date --create-empty-src-dirs --delete-before web-content:. /var/www/html/ >> /var/log/rclone/rclone.log 2>&1
```

This will sync files every 5 minutes from the HTTP server to `/var/www/html/`, using the configuration file specified by the `RCLONE_CONFIG` environment variable.

### 4. Set Up Log Rotation for Rclone Logs

To prevent `rclone.log` from growing indefinitely, set up log rotation using `logrotate`.

Check if `logrotate` is installed:

```bash
logrotate --version
```

Create a logrotate configuration file for `rclone`:

```bash
sudo nano /etc/logrotate.d/rclone
```

Add the following content:

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

The root folder for web content is chosen by the operator (referred to as `$WEB_CONTENT_ROOT`). The recommended location is `/var/www/html`, but any suitable location for your web server is acceptable.

Files should be deployed in a structure like:

- $WEB_CONTENT_ROOT
  - app
  - media
  - resources

Example output of `tree` in `$WEB_CONTENT_ROOT`:

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
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disable caching of content   | It is important to disable all caches (HTTP `Cache-Control` header), as this can cause issues during updates.                                                                                                                                        |
| Setting correct Content-Type | It is important to include the correct HTTP `Content-Type` header in the response. This is to ensure that the files are served correctly to the client. If this is incorrectly configured, some illustraions might fail to load correctly in client. |

### Verifying the setup

When the web server is set up, displays in a vehicle should be able to access the DPI application using an url like `http://webserver.local/app/index.html#display/1`.

See [DPI Bus Monitor Screen Configuration](screen-configs.md) documentation for more details about setting up displays with the correct content.

## Interim PTO backoffice setup

This section describes a scenario where a PTO cannot easily synchronize directly to vehicles and needs to do this centrally first.

In these cases, the PTO should synchronize three packages: `test`, `stage`, and `prod`. This is done by providing `X-Client-Env` instead of `X-Vehicle-Id`, as described in _Rclone Configuration_ earlier in this article.

- prod package using `X-Client-Env: prod`
- stage package using `X-Client-Env: stage`
- test package using `X-Client-Env: test`

This should result in three copies of the web content in the PTO back office: `./stage`, `./prod`, and `./test`.

The next step is to determine which version each vehicle should receive. Do this by fetching these resources:

- `https://pto-api-v2.transhub.io/test-vehicles.json` <- These vehicles should receive test web content
- `https://pto-api-v2.transhub.io/stage-vehicles.json` <- These vehicles should receive stage web content
- All other vehicles should receive prod web content

Example content of `test-vehicles.json`:

```json
[
  "SL180000000000444",
  "0000000IMO9910000",
  "YS2K6X20001919191",
  "SUU33333EPB025255"
]
```

If `test-vehicles.json` contains the content above, the PTO must synchronize test web content from `./test` to these vehicles instead of from `./prod`.
