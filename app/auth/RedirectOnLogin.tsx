// components/auth/RedirectOnLogin.tsx
import { useEffect } from 'react';
import { router} from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/profileStore';

export default function RedirectOnLogin() {

    const {profile} = useProfileStore();

  useEffect(() => {
    if (profile?.role === 'passenger') {
      router.replace('/dashboard/Passenger' as any);
    } else if (profile?.role === 'driver') {
      router.replace('/dashboard/Driver'  as any);
    } else if (profile?.role === 'admin') {
      router.replace('/dashboard/Admin' as any);
    }
  }, [profile]);

  return null;
}
