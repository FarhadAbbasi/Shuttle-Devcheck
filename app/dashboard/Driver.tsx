// screens/driver-dashboard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
// import { PassengerList } from '@/components/driver/PassengerList';
// import { CompleteRouteButton } from '@/components/driver/CompleteRou6teButton';
import React, { useEffect, useState } from 'react';
import { useDriverRouteStore, useDriverStore } from '@/store/useDriverStore';
import { PassengerList } from '../components/driver/PassengerList';
import { CompleteRouteButton } from '../components/driver/CompleteRouteButton';
import Logout from '../auth/Logout';
import { useProfileStore } from '@/store/profileStore';
import RestartRouteButton from '../components/driver/RestartRouteButton';
import MapDriver from '../maps/MapDriver';
import ChooseRoute from '../components/driver/ChooseRoute';
import { router } from 'expo-router';



export default function DriverDashboard() {
  const [isOpenRouteCard, setIsOpenRouteCard] = useState<boolean>(true);
  const { isRouteComplete, resetRoute } = useDriverRouteStore();
  const { profile } = useProfileStore();
  const { driverDetails, currentRouteId } = useDriverStore();

  return (
    <View className="flex-1 bg-white" >
      <View className='pt-8 p-6 bg-slate-50 border-b border-slate-300'>

        <TouchableOpacity onPress={() => router.replace('/dashboard/Admin')} className="absolute top-0 right-10 mt-4 px-4 py-2 bg-slate-800 rounded">
          <Text className="text-white">Admin Panel</Text>
        </TouchableOpacity>
        <Logout />

        <Text className="text-2xl font-semibold text-slate-800 mb-2">Welcome {profile?.name || 'Driver'}  🚐</Text>
        <Text className="text-base text-slate-500 ">Driver Dashboard</Text>
      </View>

      {currentRouteId ?
        <>
          {!isRouteComplete && <PassengerList />}
          {isRouteComplete && <RestartRouteButton />}
          <MapDriver />
        </> :

        <ChooseRoute />
      }

    </View>
  );
}








// // ----------------------    LIVE MAPS ON SCREEN WITH MAP_BOX API    ---------------------->>>

// // components/MapScreen.tsx
// import React from 'react';
// import { View, Text, Alert, TouchableOpacity } from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
// import MapScreen from '@/app/maps/MapDriver';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuthStore } from '@/store/useAuthStore';
// import { router } from 'expo-router';


// export default function DriverDashboard() {
//   const { signOut } = useAuthStore();

//   const handleSignout = async () => {
//     try {
//       await signOut();
//       // Alert.alert('Signed Out')
//       router.replace('/') // or wherever you want to land
//     } catch (err) {
//       Alert.alert('Signing Out Failed')
//     }
//   }

//   return (
//     <View style={{ flex: 1 }}
//       className="flex-1 my-4 py-10 items-center justify-center bg-white">
//       <TouchableOpacity onPress={handleSignout} className="absolute top-10 right-10 mt-4 px-4 py-2 bg-slate-700 rounded">
//         <Text className="text-white">Logout</Text>
//       </TouchableOpacity>

//       <Text className="text-2xl font-semibold text-slate-800 mb-2">Welcome, Farhad  🚌</Text>
//       <Text className="text-base text-slate-500 mb-6">Driver Dashboard</Text>

//       <View className="bg-white rounded-2xl shadow p-4">
//         <Text className="text-lg font-medium text-slate-700 mb-2">Today's Shifts</Text>
//         <Text className="text-slate-500">You have no shifts assigned yet.</Text>
//       </View>

//       <MapScreen />
//     </View>
//   );
// }




{/* <View className="bg-white rounded-2xl shadow p-4">
        <Text className="text-lg font-medium text-slate-700 mb-2">Today's Shifts</Text>
        <Text className="text-slate-500">You have no shifts assigned yet.</Text>
      </View> */}





// ----------------------    LIVE MAPS ON SCREEN WITH REACT_NATIVE_MAPS    ---------------------->>>

// import { useEffect, useState } from 'react';
// import * as Location from 'expo-location';
// import MapView, { UrlTile, Marker } from 'react-native-maps';
// import { View, Text } from 'react-native';
// import { useProfileStore } from '@/store/profileStore';
// import { updateDriverLocation } from '@/lib/DatabaseCalls';


// export default function DriverDashboard() {
//     const { profile } = useProfileStore();
//     const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
//     // const [location, setLocation] = useState<number | null>(null);

//     const [errorMsg, setErrorMsg] = useState<string | null>(null);

//     useEffect(() => {
//         (async () => {
//             const { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }


//             const subscriber = await Location.watchPositionAsync(
//                 {
//                     accuracy: Location.Accuracy.High,
//                     timeInterval: 3000,
//                     distanceInterval: 10,
//                 },
//                 async (loc) => {
//                     const { latitude, longitude, altitude, altitudeAccuracy, accuracy, heading, speed } = loc.coords;
//                     console.log("Corrds:", loc.coords); // Loc.coords contain above extracted variables (latitude, longitude, altitude, altitudeAccuracy, accuracy, heading, speed)
//                     setLocation({ latitude, longitude, altitude, altitudeAccuracy, accuracy, heading, speed });  // Dummy extra fields
//                     // setLocation(loc.coords);


//                     if (profile?.user_id) {
//                         const data = await updateDriverLocation({
//                             user_id: profile.user_id,
//                             lat: latitude,
//                             lon: longitude,
//                         });

//                         console.log("Location data saved:", data);
//                     }
//                 }
//             );

//             return () => subscriber.remove();
//         })();
//     }, []);

//     return (
//         <View style={{ flex: 1 }}
//             className="flex-1 items-center justify-center bg-white">


//             <Text className="text-2xl font-semibold text-slate-800 mb-2">Welcome, {profile?.name}  🚌</Text>
//             <Text className="text-base text-slate-500 mb-6">Driver Dashboard</Text>

//             <View className="bg-white rounded-2xl shadow p-4">
//                 <Text className="text-lg font-medium text-slate-700 mb-2">Today's Shifts</Text>
//                 <Text className="text-slate-500">You have no shifts assigned yet.</Text>
//             </View>


//             {location ? (
//                 <MapView
//                     // className="w-full h-full"
//                     style={{ flex: 1 }}
//                     initialRegion={{
//                         latitude: location.latitude,
//                         longitude: location.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                 >
//                     <UrlTile
//                         // urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         urlTemplate="http://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         maximumZ={19}
//                         flipY={false}
//                     />

//                     <Marker
//                         coordinate={location}
//                         // coordinate={{
//                         //     latitude: location.coords.latitude,
//                         //     longitude: location.coords.longitude,
//                         // }}
//                         title="Your Location" />

//                 </MapView>
//             ) : (
//                 <View className="flex-1 items-center justify-center">
//                     <Text className="text-red-500">{errorMsg || "Fetching location..."}</Text>
//                 </View>
//             )}

//         </View>
//     );
// }

