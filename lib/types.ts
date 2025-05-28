export interface Profile {
    id: string
    name: string
    email: string
    phone?: number
    role: 'passenger' | 'driver' | 'admin'
    driver_data: JSON
    pessenger_data: JSON
    assigned_driver_id?: string
    assigned_driver_name?: string
    vehicle_info?: VehicleInfo
    is_verified: boolean
}

export type VehicleInfo = {
    model?: string
    plate?: string
    color?: string
    vehicle_no: string
    max_capacity: number
    current_passengers?: number
}


export interface Driver {
  driver_id: string;
  vehicle_info?: any;
  is_verified?: boolean;
  current_location?: any;
  notes?: string;
  status?: string;
  route_ids?: string[];
}


export interface DriverLocation {
    user_id: string;
    lat: number;
    lng: number;
    updated_at?: string; // ISO string format
};

export interface Route {
    id?: string;
    name?: string;
    driver_id?: string;
    vehicle_info?: VehicleInfo;
    start_location: LatLng;
    end_location: LatLng;
    stops?: LatLng[];
    passengers?: {
        name: string;
        school: string;
        guardian_id: string;
    }[];
    route_days?: string[];
    polyline: any;
    eta_minutes?: number;
    status?: 'Available' | 'Booked' | 'Premature';
    created_at?: string;
    updated_at?: string;
}



export interface RideRequest {
    id: string;
    guardian_id: string;
    passenger_name: string;
    school_name: string;
    requested_start: any;
    requested_end: any;
    requested_days: string[];
    status: 'pending' | 'approved' | 'rejected';
    route_id?: string;
    created_at: string;
}

export interface PassengerRoute {
    id: string;
    guardian_id: string;
    route_id: string;
    passenger_name: string;
    school_name: string;
    created_at: string;
}

type PassengerStatus = 'Waiting' | 'Onboarded' | 'Offboarded' | 'Absent';

export type Passenger = {
  id: string;
  passenger_name: string;
  route_id?: string;
  driver_id?: string;
  start_location?: LatLng;
  end_location?: LatLng;
  status?: PassengerStatus;
  passenger_details?: {
    school?: string;
    address?: string;
  };
};



export type LatLng = { lng: number; lat: number  };
export type Coords = [number, number]; // [lng, lat]


export interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}
