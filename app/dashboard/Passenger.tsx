// app/dashboard/passenger.tsx
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { fetchDriverLocation, subscribeToDriverLocation } from '@/lib/DatabaseCalls';
import MapPassenger from '../maps/MapPassenger';
import MapRoute from '../components/passenger/MapRouteList';
import GuardianRequestForm from '../components/passenger/GuardianRequestForm';
import { LatLng } from '@/lib/types';

export default function PassengerDashboard() {
    const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
    const [isOpenRequestForm, setIsOpenRequestForm] = useState(false);
    const { signOut } = useAuthStore();
    const { profile } = useProfileStore();
    const driverId = profile?.assigned_driver_id || null; // '14535d97-960f-41d5-b3dc-adcca575f871'
    console.log('Driver Loc: ', driverLocation);
    console.log('Driver ID is: ', driverId);

    // Fetch driver's last updated location 
    useEffect(() => {
        if (!driverId) return
        const getDriverLoc = async () => {
            const data = await fetchDriverLocation(driverId);
            setDriverLocation({ lat: data.lat, lng: data.lng });
        }
        getDriverLoc();
    }, [driverId]);


    // Subscribe to driver's current location 
    useEffect(() => {
        if (!driverId) return
        const unsubscribe = subscribeToDriverLocation(driverId, setDriverLocation);
        return () => unsubscribe(); // ✅ Cleanup on unmount
    }, [driverId]);


    // Assign a New Driver to Passenger
    const handleAssignDriver = async () => {
        console.log('Assigning a new Driver...');
        alert('Assigning a new driver');

        // await fetch drivers
    }


    // Handle Signout
    const handleSignout = async () => {
        try {
            await signOut();
            router.replace('/') // or wherever you want to land
            // alert('Signed Out')
        } catch (err) {
            Alert.alert('Signing Out Failed')
        }
    }



    return (
        <View className="flex-1 bg-slate-100 px-4 pt-10">
            <TouchableOpacity onPress={handleSignout} className="absolute top-10 right-10 mt-4 px-4 py-2 bg-slate-700 rounded">
                <Text className="text-white">Logout</Text>
            </TouchableOpacity>

            <Text className="text-2xl font-semibold text-slate-800 mb-2">Welcome, {profile?.name} </Text>
            <Text className="text-base text-slate-500 mb-6">Passenger Dashboard</Text>

            {!driverLocation && (
                <View className="flex bg-white rounded-2xl shadow p-4">
                    <Text className="text-lg font-medium text-slate-700 mb-2">Your Current NEW Status</Text>
                    <Text className="text-slate-500">You’re currently not assigned to any ride. But that's Okay </Text>
                </View>
            )}

            {/* <View className='flex'>
                {isOpenRequestForm && <GuardianRequestForm />}
            </View> */}

            {driverId && <MapRoute driverId={driverId} />}

        </View>
    );
}
