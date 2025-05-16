import { Passenger } from '@/store/useDriverStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cachePassengerList = async (passengerList: Passenger[]) => {
  try {
    await AsyncStorage.setItem('cachedPassengers', JSON.stringify(passengerList));
  } catch (err) {
    console.error('Error caching passengers', err);
  }
};

export const getCachedPassengerList = async (): Promise<Passenger[] | null> => {
  try {
    const value = await AsyncStorage.getItem('cachedPassengers');
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Error fetching cached passengers', err);
    return null;
  }
};
