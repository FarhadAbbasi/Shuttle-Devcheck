// store/useRouteRequestStore.ts
import { LatLng } from '@/lib/types';
import { create } from 'zustand';

interface RouteSuggestion {
  start_location: LatLng;
  end_location: LatLng;
  polyline: string;
  eta_minutes: number;
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
