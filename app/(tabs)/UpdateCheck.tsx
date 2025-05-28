import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Updates from 'expo-updates';

const UpdateStatus = () => {
    const [status, setStatus] = useState('Checking update status...');

    useEffect(() => {
        const checkUpdate = async () => {
            try {
                // const isEmbedded = Updates.isEmbeddedLaunch;
                // const updateId = Updates.updateId;
                // const channel = Updates.channel;
                // const runtimeVersion = Updates.runtimeVersion;

                console.log('Expo Updates module status:', Updates);
                // setStatus(`Running embedded (no OTA applied).\nChannel: ${channel}\nRuntime: ${runtimeVersion}`);
            }
            catch (e) {
                setStatus(`Error checking update status:\n${e.message}`);
            }
        };

        checkUpdate();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16 }}>{status}</Text>
        </View>
    );
};

export default UpdateStatus;
