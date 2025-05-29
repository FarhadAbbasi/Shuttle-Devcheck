import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Updates from 'expo-updates';
import { Button } from 'react-native';

const UpdateStatus = () => {
    const [status, setStatus] = useState('Checking update status...');

    useEffect(() => {
        const checkUpdate = async () => {
            try {
                const isEmbedded = Updates.isEmbeddedLaunch;
                const updateId = Updates.updateId;
                const channel = Updates.channel;
                const runtimeVersion = Updates.runtimeVersion;

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
        <View style={{ marginTop: 60, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Update Status</Text>
          {/* <Text>Update available? {Updates?.isAvailable ? 'Yes' : 'No'}</Text> */}
          <Button title="Check for Update" onPress={async () => {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
              alert('Update found, fetching...');
              await Updates.fetchUpdateAsync();
              alert('Update downloaded. Reloading...');
              Updates.reloadAsync();
            } else {
              alert('No update available');
            }
          }} />
        </View>
      );

    // return (
    //     <View style={{ padding: 20 }}>
    //         <Text style={{ fontSize: 16 }}>{status}</Text>
    //     </View>
    // );
};

export default UpdateStatus;
