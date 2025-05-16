// ----------------------  LIVE MAPS ON SCREEN WITH MAP_BOX API, MARKER and SUPABASE    ---------------------->>>

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { updateDriverLocation } from '@/lib/DatabaseCalls';
import { useProfileStore } from '@/store/profileStore';
import { Coords, LatLng } from '@/lib/types';
import { toCoords } from '@/lib/MapBox';
import AnimatedLogo from '../components/AnimatedLogo';
import AnimatedImage from '../components/AnimatedImage';
import { Image } from 'react-native';
import { useDriverRouteStore, useDriverStore } from '@/store/useDriverStore';

const mapbox_token = 'sk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyYXQxaTcxanJzMmxzaGNzdnAwaGNiIn0.AhkgCEmA_Ce0aV9lnE4i5g';
MapboxGL.setAccessToken(mapbox_token);
console.log('Initiating Maps ...');

export default function MapDriver() {
  const { profile } = useProfileStore();
  const { driverRoutes } = useDriverStore();

  // const [coords, setCoords] = useState<LatLng>({ lng: 74.3587, lat: 31.5204 });  // Lahore default
  const [coords, setCoords] = useState<LatLng>({ lng: 74.3587, lat: 31.5204 });  // Lahore default
  const pointGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'driver-marker',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: toCoords(coords),
        },
      },
    ],
  };


  useEffect(() => {  // Fetch Current Location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      // console.log('Loc access granted!')

      // await MapboxGL.Images.addImage('bus-icon', require('./assets/bus.png'));
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        async (location) => {
          if (!location?.coords) return;
          // console.log('Location:', location.coords);
          console.log('Location Coords:', location.coords.longitude, location.coords.latitude);
          const { latitude, longitude } = location.coords;
          // setCoords([longitude, latitude]); // {} or [] Depends on usage in UI
          setCoords({ lng: longitude, lat: latitude });

          console.log('profile.user_id', profile?.id);
          if (profile?.id) {
            await updateDriverLocation({
              user_id: profile.id,
              lng: longitude,
              lat: latitude,
            });
          }
        }
      );

      return () => sub.remove();
    })();
  }, []);
  console.log('Coords:', coords);


  return (
    <View className='border-2 border-slate-200 w-screen '
      style={{ flex: 1 }}>
      <Text className='absolute p-2 bg-gray-100 shadow-lg rounded text-xl text-slate-700 font-semibold top-8 right-4 z-10'>Map Screen</Text>

      {coords ? (
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Street}
        >
          <MapboxGL.Camera centerCoordinate={toCoords(coords)} zoomLevel={12} />

          <MapboxGL.MarkerView id="driver-marker" coordinate={toCoords(coords)}>
            <View className='bg-whit rounded-full' >
              <AnimatedImage>
                {/* <Image source={require('../../assets/images/pin.png')} className='w-12 h-12 rounded-lg  shadow-3xl' /> */}
                <Text className='font-bold text-4xl pb-2 px-1'>🚕</Text>
              </AnimatedImage>
            </View>
          </MapboxGL.MarkerView>



        </MapboxGL.MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
}









{/* <MapboxGL.Images images={{ bus: require('@/assets/images/icon.png') }} />

        <MapboxGL.ShapeSource id="driverLocationSource" shape={pointGeoJSON}>
          <MapboxGL.SymbolLayer
            id="driverLocationSymbol"
            style={{
              iconImage: 'bus', // You need to register this image
              iconSize: 0.5,
              iconAllowOverlap: true,
              iconIgnorePlacement: true,
            }}
          />
        </MapboxGL.ShapeSource> */}
