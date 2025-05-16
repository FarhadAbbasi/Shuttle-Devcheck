// components/driver/PassengerCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { useDriverRouteStore } from '@/store/useDriverStore';
import React from 'react';
import clsx from 'clsx';
import { Passenger } from '@/lib/types';

type Props = {
  passenger: Passenger;
};

export const PassengerCard: React.FC<Props> = ({ passenger }) => {
  const { updatePassengerStatus } = useDriverRouteStore();

  const handleStatusUpdate = (newStatus: Passenger['status']) => {
    if(!newStatus) return
    updatePassengerStatus(passenger.id, newStatus);
  };

  const getBorderColor = () => {
    switch (passenger.status) {
      case 'Onboarded':
        return 'border-green-500';
      case 'Offboarded':
        return 'border-blue-500';
      case 'Absent':
        return 'border-red-500';
      default:
        return 'border-slate-200'; // Waiting
    }
  };

  return (
    <View
      className={clsx(
        'p-4 mb-3 rounded-lg border-2 bg-white',
        getBorderColor()
      )}
    >
      <Text className="font-bold text-lg mb-1">{passenger.passenger_name}</Text>
      {/* <Text className="font-bold text-lg mb-1">{passenger.status}</Text> */}




      <View className="flex-row justify-between">
        {passenger.status !== 'Onboarded' && passenger.status !== 'Absent' && (
          <TouchableOpacity
            className="bg-green-600 px-3 py-1 rounded"
            onPress={() => handleStatusUpdate('Onboarded')}
          >
            <Text className="text-white">Onboard</Text>
          </TouchableOpacity>
        )}

        {passenger.status === 'Onboarded' && (
          <TouchableOpacity
            className="bg-blue-600 px-3 py-1 rounded"
            onPress={() => handleStatusUpdate('Offboarded')}
          >
            <Text className="text-white">Offboard</Text>
          </TouchableOpacity>
        )}

        {passenger.status !== 'Absent' && passenger.status !== 'Onboarded' && passenger.status !== 'Offboarded' && (
          <TouchableOpacity
            className="bg-red-600 px-3 py-1 rounded"
            onPress={() => handleStatusUpdate('Absent')}
          >
            <Text className="text-white">Absent</Text>
          </TouchableOpacity>
        )}
        

        {passenger.status == 'Absent' &&
          <Text className="absolute bottom-1 right-0 text-base font-semibold text-gray-800 mb-2"> Absent </Text>
        }


        {passenger.status == 'Offboarded' &&
          <Text className="text-sm font-semibold text-gray-800 mb-2"> OffBoarded</Text>
        }

      </View>
    </View>
  );
};
