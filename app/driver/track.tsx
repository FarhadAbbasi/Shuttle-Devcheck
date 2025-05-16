// app/driver/track.tsx (for example)
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';

const socket = io('http://<YOUR_SERVER_IP>:PORT');

export default function DriverTracker() {

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied!');
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 sec
          distanceInterval: 10, // every 10 meters
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          socket.emit('driver-location', { latitude, longitude });
        }
      );
    });
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-semibold">Tracking in Progress...</Text>
    </View>
  );
}
