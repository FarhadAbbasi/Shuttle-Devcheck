// ----------------------  LIVE MAPS ON SCREEN WITH MAP_BOX API, MARKER and SUPABASE    ---------------------->>>

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

// const mapbox_token = 'sk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyYXQxaTcxanJzMmxzaGNzdnAwaGNiIn0.AhkgCEmA_Ce0aV9lnE4i5g';
const mapbox_token = 'pk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyN2JtdjQxM2ZqMmtzZml3enhlYjFkIn0.cRgLBEyg4xGnP2WAmqxBVw'
MapboxGL.setAccessToken(mapbox_token);
console.log('Initiating Maps ...');

export default function MapPassenger({ coords }: { coords: { latitude: number; longitude: number } | null } ) {
//   const [coords, setCoords] = useState<null | { latitude: number; longitude: number }>(null);

  const pointGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'driver-marker',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
      },
    ],
  };



//   console.log('Coords:', coords);
  return (

    <View className='border-2 border-slate-200 w-screen '
      style={{ flex: 1 }}>
      <Text className='absolute p-2 bg-gray-100 shadow-lg rounded text-xl text-slate-700 font-semibold top-8 right-4 z-10'>Map Screen</Text>

      {coords ? (
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Street}
        >
          {/* <MapboxGL.Camera centerCoordinate={coords} zoomLevel={16} /> */}
          <MapboxGL.Camera centerCoordinate={[coords.longitude, coords.latitude]} zoomLevel={16} />

          {/* <MapboxGL.PointAnnotation id="driverLocation" coordinate={coords} > */}
          <MapboxGL.PointAnnotation id="driverLocation" coordinate={[coords.longitude, coords.latitude]} >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#00A8E8',
                borderRadius: 15,
                borderColor: '#fff',
                borderWidth: 5,
              }}
            />
          </MapboxGL.PointAnnotation>


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



          {/* <MapboxGL.MarkerView id="driver-marker" coordinate={coords}>
          <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 30 }}>
            <Text style={{ color: 'white' }}>🚌</Text>
          </View>
        </MapboxGL.MarkerView>  */}

        </MapboxGL.MapView>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
}


