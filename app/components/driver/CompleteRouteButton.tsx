// components/driver/CompleteRouteButton.tsx
import { View, TouchableOpacity, Text } from 'react-native';
import { Passenger, useDriverRouteStore } from '@/store/useDriverStore';
import React from 'react';
import clsx from 'clsx';


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


export const CompleteRouteButton: React.FC = () => {
    const { passengers, completeRoute, resetRoute, isRouteComplete } = useDriverRouteStore();

    const isAllDone = passengers.every(
        (p) => p.status === 'Offboarded' || p.status === 'Absent'
    );


    if (isRouteComplete) {
        return (
            <View className="m-4">

                <View className="bg-white rounded-2xl shadow my-4 p-4">
                    <Text className="text-lg font-medium text-slate-700 mb-2">Today's Route</Text>
                    <Text className="text-slate-500">Thanks for completing your Route .</Text>
                </View>

                <TouchableOpacity
                    className={clsx(
                        'rounded-xl px-4 py-3 bg-sky-600'
                    )}
                    disabled={!isRouteComplete}
                    onPress={resetRoute}
                >
                    <Text className="text-white text-center text-lg font-semibold">
                        Restart Route
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View className="m-4">
            <TouchableOpacity
                className={clsx(
                    'rounded-lg px-4 py-3',
                    isAllDone ? 'bg-green-600' : 'bg-slate-400'
                )}
                disabled={!isAllDone}
                onPress={completeRoute}
            >
                <Text className="text-white text-center text-lg font-semibold">
                    Mark Route Complete
                </Text>
            </TouchableOpacity>
        </View>
    );
};
