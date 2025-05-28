import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../../store/useAuthStore'
import { router } from 'expo-router';
import RedirectOnLogin from './RedirectOnLogin';
import { useProfileStore } from '@/store/profileStore';
// import { styled } from 'nativewind';



export default function Signup() {
  const { user, signUp, fetchProfile, loading } = useAuthStore()
  const { profile } = useProfileStore();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger')

  const handleSignup = async () => {
    if (!name || !email || !password || !phone) {
      alert('Please fill all fields');
      return ;
    }
    try {
      await signUp(name, email, password, phone, role);
      await fetchProfile();
      if(profile) router.replace('/auth/RedirectOnLogin' as any) // or wherever you want to land
      // router.push('/main/Home')
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <View className="bg-gray-100 dark:bg-neutral-900 p-6 rounded-2xl shadow-lg space-y-5">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          Sign Up
        </Text>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Full Name
          </Text>
          <TextInput
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
            placeholder="John Doe"
            onChangeText={setName}
            value={name}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Email
          </Text>
          <TextInput
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
            placeholder="you@example.com"
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Phone
          </Text>
          <TextInput
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
            placeholder="1234567890"
            onChangeText={setPhone}
            keyboardType="numeric"
            value={phone}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Password
          </Text>
          <TextInput
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
            placeholder="••••••••"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        {/* Role toggle buttons */}
        <View className="flex-row justify-around mb-2">
          {['passenger', 'driver'].map((r) => (
            <TouchableOpacity
              key={r}
              className={`px-4 py-2 rounded-xl ${role === r ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              onPress={() => setRole(r as 'passenger' | 'driver')}
            >
              <Text className="text-white font-semibold capitalize">{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className={`mt-2 py-3 rounded-xl bg-green-600 ${loading ? 'opacity-50' : ''
            }`}
        >
          <Text className="text-center text-white font-semibold text-base">
            {loading ? 'Creating account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <Text
          onPress={() => router.push('/auth/Login')}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          Already have an account?{' '}
          <Text className="text-blue-600 dark:text-blue-400 font-medium">
            Log in
          </Text>
        </Text>

        <RedirectOnLogin />

      </View>
    </View>
  );
}
