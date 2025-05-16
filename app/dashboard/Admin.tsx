import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import supabase from '@/lib/Supabase';

export default function AdminPanel() {
    const [rideRequests, setRideRequests] = useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);

    useEffect(() => {
        console.log('Starting fetching in Admin Panel ...')
        fetchRideRequests();
    }, []);

    async function fetchRideRequests() { // Pending requests
        const { data, error } = await supabase.from('ride_requests').select('*').eq('status', 'pending');
        if (!error) setRideRequests(data);
    }

    async function fetchAvailableRoutes() { //Premature, Available routes
        const { data, error } = await supabase.from('routes').select('*')
            // .eq('status', 'Premature');
            .in('status', ['Premature', 'Available']);
        if (!error) setAvailableRoutes(data);
    }

    async function fetchDrivers() { // All Drivers
        const { data, error } = await supabase.from('drivers').select('*');
        if (!error) setDrivers(data);
    }



    async function assignRouteToRequest(routeId: string) {
        if (!selectedRequest) return;

        try {
            console.log('assigning route to request..')
            console.log('request id:', selectedRequest.id);
            // 1. Update ride_requests
            const { data: ride_req_data, error: ride_req_error } = await supabase
                .from('ride_requests')
                .update({ route_id: routeId, status: 'Assigned' })
                .eq('id', selectedRequest.id);
            console.log('ride_req_res:', ride_req_data, ride_req_error);

            // 2. Update passenger_routes
            await supabase
                .from('passenger_routes')
                .update({ route_id: routeId })
                .eq('guardian_id', selectedRequest.guardian_id)
                .eq('passenger_name', selectedRequest.passenger_name);

            if (ride_req_data) alert('Route assigned to request!');


            // Fetch passenger_details and insert in routes table
            const { data: passengerRouteData, error: prError } = await supabase
                .from('passenger_routes')
                .select('id, passenger_name, passenger_details')
                .eq('guardian_id', selectedRequest.guardian_id).single();
            if (prError) { console.error('Error fetching passenger_detials:', prError); return }

            const passengerInfo = {
                id: passengerRouteData.id,
                name: passengerRouteData.passenger_name,
                school: passengerRouteData.passenger_details.school,
            };

            // Fetch current passengers from route
            const { data: routeData, error: fetchRouteError } = await supabase
                .from('routes').select('passengers').eq('id', routeId).single();

            if (fetchRouteError) { console.error('Error fetching passenger"s data from routes:', fetchRouteError); return }
            const updatedPassengers = routeData?.passengers ? [...routeData.passengers, passengerInfo] : [passengerInfo];

            // Update route with new passenger info
            await supabase.from('routes').update({ passengers: updatedPassengers }).eq('id', routeId);
        }
        catch (err) {
            console.log('Error assigning route to request:', err);
            return
        }
        
        setSelectedRequest(null);
        fetchRideRequests();
    }

    async function assignDriverToRoute(routeId: string, driverId: string) {
        // 1. Update routes table
        await supabase.from('routes').update({ driver_id: driverId, status: 'Available' }).eq('id', routeId);

        // 2. Update drivers table
        const { data: driverData } = await supabase.from('drivers').select('route_ids').eq('driver_id', driverId).single();
        const existingRoutes = driverData?.route_ids || [];
        const updatedRoutes = [...existingRoutes, routeId];
        await supabase.from('drivers').update({ route_ids: updatedRoutes }).eq('driver_id', driverId);

        // 3. Update passenger_routes
        await supabase.from('passenger_routes').update({ driver_id: driverId }).eq('route_id', routeId);

        alert('Driver assigned to route!');
        fetchRideRequests();
    }



    return (
        <ScrollView className="p-4 space-y-4">
            <Text className="text-xl font-bold">Ride Requests</Text>
            {rideRequests.map((req) => (
                <TouchableOpacity
                    key={req.id}
                    style={{ backgroundColor: selectedRequest?.id === req.id ? '#5c5' : '#fff' }} //color selected one
                    className="border p-4 rounded-xl bg-slate-100"
                    onPress={() => {
                        setSelectedRequest(req);
                        fetchAvailableRoutes();
                    }}
                >
                    <Text>{req.passenger_name} | {req.school_name}</Text>
                    <Text>Status: {req.status}</Text>
                </TouchableOpacity>
            ))}

            {selectedRequest && (
                <View className="mt-6">
                    <Text className="text-lg font-bold">Select a Route for: {selectedRequest.passenger_name}</Text>
                    {availableRoutes.map((route) => (
                        <TouchableOpacity
                            key={route.id}
                            className="border p-3 mt-2 rounded-xl bg-white"
                            onPress={() => assignRouteToRequest(route.id)}
                        >
                            <Text>Route: {route.name}</Text>
                            <Text>Status: {route.status}</Text>
                            <Text>ETA: {route.eta_minutes} min</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View className="mt-10">
                <Text className="text-xl font-bold">Assign Driver to Route</Text>
                <Button title="Fetch Drivers" onPress={fetchDrivers} />
                {availableRoutes.map((route) => (
                    <View key={route.id} className="mt-4 border p-4 rounded-xl bg-slate-50">
                        <Text className="font-semibold">Route: {route.name}</Text>
                        {drivers.map((driver) => (
                            <TouchableOpacity
                                key={driver.driver_id}
                                className="bg-green-100 p-2 mt-2 rounded-lg"
                                onPress={() => assignDriverToRoute(route.id, driver.driver_id)}
                            >
                                <Text>Assign: {driver.name || 'No Name'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
