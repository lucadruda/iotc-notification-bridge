import { View, Text, NativeEventEmitter, TextInput, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import NotificationHub, { register } from 'react-native-azurenotificationhub'
import React, { useState } from "react";

const connectionString = '[NOTIFICATION_HUB_CSTRING]'; // The Notification Hub connection string
const hubName = '[NOTIFICATION_HUB_NAME]';          // The Notification Hub name
const senderID = '[SENDER_ID]';         // The Sender ID from Firebase console or Apple Developer console

const NOTIF_REGISTER_AZURE_HUB_EVENT = 'azureNotificationHubRegistered';
const NOTIF_AZURE_HUB_REGISTRATION_ERROR_EVENT = 'azureNotificationHubRegistrationError';
const DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';

const pushNotificationEmitter = new NativeEventEmitter(NotificationHub);

export default function App() {

    const [textBox, setTextBox] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [notificationEnabled, setNotificationEnabled] = useState(false);
    const [connecting, setConnecting] = useState(false);
    let btnColor = connecting ? 'gray' : 'blue';
    return (
        <View style={{ margin: 10 }}>
            <Text style={{ marginTop: 20, fontSize: 40, textAlign: 'center' }}>Welcome to Notification Bridge</Text>
            {notificationEnabled ? null : (<React.Fragment><Text>Insert device Id</Text>
                <TextInput style={{ borderColor: 'black', borderWidth: 1, width: '80%', height: 35 }} value={deviceId} onChangeText={(txt) => { setDeviceId(txt) }}></TextInput>
                <TouchableOpacity onPress={() => connect(deviceId, setTextBox, setNotificationEnabled, setConnecting)} disabled={connecting}><View style={{
                    height: 40, width: 80, alignSelf: 'center', marginVertical: 30, padding: 20, backgroundColor: btnColor, justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{ color: 'white' }}>Start</Text></View></TouchableOpacity>
            </React.Fragment>)}
            {connecting ? <ActivityIndicator /> : null}
            {notificationEnabled ? (<React.Fragment><Text style={{ fontSize: 20, marginBottom: 30 }}>Notifications</Text>
                <Text>{textBox}</Text></React.Fragment>) : null}
        </View>
    )
}

async function connect(deviceId: string, setTextBox: any, setNotificationEnabled: any, setConnecting: any) {
    setConnecting(() => (true));
    pushNotificationEmitter.addListener(DEVICE_NOTIF_EVENT, (msg: string) => { onRemoteNotification(msg, setTextBox) });
    pushNotificationEmitter.addListener(NOTIF_REGISTER_AZURE_HUB_EVENT, (registrationId: string) => {
        onHubRegistered(registrationId, setNotificationEnabled, setConnecting);
    });
    pushNotificationEmitter.addListener(NOTIF_AZURE_HUB_REGISTRATION_ERROR_EVENT, (err: Error) => {
        onHubRegistrationError(err, setNotificationEnabled);
    });
    await register({
        connectionString,
        hubName,
        senderID,
        tags: [deviceId]
    });
}

function onHubRegistered(registrationId: string, setNotificationEnabled: any, setConnecting: any) {
    setNotificationEnabled(() => (true));
    setConnecting(() => (false));
}

function onHubRegistrationError(err: Error, setNotificationEnabled: any) {
    console.warn(`Hub registration failed. ${err}`);
    setNotificationEnabled(() => (true));
}

function onRemoteNotification(msg: any, setTextBox: any) {
    if (msg) {
        msg = JSON.parse(msg);
        console.log(`Notification received: ${msg.message}`);
        setTextBox(() => (msg.message));
    }
}