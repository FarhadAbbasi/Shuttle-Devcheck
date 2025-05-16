import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useDriverStore } from '@/store/useDriverStore';
import { useProfileStore } from '@/store/profileStore';
import { router } from 'expo-router';

export default function ChooseRoute() {
  const { profile } = useProfileStore();
  const { driverDetails, fetchDriverDetails, fetchDriverRoutes, driverRoutes, setCurrentRouteId } = useDriverStore();


  useEffect(() => { // Fetch Driver Details in driverStore 
    // loadFromStorage(); // try loading MMKV first from driverStore
    if (profile?.id) fetchDriverDetails(profile.id);   
    // console.log('Driver Details:', driverDetails)
  }, [profile]);


  useEffect(() => { // Fetch Driver Routes in driverStore
    if (driverDetails) fetchDriverRoutes();    
    // console.log('Driver Routes:', driverRoutes)
  }, [driverDetails]);


  const handleSelectRoute = (routeId: string) => { // Set Current Route_ID
    setCurrentRouteId(routeId); // sets in Zustand + MMKV
    router.replace('/dashboard/Driver'); // Navigate to actual dashboard
  };
  
  const routeIds = driverDetails?.route_ids ?? [];

  if (!driverRoutes) {
    return (
      <View className="p-6">
        <Text className="text-lg text-center text-slate-500">No routes assigned yet.</Text>
      </View>
    );
  }

  return (
    <View className="p-6">
      <Text className="text-xl font-bold mb-4 text-slate-800">Choose Your Route</Text>

      {driverRoutes && driverRoutes?.map((route) => (
        <TouchableOpacity
          key={route.id}
          onPress={() => handleSelectRoute(route.id)}
          className="bg-white p-4 rounded-2xl mb-3 shadow"
        >
          <Text className="text-lg font-semibold text-slate-800">{route.name}</Text>
          <Text className="text-slate-500"> {route?.start_location?.lat} to {route?.end_location?.lng}</Text>
        </TouchableOpacity>
      ))}

    </View>
  );
}
