import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Keyboard, Switch, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { debounce } from 'lodash';
import { Suggestion, Coords, LatLng } from '@/lib/types';
import { toCoords, toLatLng } from '@/lib/MapBox';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxpLWFiYmFzaSIsImEiOiJjbWEyN2JtdjQxM2ZqMmtzZml3enhlYjFkIn0.cRgLBEyg4xGnP2WAmqxBVw';

export default function LocationSelector({
    onSelectCoords,
}: {
    onSelectCoords: (start: LatLng, end: LatLng) => void;
}) {
    const [useMapForStart, setUseMapForStart] = useState(false);
    const [useMapForEnd, setUseMapForEnd] = useState(false);

    const [startText, setStartText] = useState('');
    const [endText, setEndText] = useState('');

    const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
    const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);

    const [startCoords, setStartCoords] = useState<Coords | null>(null);
    const [endCoords, setEndCoords] = useState<Coords | null>(null);

    const [selectedStartPlace, setSelectedStartPlace] = useState('');
    const [selectedEndPlace, setSelectedEndPlace] = useState('');

    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const fetchSuggestions = debounce(async (text: string, setFunc: any) => {
        if (!text) return setFunc([]);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
        const res = await fetch(url);
        const data = await res.json();
        setFunc(data.features);
    }, 300);

    useEffect(() => fetchSuggestions(startText, setStartSuggestions), [startText]);
    useEffect(() => fetchSuggestions(endText, setEndSuggestions), [endText]);

    const handleSubmit = () => {
        if (startCoords && endCoords) {
            onSelectCoords(toLatLng(startCoords), toLatLng(endCoords));
            Keyboard.dismiss();
        }
    };

    const handleLongPress = async (e: any) => {
        const coords = e?.geometry?.coordinates as Coords;
        if (!coords) return;
        // console.log('Coords selecting:', coord);

        if (useMapForStart && !startCoords) setStartCoords(coords);
        else if (useMapForEnd && !endCoords) setEndCoords(coords);

    };



    const pointGeoJSON = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                id: 'driver-marker',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: startCoords || [74.3587, 31.5204],
                },
            },
        ],
    };


    return (
        <View className="flex-1 p-4 space-y-3 bg-white absolute top-0 w-full h-full">
            <Text className="text-lg font-semibold text-slate-700">From</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-slate-500">Use Map</Text>
                <Switch value={useMapForStart} onValueChange={setUseMapForStart} />
            </View>

            {!useMapForStart ? (
                <>
                    <TextInput
                        className="border px-4 py-2 rounded-lg border-slate-300"
                        placeholder="Start location"
                        value={startText}
                        onChangeText={(text) => {
                            setStartText(text);
                            setStartCoords(null);
                            setSelectedStartPlace('');
                        }}
                    />
                    {startSuggestions.length > 0 && !selectedStartPlace && (
                        <FlatList
                            data={startSuggestions}
                            keyExtractor={(item) => item.id}
                            className="max-h-40 bg-white border rounded-lg"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="px-4 py-2 border-b"
                                    onPress={() => {
                                        const coords = item.center;
                                        setStartCoords(coords);
                                        setStartText(item.place_name);
                                        setSelectedStartPlace(item.place_name);
                                        setStartSuggestions([]);
                                    }}
                                >
                                    <Text>{item.place_name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            ) : (
                <Text className="text-sm text-slate-500">
                    Tap on map to select start point {startCoords ? '✅' : ''}
                </Text>
            )}

            <Text className="text-lg font-semibold text-slate-700">To</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-slate-500">Use Map</Text>
                <Switch value={useMapForEnd} onValueChange={setUseMapForEnd} />
            </View>

            {!useMapForEnd ? (
                <>
                    <TextInput
                        className="border px-4 py-2 rounded-lg border-slate-300"
                        placeholder="End location"
                        value={endText}
                        onChangeText={(text) => {
                            setEndText(text);
                            setEndCoords(null);
                            setSelectedEndPlace('');
                        }}
                    />
                    {endSuggestions.length > 0 && !selectedEndPlace && (
                        <FlatList
                            data={endSuggestions}
                            keyExtractor={(item) => item.id}
                            className="max-h-40 bg-white border rounded-lg"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="px-4 py-2 border-b"
                                    onPress={() => {
                                        const coords = item.center;
                                        setEndCoords(coords);
                                        setEndText(item.place_name);
                                        setSelectedEndPlace(item.place_name);
                                        setEndSuggestions([]);
                                    }}
                                >
                                    <Text>{item.place_name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            ) : (
                <Text className="text-sm text-slate-500">
                    Tap on map to select destination {endCoords ? '✅' : ''}
                </Text>
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <MapboxGL.MapView
                    style={{ flex: 1, marginTop: 10 }}
                    onLongPress={handleLongPress}
                    logoEnabled={false}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                    attributionEnabled={false}
                    compassEnabled={true}
                >
                    <MapboxGL.Camera zoomLevel={12} centerCoordinate={[73.0434129, 33.6522521]} />

                    {/* <MapboxGL.ShapeSource id="driverLocationSource" shape={pointGeoJSON}>
                        <MapboxGL.SymbolLayer
                            id="driverLocationSymbol"
                            style={{
                                iconImage: 'marker-15', // Built-in icon
                                iconSize: 1.5,
                                iconAllowOverlap: true,
                                iconIgnorePlacement: true,
                            }}
                        />
                    </MapboxGL.ShapeSource> */}


                    {startCoords && (
                        <MapboxGL.PointAnnotation id="start" coordinate={startCoords} >
                            <View
                                style={{
                                    height: 20,
                                    width: 20,
                                    backgroundColor: '#A800E8',
                                    borderRadius: 15,
                                    borderColor: '#fff',
                                    borderWidth: 3,
                                }}
                            />
                        </MapboxGL.PointAnnotation>
                    )}
                    {endCoords && (
                        <MapboxGL.PointAnnotation id="end" coordinate={endCoords} >
                            <View
                                style={{
                                    height: 20,
                                    width: 20,
                                    backgroundColor: '#0f0f0f',
                                    borderRadius: 15,
                                    borderColor: '#fff',
                                    borderWidth: 3,
                                }}
                            />
                        </MapboxGL.PointAnnotation>
                    )}
                </MapboxGL.MapView>
            </TouchableWithoutFeedback>


            <TouchableOpacity
                className="bg-blue-500 rounded-xl p-3 mt-2"
                onPress={handleSubmit}
                disabled={!startCoords || !endCoords}
            >
                <Text className="text-white text-center font-semibold"> Search a Route </Text>
            </TouchableOpacity>

        </View>
    );
}
