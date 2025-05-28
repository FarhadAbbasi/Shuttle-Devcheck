// components/MapRoute.tsx
import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import polyline from '@mapbox/polyline'; //npm install @mapbox/polyline  and npm i --save-dev @types/mapbox__polyline (for typescript)
import { useEffect, useRef, useState } from 'react';
import { findMatchingRoutes, getRoutePolyline, toCoords } from '@/lib/MapBox';
import LocationSearchCard from './LocationSearchCard';
import { fetchDriverLocation, fetchDriverRoutes, subscribeToDriverLocation } from '@/lib/DatabaseCalls';
import RouteFinderModal from './RouteFinderModal';
import { LatLng, Route } from '@/lib/types';
import { router } from 'expo-router';
import LocationSelector from './LocationSelector';
import SelectRouteCard from './SelectRouteCard';
import { usePassengerStore, useRouteRequestStore } from '@/store/usePassengerStore';
import StartEndSelector from './StartEndSelector';
import { FeatureCollection, LineString } from 'geojson';


interface PolylinesRoute {
  start_location?: any; // Replace with LatLng type if needed
  end_location?: any;
  polyline: any;
  etaMinutes?: number;
};


export default function MapRoute() {
  const [searchCoords, setSearchCoords] = useState<{ startCoords: LatLng, endCoords: LatLng } | null>(null);
  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const { passengers } = usePassengerStore();
  const driverId = passengers && passengers[0]?.driver_id || passengers && passengers[1]?.driver_id || null; // '14535d97-960f-41d5-b3dc-adcca575f871'
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [polylinesRoute, setPolylinesRoute] = useState<Route[]>([]);
  const [newRoute, setNewRoute] = useState<Route[]>([]);
  // const [polylinesRoute, setPolylinesRoute] = useState<Route[]>([{ polyline: 'y~osFf~miV`@b@`@Zp@d@v@^X', start_location: '', end_location: '' }]);
  const [isLoadingRoute, setLoadingRoute] = useState<boolean>(false);
  const [isOpenRouteFinder, setIsOpenRouteFinder] = useState<boolean>(false);

  const origin = "73.0613880360713,33.666957013713784";
  const destination = "73.03058209987419,33.69437523422105";

  // Fetch driver's last updated location 
  useEffect(() => {
    if (!driverId) return
    const getDriverLoc = async () => {
      const data = await fetchDriverLocation(driverId);
      console.log('Driver Location is:', data?.lat, data?.lng);
      setDriverLocation({ lat: data.lat, lng: data.lng });
    }
    getDriverLoc();
  }, [driverId]);


  // Subscribe to driver's current location 
  useEffect(() => {
    if (!driverId) return
    const unsubscribe = subscribeToDriverLocation(driverId, setDriverLocation);
    return () => unsubscribe(); // ✅ Cleanup on unmount
  }, [driverId]);



  // Fetch passenger's assigned Routes 
  useEffect(() => {
    if (!passengers || !passengers[0]?.route_id) return;
    const getRoute = async () => {
      const data = await fetchDriverRoutes([passengers[0].route_id || '']);
      console.log('Passenger"s Route :', data);
      if (data) setPolylinesRoute(data);
    }
    getRoute();
  }, [passengers]);



  // Fetch passenger's searched route 
  useEffect(() => {
    const fetchRoutes = async () => {
      if (!searchCoords) return
      setLoadingRoute(true);
      console.log('request for route submitted. Coordinates: ', searchCoords);


      // const matched = await findMatchingRoutes(searchCoords.startCoords, searchCoords.endCoords);
      // console.log("Matched Route:", matched);

      // if (matched.length > 0) {
      //   setPolylinesRoute(matched);
      // } else {
      const newRoute = await getRoutePolyline(searchCoords.startCoords, searchCoords.endCoords);
      console.log('New Route : ', newRoute);
      if (newRoute) setNewRoute([newRoute]);
      // }
      setLoadingRoute(false);
    };

    fetchRoutes();
  }, [searchCoords]);



  const decodePolyline = (polylineRoute: any): [number, number][] => {
    return polyline.decode(polylineRoute).map(([lat, lng]: [number, number]) => [lng, lat]);
  };


  const coords = [73.0713880360713, 33.666957013713784]; // Default center coords: I-8 Islamabad
  const dummyRoutes = [
    {
      id: 'route1',
      polyline: 'wqnlE{u~|L~@Pp@NwPgC{DuH{YhReLaX{Bl@eAL{@_DuGAeCkA}FvBm|Bp|ALrAjJcEmUaj@oEaHuClBfBgB',
      status: 'Available',
      vehicle_info: {
        vehicle_no: 'ABC-123',
        max_capacity: 4,
        driver_name: 'Ali Khan',
        current_passengers: 2
      },
      eta_minutes: 12,
      bounds: {
        ne: [37.7897, -122.3906],
        sw: [37.7665, -122.4270]
      }
    },
    {
      id: 'route2',
      // polyline:'uyslE}o}|LaA_CSk@u@}@m@m@QKOGSGWCS?W@SDSFSJQNOPOXKXGZCTA^?ZDr@\j@`@h@h@\p@R`A@j@Ir@WbAq@TQl@g@zAgAdJoGlA{@`KeHvJuGvKeH~EmDvA_AhNuJr@e@\U|DmCxAcARMRMDEdAu@~AgAf@]ROdAs@nBsApDgCl@_@zGkEXQnDcCfCgBROjLyHl@a@`PyKfBqAjGsElA{@xAeAfBkANIXc@n@i@N[J_@DY@YE_@G[MUMOSOSIWEW?[BSJOJOLKNITETCR?X?RDVFXr@pANNlBtAXVjCpCvBjBfAl@f@XDB`Cz@lA\zIjCLDlBl@bIvBfBn@HB`Ct@fHpBjSdGxBl@bKzCpR|FdGjBj@P`FvAjLfDjFzA|@X~DhAh@P`ATdSzF|Ad@`@Nd@PrEvAvAj@d@Rr@\vDvBfDhBxC`Bn@^pBfAvAp@nCtA`FhClCvAr@`@pF~CzBjAv@`@xAz@VLt@\l@Zv@\x@^nA^\JXDD?jBVbBN~ANzCVlCT\BpBRp@DhEZ`@DdALhAFZ@xAFdBBp@?tA?`CAdACjEUPCXEnDUl@GZC`Gc@`BIfBGrCQL?^AZAdAEVC|@Cl@EvAGz@ERBf@@t@Df@Br@FV@LBD@~@RFBxBdAJF`BnAn@n@lAfA`AlATXTXJN~@pADFJJzAdBDFXZX\VXtDnEdBnBxAbBlD~DlBvBjFhGjB~BtCfDhC`DLLXZ`CrCFHl@r@XZMRSXsEfGY\`BnBPWCGCCAE@I@EBCBA@AD?D@b@f@DF',
      polyline: polylinesRoute[0]?.polyline || '',
      status: 'Available',
      vehicle_info: {
        vehicle_no: 'XYZ-456',
        max_capacity: 3,
        driver_name: 'Fatima Bibi',
        current_passengers: 3
      },
      eta_minutes: 25,
      bounds: {
        ne: [37.7897, -122.4006],
        sw: [37.7665, -122.4470]
      }
    },
    {
      id: 'route3',
      polyline: polylinesRoute[1]?.polyline || '',
      status: 'Booked',
      vehicle_info: {
        vehicle_no: 'XYZ-456',
        max_capacity: 3,
        driver_name: 'Fatima Bibi',
        current_passengers: 3
      },
      eta_minutes: 25,
      bounds: {
        ne: [37.7897, -122.4006],
        sw: [37.7665, -122.4470]
      }
    }
  ];
  const routeCoords = polyline.decode(dummyRoutes[0].polyline).map(([lat, lng]) => [lng, lat]);
  const routeCoordsStart = routeCoords[0];
  const routeCoordsEnd = routeCoords[routeCoords.length - 1];


  function handleSearch(start: LatLng, end: LatLng) {
    setSearchCoords({ startCoords: start, endCoords: end });
    setIsOpenRouteFinder(false);
  }




  // Center to a route when tapped (in the future)
  function zoomToRoute(route: any) {
    const routeBounds = route.bounds;
    if (routeBounds) {
      cameraRef.current?.fitBounds(
        routeBounds.sw,
        routeBounds.ne,
        100,    // padding
        1000    // animation duration (ms)
      );
    }
  }


  // const routeBounds = {
  //   sw: [73.0685, 33.6669],  // bottom-left
  //   ne: [73.0713, 33.7043],  // top-right
  // };
  // useEffect(() => {
  //   if (routeBounds) {
  //     cameraRef.current?.fitBounds(
  //       routeBounds.sw,
  //       routeBounds.ne,
  //       100,    // padding
  //       1000    // animation duration (ms)
  //     );
  //   }
  // }, [routeBounds]);



  return (
    <View style={{ flex: 1, marginVertical: 10, borderWidth: 5, borderColor: '#fdd' }}>

      <MapboxGL.MapView style={{ flex: 1 }} styleURL={MapboxGL.StyleURL.Street} logoEnabled={false}
      >
        <MapboxGL.Camera zoomLevel={12} ref={cameraRef}
          centerCoordinate={driverLocation ? toCoords(driverLocation) : coords} // Default center: I-8 Islamabad
        // centerCoordinate={coords} // Default center: I-8 Islamabad
        />


        {/* {dummyRoutes
          .filter(route => route.status === 'Available')
          .map((route, index) => {
            if (!route.polyline) return null; // ⛔ skip empty polylines
            const decoded = polyline.decode(route.polyline);
            if (!decoded || decoded.length < 2) return null; // ⛔ skip if not a valid line
            const coords = decoded.map(([lat, lng]) => [lng, lat]);

            const geojson: FeatureCollection = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: coords
                } as LineString,
                properties: { id: route.id || `route-${index}` }
              }]
            };

            return (
              <>
                <MapboxGL.ShapeSource key={route.id} id={`route-${route.id}`} shape={geojson} >
                  <MapboxGL.LineLayer id={`line-${route.id}`}
                    style={{ lineColor: '#3b82f6', lineWidth: 5, lineJoin: 'round' }}
                  />
                </MapboxGL.ShapeSource>
                <MapboxGL.PointAnnotation id={`Start-Location-${route.id}`} coordinate={coords[0]} >
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: '#A800E8',
                      borderRadius: 15,
                      borderColor: '#fff',
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
                <MapboxGL.PointAnnotation id={`End-Location-${route.id}`} coordinate={coords[coords.length - 1]} >
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: '#A800E8',
                      borderRadius: 15,
                      borderColor: '#fff',
                      borderWidth: 3,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              </>
            );
          })
        } */}

        {polylinesRoute &&
          polylinesRoute
            // .filter(route => route.status === 'Available')
            .map((route, index) => {
              if (!route.polyline) return null; // ⛔ skip empty polylines
              const decoded = polyline.decode(route.polyline);
              if (!decoded || decoded.length < 2) return null; // ⛔ skip if not a valid line
              const coords = decoded.map(([lat, lng]) => [lng, lat]);

              const geojson: FeatureCollection = {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: coords
                  } as LineString,
                  properties: { id: route.id || `route-${index}` }
                }]
              };

              return (
                <React.Fragment key={`route-${route.id || index}`}>
                  <MapboxGL.ShapeSource id={`route-${route.id || index}`} shape={geojson}>
                    <MapboxGL.LineLayer
                      id={`line-${route.id || index}`}
                      style={{ lineColor: '#3b82f6', lineWidth: 5, lineJoin: 'round' }}
                    />
                  </MapboxGL.ShapeSource>

                  <MapboxGL.PointAnnotation id={`StartLocation-${route.id || index}`} coordinate={coords[0]}>
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: '#A800E8',
                        borderRadius: 15,
                        borderColor: '#fff',
                        borderWidth: 3,
                      }}
                    />
                  </MapboxGL.PointAnnotation>
                </React.Fragment>
              );
            })
        }

        {newRoute &&
          newRoute
            // .filter(route => route.status === 'Available')
            .map((route, index) => {
              if (!route.polyline) return null; // ⛔ skip empty polylines
              const decoded = polyline.decode(route.polyline);
              if (!decoded || decoded.length < 2) return null; // ⛔ skip if not a valid line
              const coords = decoded.map(([lat, lng]) => [lng, lat]);

              const geojson: FeatureCollection = {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: coords
                  } as LineString,
                  properties: { id: route.id || `new-route-${index}` }
                }]
              };

              return (
                <React.Fragment key={`new-route-${route.id || index}`}>
                  <MapboxGL.ShapeSource id={`new-route-${route.id || index}`} shape={geojson}>
                    <MapboxGL.LineLayer id={`new-line-${route.id || index}`}
                      style={{ lineColor: '#3bff88', lineWidth: 5, lineJoin: 'round' }}
                    />
                  </MapboxGL.ShapeSource>

                  <MapboxGL.PointAnnotation id={`New-StartLocation-${route.id || index}`} coordinate={coords[0]}>
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: '#A800E8',
                        borderRadius: 15,
                        borderColor: '#fff',
                        borderWidth: 3,
                      }}
                    />
                  </MapboxGL.PointAnnotation>
                </React.Fragment>
              );
            })
        }

        {driverLocation &&
          <MapboxGL.PointAnnotation id="driverLocation" coordinate={toCoords(driverLocation)}>
            <View style={{ backgroundColor: 'white', borderRadius: 30 }}>
              <View style={{ padding: 4 }}>
                <Text style={{ fontSize: 30 }}>🚘</Text>
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        }

      </MapboxGL.MapView>

      <TouchableOpacity onPress={() => setIsOpenRouteFinder(!isOpenRouteFinder)}
        style={{ backgroundColor: isOpenRouteFinder ? '#e00' : '#3b82f6' }}
        className='absolute z-100 top-[-60] right-2 p-2 bg-green-500 shadow-lg rounded-lg'>
        <Text className='text-white text-lg'> {isOpenRouteFinder ? 'Close X' : 'Find a new Route'} </Text>
      </TouchableOpacity>
      {/* {isOpenRouteFinder && <LocationSelector onSelectCoords={handleSearch} />} */}



      {newRoute && <SelectRouteCard routes={newRoute} />}


    </View>
  );
}














