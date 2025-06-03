# Sync web assets with `rclone`

## Overview

Ruter publishes packages on a HTTP web server on pto-api.transhub.io. These files are expected to be downloaded and hosted "offline" on board the vehicle.

This must be done using `rclone` which is a command line program to manage files on cloud storage. It is a powerful tool that can be used to sync files between different storage systems, including local file systems and cloud storage providers.

Please refer to [`rclone` documentation](https://rclone.org) for more information on how to use it: https://rclone.org/docs/.

## Installation

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
url = https://pto-api-v2.transhub.io/
```

**Note:** The `headers` field must be set to the VIN of the vehicle. This is used to identify the vehicle when syncing files.

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


## Hosting the files

The files must be hosted on a web server. This can be done using any web server software, such as Apache or Nginx.

See example nginx config here:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /www/root;
        index index.html;
    }
}
```

### Important info about caching

It is important to disable all caches (HTTP `Cache-Control` header), as this can cause issues during updates. This can be done by adding the following lines to your nginx config:

```nginx
    location / {
        root /www/root;
        index index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
        add_header Pragma "no-cache";
        expires -1;
    }
```

### Important info about Content-Type

It is important to include the correct HTTP `Content-Type` header in the response. This is to ensure that the files are served correctly to the client. If this is incorrectly configured, some illustraions might fail to load correctly in client.

## Testing the client

To test out your client, you might want to visit the application in a web browser. The URL you should visit depends on your screen type. Here are some example URLs:

- http://localhost:8080/app/index.html#display/1
- http://localhost:8080/app/index.html#display/t2-left?channels=short_platform[active_cab]=c1
- http://localhost:8080/app/index.html#display/b3

See article about screen config for more info about what excact URL to use.
