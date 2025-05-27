# Sync web assets with `rclone`

## Overview

Ruter publishes packages on a HTTP web server on pto-api.transhub.io. These files are expected to be downloaded and hosted "offline" on board the vehicle.

This must be done using `rclone` which is a command line program to manage files on cloud storage. It is a powerful tool that can be used to sync files between different storage systems, including local file systems and cloud storage providers.

Please refer to [`rclone` documentation](https://rclone.org) for more information on how to use it: https://rclone.org/docs/.

## Installation

Please refer to [`rclone` documentation](https://rclone.org) on how to install.

### `rclone` version requirements

`rclone` version must be upgraded to latest version within a year after the release of a new version. This is to ensure that the latest features and bug fixes are available to users.

## Configuration

File sync must be configured in `rclone`.

Here is the config you should use:

```bash
$ rclone config dump
{
    "ruter-dpi": {
        "headers": "Vehicle,<ENTER_VIN_HERE>",
        "type": "http",
        "url": "http://pto-api.transhub.io/vdclient/"
    }
}
```

This can be entered manually using the `rclone config` command, or by creating a file called `rclone.conf` in your home directory with the above content.

**Note:** The `headers` field must be set to the VIN of the vehicle. This is used to identify the vehicle when syncing files.

## Syncing files

Run the following command to sync files from the HTTP server to your local file system:

```bash
rclone sync --create-empty-src-dirs ruter-dpi:. /www/root
```

If you want to only sync parts of the files, you can be more specific. See this example:

```bash
# Syncing application (required)
rclone sync --create-empty-src-dirs ruter-dpi:/app /www/root
# Syncing manifest files (required)
rclone sync --create-empty-src-dirs ruter-dpi:/media/manifest.json /www/root/manifest.json
rclone sync --create-empty-src-dirs ruter-dpi:/media/manifest.js /www/root/manifest.js
# Syncing media for specific screen type
rclone sync --create-empty-src-dirs ruter-dpi:/media/1 /www/root/media/1
rclone sync --create-empty-src-dirs ruter-dpi:/media/2 /www/root/media/2
```

If you are unsure exactly which files you should synchronize, please refer to person of contact in Ruter on what media files you should synchronize.

Add all those lines into a script file called `sync.sh` and make it executable:

```bash
chmod +x sync.sh
```

You can register this as a cron job to run every 5 minutes. To do this, run the following command:

```bash
crontab -e
```

Then add the following line to the file:

```bash
*/5 * * * * /usr/bin/sync.sh
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