{/* <TouchableOpacity onPress={() => setIsOpenRouteFinder(!isOpenRouteFinder)} className='absolute top-10 left-2 p-2 bg-green-500 rounded-lg'>
        <Text className='text-white'> {isOpenRouteFinder ? 'X' : 'Find Route'} </Text> </TouchableOpacity>
      {isOpenRouteFinder && <StartEndSelector onSubmit={handleSearch} />} */}

{/* <TouchableOpacity onPress={() => setIsOpenRouteFinder(!isOpenRouteFinder)} className='absolute top-10 right-2 p-2 bg-green-500 rounded-lg'>
        <Text className='text-white'> {isOpenRouteFinder ? 'X' : 'Find Route'} </Text> </TouchableOpacity>
      {isOpenRouteFinder && <LocationSearchCard onSelectRoute={handleSearch} />} */}



{/* {(showFinder && searchCoords) ? (
          <RouteFinderModal
            start={searchCoords.startCoords}
            end={searchCoords.endCoords}
            onClose={() => setShowFinder(false)}
            onSelectRoute={(route) => {
              setShowFinder(false);
              navigateToGuardianRequestForm(route);
            }}
          />
        ) : (<></>)} 
      */}






// // components/MapRoute.tsx
// import MapboxGL from '@rnmapbox/maps';
// import { FeatureCollection, LineString } from 'geojson';

// export default function MapRoute({ coordinates }: {coordinates: { latitude: number; longitude: number }[]}) {
//   const geojson: FeatureCollection = {
//     type: 'FeatureCollection',
//     features: [
//       {
//         type: 'Feature',
//         geometry: {
//           type: 'LineString',
//           coordinates: coordinates.map(c => [c.longitude, c.latitude])
//         } as LineString,
//         properties: {}
//       }
//     ]
//   };

//   return (
//     <MapboxGL.ShapeSource id="routeSource" shape={geojson}>
//       <MapboxGL.LineLayer
//         id="routeLine"
//         style={{ lineColor: 'blue', lineWidth: 4 }}
//       />
//     </MapboxGL.ShapeSource>
//   );
// }
