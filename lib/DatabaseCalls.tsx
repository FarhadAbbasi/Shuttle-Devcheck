import { useRouteRequestStore } from "@/store/usePassengerStore";
import supabase from "./Supabase";
import { DriverLocation, LatLng } from "./types";


export async function updateDriverLocation(payload: DriverLocation): Promise<void> {
  const { user_id, lat, lng } = payload;
  if (!user_id) return;
  console.log('Storing location in DB:', { user_id, lat, lng });

  const { data, error } = await supabase
    .from('driver_locations')
    .upsert({
      user_id,
      lat,
      lng,
      updated_at: new Date().toISOString(),
    });

  if (data) {
    return data;
  }
  if (error) {
    console.error('Failed to update driver location:', error.message);
  }
}


// Fetch driver's Last updated location
export async function fetchDriverLocation(driverId: string) {
  if (!driverId) return;
  const { data, error } = await supabase
    .from('driver_locations')
    .select('*')
    .eq('user_id', driverId)
    .single()
  if (data) {
    return data;
  }
  if (error) console.error('Failed to fetch driver location:', error.message);
}



// Fetch driver's current contineously updating location
export function subscribeToDriverLocation(
  driverId: string,
  onLocationUpdate: (location: LatLng) => void
) {
  // if(!driverId) return
  console.log('Driver_ID in Fetch Location:', driverId);
  const channel = supabase
    .channel('driver-location-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'driver_locations',
        filter: `user_id=eq.${driverId}`,
      },
      (payload) => {
        const newLoc = payload.new;
        if (newLoc.lat && newLoc.lng) {
          onLocationUpdate({ lat: newLoc.lat, lng: newLoc.lng });
        }
      }
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}


// Update Passenger's Status In Supabase
export const updatePassengerStatusInDB = async (
  passenger_id: string,
  route_id: string,
  status: string
) => {
  const { error } = await supabase
    .from('passenger_routes')
    .update({ status })
    .match({ id: passenger_id, route_id });

  if (error) {
    console.error('Supabase update error:', error.message);
    throw error;
  }
};


// Update Passenger's Status In Supabase
export const resetAllPassengerStatusInDB = async ( route_id: string)  => {
  const { error } = await supabase
    .from('passenger_routes')
    .update({ status: 'Waiting' })
    .eq('route_id', route_id);

  if (error) {
    console.error('Supabase update error:', error.message);
    throw error;
  }
}


export const fetchDriverDetails = async (driverId: string) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('driver_id', driverId)
    .single();

  if (error) {
    console.error('Failed to fetch driver Details:', error);
    return;
  }
  return data;
}


export const fetchDriverRoutes = async (routeIds: string[]) => {
  const { data, error } = await supabase
    .from("routes")
    .select("id, name, start_location, end_location, polyline")
    .in("id", routeIds);

  if (error) {
    console.error('Failed to fetch passenger routes:', error);
    return;
  }
  return data;
}

export const fetchPassengersDetails = async (guardianId: string) => {
  const { data, error } = await supabase
    .from('passenger_routes')
    .select('id, passenger_name, route_id, driver_id, status')
    .eq('guardian_id', guardianId)

  if (error) {
    console.error('Failed to fetch passengers details:', error);
    return;
  }
  return data;
}
