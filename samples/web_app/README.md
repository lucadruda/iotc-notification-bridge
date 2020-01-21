# Static web page sample for IoTCentral notification bridge

This folder contains a simple sample with a static html page and SignalR javascript client to connect to an Azure SignalR instance.

## Instructions

1. Get negotiation URL from deployment output after provisioning the notification bridge and substitute *'NEGOTIATION_ENDPOINT'* at line 7 in *index.html* with the right value.

```
window.apiBaseUrl = '[NEGOTIATION_ENDPOINT]';
```

2. Populate the list of available device with required device Ids. For quick execution of this sample follow this syntax where the class name must be **device** and text inside **p** tag represents the device Id in IoTCentral.
```
<p id="device1" class="device">device1</p>
```

3. Open the web page in your favorite browser or serve it through a web server. Click on a device to start connecting and receiving notifications.
(This sample listens to one device at a time.)

## Cross-origin

The notification bridge configuration allows cross-origin requests by default with wildcard host (*). Although "allow all" option is not suitable for production use, this can be useful when testing the deployment, so this sample uses { withCredentials: false} when making requests to bypass restrictions.
To restrict resources, change CORS settings on Azure function as described [here] (to notif) and set { withCredentials: true } in any occurrence inside **signalr.js** file.