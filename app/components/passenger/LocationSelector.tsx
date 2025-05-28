import React, { useEffect, useState, useRef } from 'react';
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
    const mapRef = useRef<MapboxGL.MapView>(null);
    const [useMapForStart, setUseMapForStart] = useState(false);
    const [useMapForEnd, setUseMapForEnd] = useState(false);
    const [mapSelectionMode, setMapSelectionMode] = useState<'none' | 'start' | 'end'>('none');

    const [startText, setStartText] = useState('');
    const [endText, setEndText] = useState('');

    const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
    const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([]);

    const [startCoords, setStartCoords] = useState<Coords | null>(null);
    const [endCoords, setEndCoords] = useState<Coords | null>(null);

    const [selectedStartPlace, setSelectedStartPlace] = useState('');
    const [selectedEndPlace, setSelectedEndPlace] = useState('');

    const [mapKey, setMapKey] = useState(0); // State to control MapboxGL key
    const [activeMap, setActiveMap] = useState<'map1' | 'map2'>('map1'); // State to control active map

    // Reset map selection mode when switching between start/end
    useEffect(() => {
        if (useMapForStart) {
            setMapSelectionMode('start');
            setUseMapForEnd(false);
            console.log('Using map for start location selection');
        } else if (useMapForEnd) {
            setMapSelectionMode('end');
            setUseMapForStart(false);
            console.log('Using map for end location selection');
        } else {
            setMapSelectionMode('none');
        }
    }, [useMapForStart, useMapForEnd]);

    // Cleanup map selection mode when component unmounts
    useEffect(() => {
        return () => {
            setMapSelectionMode('none');
            setUseMapForStart(false);
            setUseMapForEnd(false);
        };
    }, []);

    const fetchSuggestions = debounce(async (text: string, setFunc: (suggestions: Suggestion[]) => void) => {
        if (!text) {
            setFunc([]);
            return;
        }
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
            const res = await fetch(url);
            const data = await res.json();
            setFunc(data.features || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setFunc([]);
        }
    }, 300);

    useEffect(() => {
        if (startText) {
            fetchSuggestions(startText, setStartSuggestions);
        }
    }, [startText]);

    useEffect(() => {
        if (endText) {
            fetchSuggestions(endText, setEndSuggestions);
        }
    }, [endText]);

    const handleLongPress = async (e: any) => {
        const coords = e?.geometry?.coordinates as Coords;
        if (!coords || mapSelectionMode === 'none') return;
        console.log('Long pressed for :', coords);
        console.log('Current mapSelectionMode:', mapSelectionMode);

        if (mapSelectionMode === 'start') {
            setStartCoords(coords);
            setStartText('Selected on map');
            setSelectedStartPlace('Selected on map');
            setUseMapForStart(false); // Reset after selection
            setMapSelectionMode('none'); // Reset map selection mode
            console.log('Start location selected:', coords);
            setActiveMap((prev) => (prev === 'map1' ? 'map2' : 'map1')); // Toggle map
        } else if (mapSelectionMode === 'end') {
            setEndCoords(coords);
            setEndText('Selected on map');
            setSelectedEndPlace('Selected on map');
            setUseMapForEnd(false); // Reset after selection
            setMapSelectionMode('none'); // Reset map selection mode
            console.log('End location selected:', coords);
            setActiveMap((prev) => (prev === 'map1' ? 'map2' : 'map1')); // Toggle map
        }
    };

    useEffect(() => {
        console.log('useMapForStart:', useMapForStart, 'useMapForEnd:', useMapForEnd, 'mapSelectionMode:', mapSelectionMode);
    }, [useMapForStart, useMapForEnd, mapSelectionMode]);

    const handleSubmit = () => {
        if (startCoords && endCoords) {
            onSelectCoords(toLatLng(startCoords), toLatLng(endCoords));
            Keyboard.dismiss();
        }
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
                <View className='flex'>
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
                                    <Text className="text-slate-600">{String(item.place_name ?? '')}</Text>
                                    {/* <Text className="text-slate-600">{item.place_name}</Text> */}
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            ) : (
                <View className="flex-row items-center">
                    <Text className="text-sm text-slate-500">Tap on map to select start point</Text>
                    {startCoords && <Text className="ml-2">✅</Text>}
                </View>
            )}

            <Text className="text-lg font-semibold text-slate-700">To</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-slate-500">Use Map</Text>
                <Switch value={useMapForEnd} onValueChange={setUseMapForEnd} />
            </View>

            {!useMapForEnd ? (
                <View className='flex'>
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
                                    <Text className="text-slate-600">{String(item.place_name ?? '')}</Text>
                                    {/* <Text className="text-slate-600">{item.place_name}</Text> */}
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            ) : (
                <View className="flex-row items-center">
                    <Text className="text-sm text-slate-500">Tap on map to select destination</Text>
                    {endCoords && <Text className="ml-2">✅</Text>}
                </View>
            )}

            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                {activeMap === 'map1' && (
                    <MapboxGL.MapView
                        key={mapKey}
                        ref={mapRef}
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
                        <MapboxGL.Camera
                            zoomLevel={12}
                            centerCoordinate={[73.0434129, 33.6522521]}
                            animationMode="flyTo"
                            animationDuration={1000}
                        />

                        {startCoords && (
                            <MapboxGL.PointAnnotation
                                id="start"
                                coordinate={startCoords}
                                onSelected={() => {
                                    if (mapSelectionMode === 'none') {
                                        setUseMapForStart(true);
                                    }
                                }}
                            >
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
                            <MapboxGL.PointAnnotation
                                id="end"
                                coordinate={endCoords}
                                onSelected={() => {
                                    if (mapSelectionMode === 'none') {
                                        setUseMapForEnd(true);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: '#0f00ff',
                                        borderRadius: 15,
                                        borderColor: '#fff',
                                        borderWidth: 3,
                                    }}
                                />
                            </MapboxGL.PointAnnotation>
                        )}
                    </MapboxGL.MapView>
                )}

                {activeMap === 'map2' && (
                    <MapboxGL.MapView
                        ref={mapRef}
                        style={{ flex: 1, marginTop: 30 }}
                        onLongPress={handleLongPress}
                        logoEnabled={false}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        rotateEnabled={true}
                        attributionEnabled={false}
                        compassEnabled={true}
                    >
                        <MapboxGL.Camera
                            zoomLevel={12}
                            centerCoordinate={[73.0434129, 33.6522521]}
                            animationMode="flyTo"
                            animationDuration={1000}
                        />

                        {startCoords && (
                            <MapboxGL.PointAnnotation
                                id="start"
                                coordinate={startCoords}
                                onSelected={() => {
                                    if (mapSelectionMode === 'none') {
                                        setUseMapForStart(true);
                                    }
                                }}
                            >
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
                            <MapboxGL.PointAnnotation
                                id="end"
                                coordinate={endCoords}
                                onSelected={() => {
                                    if (mapSelectionMode === 'none') {
                                        setUseMapForEnd(true);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: '#0f00ff',
                                        borderRadius: 15,
                                        borderColor: '#fff',
                                        borderWidth: 3,
                                    }}
                                />
                            </MapboxGL.PointAnnotation>
                        )}
                    </MapboxGL.MapView>
                )}
            {/* </TouchableWithoutFeedback> */}

            {startCoords && endCoords && (
                <TouchableOpacity
                    // onPress={() => onSelectCoords(toLatLng(startCoords), toLatLng(endCoords))}
                    onPress={handleSubmit}
                    className="bg-green-500 p-3 absolute rounded-lg mt-"
                >
                    <Text className="text-white text-center font-semibold">Search Routes</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
