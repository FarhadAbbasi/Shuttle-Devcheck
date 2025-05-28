import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import polyline from '@mapbox/polyline';
import { findMatchingRoutes, getRoutePolyline } from '@/lib/MapBox';
// import { LatLng } from '@/types';
// import { X } from 'lucide-react-native';

interface Props {
  start: LatLng;
  end: LatLng;
  onClose: () => void;
  onSelectRoute: (route: any) => void;
}
type LatLng = { lat: number; lng: number };


const RouteFinderModal: React.FC<Props> = ({ start, end, onClose, onSelectRoute }) => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      const matched = await findMatchingRoutes(start, end);
      console.log("Matched Route:", matched);

      if (matched.length > 0) {
        setRoutes(matched);
      } else {
        const newRoute = await getRoutePolyline(start, end);
        console.log('New Route : ', newRoute);
        if (newRoute) setRoutes([newRoute]);
      }

      setLoading(false);
    };

    loadRoutes();
  }, [start, end]);


  const decodePolyline = (polylineRoute: any): [number, number][] => {
    return polyline.decode(polylineRoute).map(([lat, lng]: [number, number]) => [lng, lat]);
  };

  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 bg-white z-50">
      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera
          zoomLevel={10}
          centerCoordinate={[start.lng, start.lat]}
        />
        {routes?.map((route, index) => (
          <MapboxGL.ShapeSource
            id={`route-${index}`}
            key={index}
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: decodePolyline(route.polyline),
              },
            }}
          >
            <MapboxGL.LineLayer
              id={`line-${index}`}
              style={{
                lineColor: route.status === 'Available' ? '#22c55e' : '#5e55cc',
                lineWidth: 5,
              }}
            />
          </MapboxGL.ShapeSource>
        ))}
      </MapboxGL.MapView>

      {/* Overlay Panel */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl shadow-lg">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Matching Routes</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-lg font-semibold">✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="py-4">
            <Text className="text-center text-gray-500">Searching for routes...</Text>
          </View>
        ) : (
          <ScrollView horizontal className="space-x-2">
            {routes?.map((route, i) => (
              <TouchableOpacity
                key={`route-${i}`}
                className="bg-gray-100 p-3 rounded-xl w-64"
                onPress={() => onSelectRoute(route)}
              >
                <Text className="text-base font-semibold">
                  {route.status === 'Available' ? 'Available Route' : 'New Proposed Route'}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  ETA: {route.eta_minutes ?? 'N/A'} mins
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  From: {route.start_location?.lat?.toFixed(3) ?? 'N/A'}, {route.start_location?.lng?.toFixed(3) ?? 'N/A'}
                </Text>
                <Text className="text-xs text-gray-500">
                  To: {route.end_location?.lat?.toFixed(3) ?? 'N/A'}, {route.end_location?.lng?.toFixed(3) ?? 'N/A'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default RouteFinderModal;





      {/* Overlay Panel */}
      // {(showFinder && searchCoords) ? (

      //   <View className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-lg p-4 max-h-1/2">
      //     <View className="flex-row justify-between items-center mb-2">
      //       <Text className="text-lg font-bold">Matching Routes</Text>
      //       <TouchableOpacity onPress={() => setShowFinder(false)}>
      //         <Text> X </Text>
      //       </TouchableOpacity>
      //     </View>

      //     {isLoadingRoute ? (
      //       <Text className="text-center text-gray-500">Searching for routes...</Text>
      //     ) : (
      //       <ScrollView horizontal className="space-x-2">
      //         {polylinesRoute?.map((route, i) => (
      //           <TouchableOpacity
      //             key={i}
      //             className="bg-gray-100 p-3 rounded-xl w-64"
      //             onPress={() => {
      //               setShowFinder(false);
      //               navigateToGuardianRequestForm(route);
      //             }}
      //           >
      //             <Text className="text-base font-semibold">
      //               {route.status === 'Available' ? 'Available Route' : 'New Proposed Route'}
      //             </Text>
      //             <Text className="text-sm text-gray-600 mt-1">
      //               ETA: {route.eta_minutes ?? 'N/A'} mins
      //             </Text>
      //             <Text className="text-xs text-gray-500 mt-1">
      //               From: {route.start_location.lat.toFixed(3)}, {route.start_location.lng.toFixed(3)}
      //             </Text>
      //             <Text className="text-xs text-gray-500">
      //               To: {route.end_location.lat.toFixed(3)}, {route.end_location.lng.toFixed(3)}
      //             </Text>
      //           </TouchableOpacity>
      //         ))}
      //       </ScrollView>
      //     )}
      //   </View>
      // ) : (<></>)}
