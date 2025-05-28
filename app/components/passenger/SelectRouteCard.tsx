import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouteRequestStore } from '@/store/usePassengerStore';
import { router } from 'expo-router';
import { Route, RouteSuggestion } from '@/lib/types';

interface SelectRouteCardProps {
  routes: Route[];
}

export default function SelectRouteCard({ routes }: SelectRouteCardProps) {
  const { setRouteSuggestion } = useRouteRequestStore();

  const navigateToGuardianRequestForm = (route: Route) => {
    const suggestion: RouteSuggestion = {
      ...route,
      eta_minutes: route.eta_minutes ?? 0 // Provide default value as eta_minutes is mendetory for RouteSuggestion but not for Route
    };

    setRouteSuggestion(suggestion);
    router.push('/components/passenger/GuardianRequestForm');
  }

  return (
    <View>
      <ScrollView horizontal className="space-x-2">
        {routes?.map((route, i) => (
          <TouchableOpacity
            key={`route-card-${route.id || i}`}
            className="bg-gray-100 p-3 rounded-xl w-64"
            onPress={() => navigateToGuardianRequestForm(route)}
          >
            <Text className="text-base font-semibold">
              {route.status === 'Available' ? 'Available Route' : 'New Proposed Route'}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              ETA: {route.eta_minutes ?? 'N/A'} mins
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              From: {route.start_location?.lat?.toFixed(3) ?? 'N/A'}, {route.start_location?.lng?.toFixed(3) ?? 'N/A'}
            </Text>
            <Text className="text-xs text-gray-500">
              To: {route.end_location?.lat?.toFixed(3) ?? 'N/A'}, {route.end_location?.lng?.toFixed(3) ?? 'N/A'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

