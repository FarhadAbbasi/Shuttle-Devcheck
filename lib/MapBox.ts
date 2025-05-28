// utils/mapbox.ts
import supabase from './Supabase';
import polyline from '@mapbox/polyline';
import { Coords, LatLng } from './types';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyN2JtdjQxM2ZqMmtzZml3enhlYjFkIn0.cRgLBEyg4xGnP2WAmqxBVw'

export function toLatLng(coords: Coords): LatLng {
  return { lat: coords[1], lng: coords[0] };
}

export function toCoords(latlng: LatLng): Coords {
  return [latlng.lng, latlng.lat];
}


// Fetch a new route from Mapbox (with coords: string)
// export async function getRoutePolyline(origin: string, destination: string) {
//   if (!origin || !destination) return;

//   try {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?geometries=polyline&access_token=${MAPBOX_TOKEN}`;
//     const res = await fetch(url);
//     const data = await res.json();
//     if (!res.ok) {
//       console.error('Mapbox API error:', data);
//       alert('Error Fetching Route. Please Try Again!')
//       return;
//     }

//     const encoded = data.routes[0].geometry;
//     const decoded = polyline.decode(encoded); // [[lat, lng], [lat, lng], ...]

//     return {
//       encoded,
//       decoded: decoded.map(([lat, lng]) => [lng, lat])
//     };
//   }
//   catch (err) {
//     alert('Error fetching Route..');
//     console.log('Fetch Route Error: ', err);
//   }
// }


// Fetch a new route from Mapbox (with coords: [number: number])
export async function getRoutePolyline(start: LatLng, end: LatLng) {
  if (!start || !end) return;

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=polyline&overview=full&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      console.error('Mapbox API error:', data);
      alert('Error Fetching Route. Please Try Again!')
      return;
    }
    if (!data.routes || !data.routes.length) return null;

    const bestRoute = data.routes[0]; //returning only one route yet
    const polyline = bestRoute.geometry;
    const eta_minutes = Math.round(bestRoute.duration / 60);  //Calculate estimated time arrival

    return {
      start_location: start,
      end_location: end,
      polyline,
      eta_minutes: eta_minutes || 0,
    };

  }
  catch (err) {
    alert('Error fetching Route..');
    console.log('Fetch Route Error: ', err);
  }
}


// Helper function to search newrby Routes
export function isNearby(a: LatLng, b: LatLng, radiusMeters = 1000): boolean {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  const distance = R * c;
  console.log('Distance diff:', distance);

  return distance <= radiusMeters;
}

// Find Out newrby matching Routes
export async function findMatchingRoutes(start: LatLng, end: LatLng) {
  console.log('Finding Matching Routes...')
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    // .eq('status', 'Available');
    .in('status', ['Available', 'Premature']);

  if (error) {
    console.error('Failed to fetch routes', error);
    return [];
  }
  if (data) {
    console.log('Fetched routes data:', data);
    // Filter on frontend using "nearby" logic
    return data.filter((route: any) => {
      return (
        isNearby(route.start_location, start) &&
        isNearby(route.end_location, end)
      );
    });
  }
}

// Save new Route to Supabase as "Premature"
export async function SavePrematureRoute(start: LatLng, end: LatLng, polyline: any, eta_minutes: number) {
  if (!start || !end || !polyline || !eta_minutes) return

  const { error, data: savedRoute } = await supabase
    .from('routes')
    .insert([
      {
        start_location: start,
        end_location: end,
        polyline,
        status: 'Premature',
        eta_minutes,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Failed to save route to Supabase:', error);
    return null;
  }
  console.log('Route Saved:', savedRoute);
  return savedRoute;
}