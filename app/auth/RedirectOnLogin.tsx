// components/auth/RedirectOnLogin.tsx
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';
import { Text, View } from 'react-native';

export default function RedirectOnLogin() {
  const [alert, setAlert] = useState(false);
  const { profile } = useProfileStore();

  useEffect(() => {
    if (profile?.role === 'passenger') {
      router.replace('/dashboard/Passenger' as any);
    } else if (profile?.role === 'driver') {
      router.replace('/dashboard/Driver' as any);
    } else if (profile?.role === 'admin') {
      router.replace('/dashboard/Admin' as any);
    } else setAlert(true);
  }, [profile]);

  return (
    <View style={{ flex: 1, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' }}>
      <Text className='font-bold text-xl'> Welcome </Text>
      {alert && <Text> Could not load your profile, you may need to login again.</Text>}
    </View>
  );
}
