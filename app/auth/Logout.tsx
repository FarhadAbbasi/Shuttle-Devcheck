// components/auth/RedirectOnLogin.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Logout() {
    const { signOut } = useAuthStore();

    // Handle Signout
    const handleSignout = async () => {
        try {
            await signOut();
            router.replace('/') // or wherever you want to land
            // alert('Signed Out')
        } catch (err) {
            alert('Signing Out Failed')
        }
    }


    return (
        <TouchableOpacity onPress={handleSignout}
            className="px-3 m-1 py-2 bg-slate-100 rounded-lg shadow w-28 flex-row items-center"
        >
            <Ionicons name="log-out" size={18} color="#475569" />
            <Text className="text-slate-700 ml-1">Logout </Text>
        </TouchableOpacity>
    );
}


