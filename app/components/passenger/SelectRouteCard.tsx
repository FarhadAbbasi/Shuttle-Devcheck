import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouteRequestStore } from '@/store/usePassengerStore';
import { router } from 'expo-router';



export default function SelectRouteCard({routes}: any) {

  const { setRouteSuggestion } = useRouteRequestStore();

  const navigateToGuardianRequestForm = (route: any) => {
    setRouteSuggestion(route);
    router.push('/components/GuardianRequestForm');
  }


  return (
    <View>
      <ScrollView horizontal className="space-x-2">
        {routes?.map((route, i) => (
          <TouchableOpacity
            key={i}
            className="bg-gray-100 p-3 rounded-xl w-64"
            onPress={() => navigateToGuardianRequestForm(route)}
          >
            <Text className="text-base font-semibold">
              {route.status === 'Available' ? 'Available Route' : 'New Proposed Route'}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              ETA: {route.eta ?? 'N/A'} mins
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              From: {route.start_location?.lat.toFixed(3)}, {route.start_location?.lng.toFixed(3)}
            </Text>
            <Text className="text-xs text-gray-500">
              To: {route.end_location?.lat.toFixed(3)}, {route.end_location?.lng.toFixed(3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

