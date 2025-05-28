// components/driver/PassengerList.tsx
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useDriverRouteStore, useDriverStore } from '@/store/useDriverStore';
import { PassengerCard } from './PassengerCard';
import React, { useEffect, useRef } from 'react';
import { CompleteRouteButton } from './CompleteRouteButton';
import { Passenger } from '@/lib/types';
import supabase from '@/lib/Supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data with correct Passenger type
const mockPassengers: Passenger[] = [
  {
    id: 'p1',
    passenger_name: 'Alice',
    start_location: [24.925, 67.082],
    end_location: [24.943, 67.121],
    status: 'Waiting',
    // school: 'St. Mary School',
    // address: '123 Main St'
  },
  {
    id: 'p2',
    passenger_name: 'Bob',
    start_location: [24.911, 67.050],
    end_location: [24.950, 67.100],
    status: 'Waiting',
    // school: 'St. Mary School',
    // address: '456 Oak Ave'
  },
];

export const PassengerList: React.FC = () => {
  const { passengers, isRouteComplete } = useDriverRouteStore();
  const { currentRouteId } = useDriverStore();
  const { setPassengers } = useDriverRouteStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchPassengers = async () => {
      const { data: Passengers } = await supabase
        .from('passenger_routes')
        .select('*')
        .eq('route_id', currentRouteId);
      if (Passengers) setPassengers(Passengers);
    };
    fetchPassengers();
  }, []);

  if (isRouteComplete) {
    return (
      <View className="flex-1 bg-white p-6">
        <View className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
            </View>
            <Text className="text-xl font-semibold text-slate-800">Route Completed!</Text>
            <Text className="text-slate-500 text-center mt-1">
              All passengers have been safely transported.
            </Text>
          </View>
          <CompleteRouteButton />
        </View>
      </View>
    );
  }

  if (passengers.length === 0) {
    return (
      <View className="flex-1 bg-white p-6">
        <View className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="people-outline" size={32} color="#475569" />
            </View>
            <Text className="text-xl font-semibold text-slate-800">No Passengers</Text>
            <Text className="text-slate-500 text-center mt-1">
              You have no passengers assigned to this route yet.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const allPassengersProcessed = passengers.every(
    (p) => p.status === 'Offboarded' || p.status === 'Absent'
  );

  return (
    <View className="flex-1 bg-white m-4 ">
      {/* Sticky Header */}
      <Animated.View 
        style={{ opacity: headerOpacity }}
        className="bg-blue-50/50 px-4 py-3"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-semibold text-slate-800">Passenger List</Text>
            <Text className="text-sm text-slate-500">
              {passengers.length} {passengers.length === 1 ? 'Passenger' : 'Passengers'} Today
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.replace('/components/driver/ChooseRoute')}
            className="bg-sky-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="swap-horizontal" size={18} color="white" />
            <Text className="text-white font-medium ml-1">Switch Route</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View className="flex-1">
        {/* Passenger List */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          className="flex-1 min-h-80"
          contentContainerClassName="px-4 py-3"
        >
          {passengers?.map((p, index) => (
            <View key={p.id} className="mb-3">
              <View className="flex-row items-center mb-2">
                <View className="w-6 h-6 bg-sky-100 rounded-full items-center justify-center mr-2">
                  <Text className="text-sky-700 font-semibold">{index + 1}</Text>
                </View>
                <Text className="text-slate-500 text-sm">Stop {index + 1}</Text>
              </View>
              <PassengerCard passenger={p} />
            </View>
          ))}
        </Animated.ScrollView>

        {/* Complete Route Section */}
        <View className="p-2">
          <View className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-slate-800 font-medium">Route Progress</Text>
                <Text className="text-slate-500 text-sm">
                  {passengers.filter(p => p.status === 'Offboarded' || p.status === 'Absent').length} of {passengers.length} completed
                </Text>
              </View>
              {allPassengersProcessed && (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-sm font-medium">Ready to Complete</Text>
                </View>
              )}
            </View>
            <CompleteRouteButton />
          </View>
        </View>
      </View>
    </View>
  );
};
