// store/useDriverRouteStore.ts
import { fetchDriverDetails, fetchDriverRoutes, resetAllPassengerStatusInDB, updatePassengerStatusInDB } from '@/lib/DatabaseCalls';
import { Driver, LatLng, Passenger } from '@/lib/types';
import { create } from 'zustand';

type PassengerStatus = 'Waiting' | 'Onboarded' | 'Offboarded' | 'Absent';

type DriverRouteStore = {
  passengers: Passenger[];
  currentRoute: Route | null;
  isRouteComplete: boolean;
  setPassengers: (list: Passenger[]) => void;
  updatePassengerStatus: (id: string, status: PassengerStatus) => void;
  completeRoute: () => void;
  resetRoute: () => void;
};



export const useDriverRouteStore = create<DriverRouteStore>((set, get) => ({
  passengers: [],
  currentRoute: null,
  isRouteComplete: false,
  setPassengers: (list) => set({ passengers: list }),
  updatePassengerStatus: async (id, status) => {
    if (!get().passengers) return

    const updated = get().passengers.map((p) =>
      p.id === id ? { ...p, status } : p
    );
    // const isComplete = Array.isArray(updated) && updated.every(
    //   (p) => p.status === 'Offboarded' || p.status === 'Absent'
    // );
    // set({ passengers: updated, isRouteComplete: isComplete });
    set({ passengers: updated });

    // 🔁 SYNC to Supabase
    try {
      const routeId = useDriverStore.getState().currentRouteId; // or fetch from profile/session
      if (routeId) await updatePassengerStatusInDB(id, routeId, status);
    } catch (err) {
      console.warn('Failed to sync passenger status, will retry later.');
    }
  },
  completeRoute: () => set({ isRouteComplete: true }),
  resetRoute: async () => {
    const routeId = useDriverStore.getState().currentRouteId; // or fetch from profile/session
    const reset = get().passengers.map((p) => ({
      ...p,
      status: 'Waiting' as PassengerStatus,
    }));
    set({ passengers: reset, isRouteComplete: false });
    if (routeId) await resetAllPassengerStatusInDB(routeId);
  },

}));


interface Route {
  id: string;
  name: string;
  start_location?: LatLng;
  end_location?: LatLng;
  polyline?: any;
}

interface DriverStore {
  driverDetails: Driver | null;
  currentRouteId: string | null;
  driverRoutes: Route[] | null;
  setCurrentRouteId: (routeId: string) => void;
  fetchDriverDetails: (driverId: string) => Promise<void>;
  fetchDriverRoutes: () => Promise<void>;
}


export const useDriverStore = create<DriverStore>((set, get) => ({
  currentRouteId: null,
  driverDetails: null,
  driverRoutes: [],
  setCurrentRouteId: (routeId) => set({ currentRouteId: routeId }),
  fetchDriverDetails: async (driverId) => {
    const driver_data = await fetchDriverDetails(driverId);
    if (driver_data) set({ driverDetails: driver_data });
  },
  fetchDriverRoutes: async () => {
    const routeIds = get().driverDetails?.route_ids || [];
    const routesData = await fetchDriverRoutes(routeIds);
    if (routesData) set({ driverRoutes: routesData });
  }
}));









// // ------------------------   Driver Store with MMKV Async-Storage  ----------------------->>
// // store/useDriverRouteStore.ts
// import { create } from 'zustand';
// import { storage, getJSON, setJSON } from '@/lib/Storage';
// import { Passenger, PassengerStatus } from '@/types';

// type DriverRouteState = {
//   passengers: Passenger[];
//   isRouteComplete: boolean;
//   setPassengers: (list: Passenger[]) => void;
//   updatePassengerStatus: (id: string, status: PassengerStatus) => void;
//   completeRoute: () => void;
//   resetRoute: () => void;
//   loadFromStorage: () => void;
// };

// export const useDriverRouteStore = create<DriverRouteState>((set, get) => ({
//   passengers: [],
//   isRouteComplete: false,

//   setPassengers: (list) => {
//     set({ passengers: list, isRouteComplete: false });
//     setJSON('passengers', list);
//     setJSON('isRouteComplete', false);
//   },

//   updatePassengerStatus: (id, status) => {
//     const updated = get().passengers.map((p) =>
//       p.id === id ? { ...p, status } : p
//     );
//     const isComplete = updated.every(
//       (p) => p.status === 'Offboarded' || p.status === 'Absent'
//     );
//     set({ passengers: updated, isRouteComplete: isComplete });
//     setJSON('passengers', updated);
//     setJSON('isRouteComplete', isComplete);
//   },

//   completeRoute: () => {
//     set({ isRouteComplete: true });
//     setJSON('isRouteComplete', true);
//   },

//   resetRoute: () => {
//     const reset = get().passengers.map((p) => ({
//       ...p,
//       status: 'Waiting' as PassengerStatus,
//     }));
//     set({ passengers: reset, isRouteComplete: false });
//     setJSON('passengers', reset);
//     setJSON('isRouteComplete', false);
//   },

//   loadFromStorage: () => {
//     const storedPassengers = getJSON<Passenger[]>('passengers');
//     const isComplete = getJSON<boolean>('isRouteComplete') || false;
//     if (storedPassengers) {
//       set({ passengers: storedPassengers, isRouteComplete: isComplete });
//     }
//   },
// }));
