// components/driver/PassengerList.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDriverRouteStore, useDriverStore } from '@/store/useDriverStore';
import { PassengerCard } from './PassengerCard';
import React, { useEffect } from 'react';
import { CompleteRouteButton } from './CompleteRouteButton';
import { Passenger } from '@/lib/types';
import supabase from '@/lib/Supabase';
import { router } from 'expo-router';

const mockPassengers: Passenger[] = [
  {
    id: 'p1',
    name: 'Alice',
    start_location: [24.925, 67.082],
    end_location: [24.943, 67.121],
    status: 'Waiting',
  },
  {
    id: 'p2',
    name: 'Bob',
    start_location: [24.911, 67.050],
    end_location: [24.950, 67.100],
    status: 'Waiting',
  },
];


export const PassengerList: React.FC = () => {
  const { passengers } = useDriverRouteStore();
  const { currentRouteId } = useDriverStore();
  const { setPassengers } = useDriverRouteStore();

  useEffect(() => { // Fetch Passengers
    const fetchPassengers = async () => {
      const { data: Passengers } = await supabase
        .from('passenger_routes').select('*')
        .eq('route_id', currentRouteId)
      if (Passengers) setPassengers(Passengers);
    }
    fetchPassengers();
  }, [])


  if (passengers.length === 0) {
    return (
      <View className="p-4">
        <View className="bg-white rounded-2xl shadow p-4">
          <Text className="text-lg font-medium text-slate-700 mb-2">Today's Shifts</Text>
          <Text className="text-slate-500">You have no shifts assigned yet.</Text>
        </View>

      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => router.replace('/components/driver/ChooseRoute')} className="m-4 ml-auto px-4 py-2 bg-sky-500 rounded">
        <Text className="text-white">Routes </Text>
      </TouchableOpacity>

      <ScrollView className="px-4 mt-2 flex ">
        {passengers?.map((p, id) => (
          <View key={id} className='grid grid-row' >
            <Text> {id} </Text>
            <PassengerCard key={p.id} passenger={p} />
          </View>
        ))}
      </ScrollView>
      <CompleteRouteButton />
    </View>
  );
};
