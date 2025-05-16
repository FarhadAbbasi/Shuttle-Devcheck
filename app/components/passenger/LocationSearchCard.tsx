import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Keyboard } from 'react-native';
import { Button } from 'react-native';
import { debounce } from 'lodash';
import { LatLng, Suggestion } from '@/lib/types';
import { toLatLng } from '@/lib/MapBox';

// const MAPBOX_TOKEN = process.env.MAPBOX_PUBLIC_TOKEN || '<YOUR_PUBLIC_TOKEN>';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyN2JtdjQxM2ZqMmtzZml3enhlYjFkIn0.cRgLBEyg4xGnP2WAmqxBVw'


export default function LocationSearchCard({ onSelectRoute }: { onSelectRoute: (startCoords: LatLng, endCoords: LatLng) => void }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);
  const [selectedStart, setSelectedStart] = useState<Suggestion | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Suggestion | null>(null);

  const fetchSuggestions = debounce(async (text: string, setFunc: any) => {
    if (!text)  return setFunc([]);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    setFunc(data.features);
  }, 300);

  useEffect(() => fetchSuggestions(start, setStartSuggestions), [start]);
  useEffect(() => fetchSuggestions(end, setEndSuggestions), [end]);

  const submit = () => {
    if (selectedStart && selectedEnd) {
      onSelectRoute(toLatLng(selectedStart.center), toLatLng(selectedEnd.center));
      Keyboard.dismiss();
    }
  };

  return (
    <View className="absolute top-20 inset-0 m-4 p-4 self-center z-50 bg-white w-11/12 max-w-md rounded-2xl shadow-lg gap-2 space-y-4">
      <Text className="text-slate-700 font-semibold">From</Text>
      <TextInput
        className="border border-slate-300 rounded-lg px-4 py-2"
        value={start}
        onChangeText={text => {
          setStart(text);
          setSelectedStart(null);
        }}
        placeholder="Start Location"
      />
      {startSuggestions.length > 0 && !selectedStart && (
        <FlatList
          data={startSuggestions}
          keyExtractor={(item) => item.id}
          className="bg-white border border-slate-200 rounded-lg max-h-40"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-4 py-2 border-b border-slate-100"
              onPress={() => {
                setSelectedStart(item);
                setStart(item.place_name);
                setStartSuggestions([]);
              }}>
              <Text className="text-slate-600 text-sm">{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text className="text-slate-700 font-semibold">To</Text>
      <TextInput
        className="border border-slate-300 rounded-lg px-4 py-2"
        value={end}
        onChangeText={text => {
          setEnd(text);
          setSelectedEnd(null);
        }}
        placeholder="Destination"
      />
      {endSuggestions.length > 0 && !selectedEnd && (
        <FlatList
          data={endSuggestions}
          keyExtractor={(item) => item.id}
          className="bg-white border border-slate-200 rounded-lg max-h-40"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-4 py-2 border-b border-slate-100"
              onPress={() => {
                setSelectedEnd(item);
                setEnd(item.place_name);
                setEndSuggestions([]);
              }}>
              <Text className="text-slate-600 text-sm">{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Button title="Get Route" onPress={submit} disabled={!selectedStart || !selectedEnd} />
    </View>
  );
}
