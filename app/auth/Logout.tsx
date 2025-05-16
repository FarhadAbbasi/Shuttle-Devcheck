// components/auth/RedirectOnLogin.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';
import { Text, TouchableOpacity } from 'react-native';

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
            <TouchableOpacity onPress={handleSignout} className="absolute top-10 right-10 mt-4 px-4 py-2 border border-slate-500 rounded">
                <Text className="text-black">Logout</Text>
            </TouchableOpacity>
    );
}


