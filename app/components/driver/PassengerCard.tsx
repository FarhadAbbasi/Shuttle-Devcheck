// components/driver/PassengerCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { useDriverRouteStore } from '@/store/useDriverStore';
import React from 'react';
import { Passenger } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  passenger: Passenger;
};

type StatusIcon = {
  name: 'checkmark-circle' | 'exit-outline' | 'close-circle' | 'time-outline';
  color: string;
};

export const PassengerCard: React.FC<Props> = ({ passenger }) => {
  const { updatePassengerStatus } = useDriverRouteStore();

  const handleStatusUpdate = (newStatus: Passenger['status']) => {
    if (!newStatus) return;
    updatePassengerStatus(passenger.id, newStatus);
  };

  const getStatusColor = () => {
    switch (passenger.status) {
      case 'Onboarded':
        return 'bg-green-50 border-green-500';
      case 'Offboarded':
        return 'bg-blue-50 border-blue-500';
      case 'Absent':
        return 'bg-red-50 border-red-500';
      default:
        return 'bg-white border-slate-200';
    }
  };

  const getStatusIcon = (): StatusIcon => {
    switch (passenger.status) {
      case 'Onboarded':
        return { name: 'checkmark-circle', color: '#22c55e' };
      case 'Offboarded':
        return { name: 'exit-outline', color: '#3b82f6' };
      case 'Absent':
        return { name: 'close-circle', color: '#ef4444' };
      default:
        return { name: 'time-outline', color: '#64748b' };
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <View className={`p-4 rounded-xl border-2 ${getStatusColor()} shadow-sm`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-800 mb-1">
            {passenger.passenger_name}
          </Text>

          <View className="flex-row items-center">
            <Ionicons name={statusIcon.name} size={16} color={statusIcon.color} />
            <Text className="text-slate-600 ml-1 text-sm">
              {passenger.status || 'Waiting'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name= 'location-outline' size={16} color={statusIcon.color} />
            <Text className="text-slate-600 ml-1 text-sm">
            Stop: {passenger.passenger_details.school || 'Waiting'}
            </Text>
          </View>
        </View>
        
        {passenger.status === 'Waiting' && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => handleStatusUpdate('Onboarded')}
            >
              <Ionicons name="checkmark" size={18} color="white" />
              <Text className="text-white font-medium ml-1">Onboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => handleStatusUpdate('Absent')}
            >
              <Ionicons name="close" size={18} color="white" />
              <Text className="text-white font-medium ml-1">Absent</Text>
            </TouchableOpacity>
          </View>
        )}

        {passenger.status === 'Onboarded' && (
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => handleStatusUpdate('Offboarded')}
          >
            <Ionicons name="exit-outline" size={18} color="white" />
            <Text className="text-white font-medium ml-1">Offboard</Text>
          </TouchableOpacity>
        )}

        {(passenger.status === 'Absent' || passenger.status === 'Offboarded') && (
          <View className="bg-slate-100 px-3 py-1 rounded-full">
            <Text className="text-slate-600 font-medium text-sm">
              {passenger.status}
            </Text>
          </View>
        )}
      </View>

      {/* Additional Info Section */}
      {/* <View className="bg-slate-50 rounded-lg p-3 mt-2">
        <View className="flex-row items-center mb-2">
          <Ionicons name="school-outline" size={16} color="#64748b" />
          <Text className="text-slate-600 ml-2 text-sm">
            {passenger.school || 'School Name'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text className="text-slate-600 ml-2 text-sm">
            {passenger.address || 'Pickup Location'}
          </Text>
        </View>
      </View> */}
    </View>
  );
};
