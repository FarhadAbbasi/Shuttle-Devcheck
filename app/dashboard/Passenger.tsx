// app/dashboard/passenger.tsx
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { fetchDriverLocation, fetchPassengersDetails, subscribeToDriverLocation } from '@/lib/DatabaseCalls';
import MapPassenger from '../maps/MapPassenger';
import MapRoute from '../components/passenger/MapRouteList';
import GuardianRequestForm from '../components/passenger/GuardianRequestForm';
import { LatLng, Passenger } from '@/lib/types';
import Logout from '../auth/Logout';
import { usePassengerStore } from '@/store/usePassengerStore';

export default function PassengerDashboard() {
    const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
    const [isOpenRequestForm, setIsOpenRequestForm] = useState(false);
    const { signOut } = useAuthStore();
    const { profile } = useProfileStore();
    const { passengers, setPassengers, isLoading, error, setError, setLoading } = usePassengerStore();
    // const driverId = passengers && passengers[0]?.driver_id || passengers && passengers[1]?.driver_id || null; // '14535d97-960f-41d5-b3dc-adcca575f871'

    // Fetch passengers against this guardian profile 
    useEffect(() => {
        if (!profile?.id) return;

        const getPassengersDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchPassengersDetails(profile.id);
                if (data) {
                    setPassengers(data);
                    console.log('Passengers:', data);
                }
            } catch (err) {
                console.error('Error fetching passengers:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch passengers');
            } finally {
                setLoading(false);
            }
        };

        getPassengersDetails();
    }, [profile]);

    if (error) {
        return (
            <View className="flex-1 bg-white px-4 pt-10 items-center justify-center">
                <Text className="text-red-500 mb-4">{error}</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-lg"
                    onPress={() => setError(null)}
                >
                    <Text className="text-white">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            {/* <View className='absolute top-10 right-4 flex-row justify-end'> */}
            <Logout />
            {/* </View> */}

            <Text className="text-2xl font-semibold text-slate-800 mb-2">Welcome, {profile?.name} </Text>
            <Text className="text-base text-slate-500 mb-6">Passenger Dashboard</Text>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-2 text-slate-600">Loading passenger details...</Text>
                </View>
            ) : !passengers ? (
                <View className="flex bg-white rounded-2xl shadow p-4">
                    <Text className="text-lg font-medium text-slate-700 mb-2">Your Current Status</Text>
                    <Text className="text-slate-500">You're currently not assigned to any ride. But that's Okay, you can request a new Route.</Text>
                </View>
            ) : (
                <View className='flex-1'>
                    {/* <Text>Hello</Text> */}
                    <MapRoute />
                </View>
            )}


            {/* <MapRoute /> */}

        </View>
    );
}
