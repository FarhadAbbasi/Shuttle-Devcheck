import React, { Profiler, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/useAuthStore'
import RedirectOnLogin from './RedirectOnLogin'

export default function LoginScreen() {
  const router = useRouter()
  const { user, signIn, fetchProfile, loading } = useAuthStore ()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await signIn(email, password);
      await fetchProfile();
      if(user) router.replace('/auth/RedirectOnLogin' as any) // or wherever you want to land
    } catch (err) {
      Alert.alert('Login failed: Invalid email or password');
    }
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <View className="bg-gray-100 dark:bg-neutral-900 p-6 rounded-2xl shadow-lg space-y-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          Login
        </Text>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl text-base text-gray-800 dark:text-white"
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`mt-4 py-3 rounded-xl bg-black dark:bg-white ${
            loading ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-center text-white dark:text-black font-semibold text-base">
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text
          onPress={() => router.push('/auth/Signup')}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
        >
          Don’t have an account?{'  '}
          <Text className="mx-2 text-blue-600 dark:text-blue-400 font-medium">
            Sign up
          </Text>
        </Text>

        <RedirectOnLogin />

      </View>
    </View>
  )
}
