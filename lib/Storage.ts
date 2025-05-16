// lib/storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const getJSON = <T>(key: string): T | null => {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
};

export const setJSON = (key: string, value: any) => {
  storage.set(key, JSON.stringify(value));
};

export const removeKey = (key: string) => {
  storage.delete(key);
};
