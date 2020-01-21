# React-Native sample for IoTCentral notification bridge

This folder contains a simple cross-platform mobile application written in React-Native to test push notification.

## Requirements
In addition to the standard React Native requirements, you will also need the following:

### Android
You may need to install the following Android SDK components with your prefered SDK management tools:

- Google Play services

### iOS
- An iOS 8 (or later version)-capable device (simulator doesn't work with push notifications)
- Apple Developer Program membership

## Instructions

1. Get Notification Hub details from deployment outputs after provisioning the notification bridge and substitute values in **App.tsx**.

```
const connectionString = '[NOTIFICATION_HUB_CSTRING]'; // The Notification Hub connection string
const hubName = '[NOTIFICATION_HUB_NAME]';          // The Notification Hub name
const senderID = '[SENDER_ID]';         // The Sender ID from Firebase console or Apple Developer console
```

2. Run **npm install** to update packages and start the application with react-native-cli following official instructions for Android or iOS [here.](https://facebook.github.io/react-native/docs/getting-started)
