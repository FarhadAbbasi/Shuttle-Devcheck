// components/GuardianRequestForm.tsx
import { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import supabase from '@/lib/Supabase';
import { useProfileStore } from '@/store/profileStore';
import { useRouteRequestStore } from '@/store/usePassengerStore';
import { router } from 'expo-router';

export default function GuardianRequestForm() {
  // const [start, setStart] = useState('');
  // const [end, setEnd] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const { profile } = useProfileStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { routeSuggestion, clearRouteSuggestion } = useRouteRequestStore();

  console.log('Suggested route:', routeSuggestion);
  async function submitRequest() {
    if (!routeSuggestion) return
    if (!name || !school) {
      alert('Please enter passenger name and school name.');
      return;
    }
    setLoading(true);

    const { start_location, end_location, polyline, eta_minutes } = routeSuggestion;

    try {
      const { error: ride_request_err } = await supabase
        .from('ride_requests')
        .insert({
          guardian_id: profile?.id,
          start_location,
          end_location,
          passenger_name: name,
          school_name: school,
          status: 'pending'
        });
      if (ride_request_err) console.log('Ride Request Error', ride_request_err);


      const { data: savedRoute, error: route_err } = await supabase
        .from('routes')
        .insert({
          name: 'New Route',
          start_location,
          end_location,
          status: 'Premature',
          polyline,
          eta_minutes,
        });
      if (route_err) console.log('Ride Request Route_Creation Error', route_err);


      const { error: Passenger_error } = await supabase
        .from('passenger_routes')
        .insert({
          guardian_id: profile?.id,
          start_location,
          end_location,
          passenger_name: name,
          passenger_details: { school: school },
          route_id: savedRoute?.id || null,
        });
      if (Passenger_error) console.log('Ride Request Passenger_Route Error', Passenger_error);


      alert('Ride request submitted! We’ll notify you once a ride is available.');
      console.log('Ride request submitted! ', savedRoute);
      router.push('/dashboard/Passenger');
      clearRouteSuggestion();
      setName('');
      setSchool('');
      setLoading(false);
      return savedRoute;

    }
    catch (err) {
      console.log('Error:', err);
      alert(`Error submitting request. Please try again.`)
      setLoading(false);
    }

  }



  if (!routeSuggestion) {
    return <Text className='bg-red-600 p-1 rounded-lg text-lg text-slate-100 m-2'>  No route selected! </Text>
  }


  return (
    <View className="absolute top- z-10 bg-white w-11/12 self-center rounded-2xl p-6 gap-4 shadow-lg border border-gray-200 space-y-4">

      {/* <Text>From:</Text>
      <TextInput className='px-4 py-2 border border-slate-200 rounded-lg'
        value={start} onChangeText={setStart} placeholder="Start Point" />
      <Text>To:</Text>
      <TextInput className='px-4 py-2 border border-slate-200 rounded-lg'
        value={end} onChangeText={setEnd} placeholder="End Point" /> */}

      <Text>Passenger Name:</Text>
      <TextInput className='px-4 py-2 border border-slate-200 rounded-lg'
        value={name} onChangeText={setName} placeholder="Passenger Name" />
      <Text>School/Company Name:</Text>
      <TextInput className='px-4 py-2 border border-slate-200 rounded-lg'
        value={school} onChangeText={setSchool} placeholder="School/Company Name" />

      <Button title={isLoading ? 'Submitting 🌀' : "Submit Request"} onPress={submitRequest} />
    </View>
  );
}
