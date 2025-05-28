// store/useRouteRequestStore.ts
import { LatLng, Passenger, Route } from '@/lib/types';
import { create } from 'zustand';

interface RouteSuggestion {
  start_location: LatLng;
  end_location: LatLng;
  polyline: string;
  eta_minutes: number | null;
}

interface RouteRequestState {
  routeSuggestion: RouteSuggestion | null;
  setRouteSuggestion: (data: RouteSuggestion) => void;
  clearRouteSuggestion: () => void;
}

export const useRouteRequestStore = create<RouteRequestState>((set) => ({
  routeSuggestion: null,
  setRouteSuggestion: (data) => set({ routeSuggestion: data }),
  clearRouteSuggestion: () => set({ routeSuggestion: null }),
}));


interface PassengerState {
  passengers: Passenger[] | null;
  isLoading: boolean;
  error: string | null;
  setPassengers: (data: Passenger[]) => void;
  clearPassengers: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const usePassengerStore = create<PassengerState>((set) => ({
  passengers: null,
  isLoading: false,
  error: null,
  setPassengers: (data) => set({ passengers: data, error: null }),
  clearPassengers: () => set({ passengers: null, error: null }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));
