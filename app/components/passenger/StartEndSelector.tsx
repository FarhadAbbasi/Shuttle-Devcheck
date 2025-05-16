import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Coords, LatLng } from '@/lib/types';
import { toLatLng } from '@/lib/MapBox';
import { selectionAsync } from 'expo-haptics';

interface Props {
    onSubmit: (start: LatLng, end: LatLng) => void;
}

const StartEndSelector: React.FC<Props> = ({ onSubmit }) => {
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [startCoords, setStartCoords] = useState<Coords | null>(null);
    const [endCoords, setEndCoords] = useState<Coords | null>(null);
    const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
    const [pointer, setPointer] = useState<any>(null);


    // useEffect(() => {
    //     if(!pointer) return
    //     console.log('Running useEffect...');

    //     const coord = pointer;
    //     // console.log('Coords selecting:', coord);
    //     // console.log('selecting:', selecting)
    //     if (!coord) return;


    //     if (selecting === 'start') {
    //         setStartCoords(coord);
    //         setSelecting(null);
    //     } else if (selecting === 'end') {
    //         setEndCoords(coord);
    //         setSelecting(null);
    //     }

    // }, [pointer])


    const handleLongPress = async (e: any) => {
        const coord = e?.geometry?.coordinates as Coords;
        // console.log('Coords selecting:', coord);
        // console.log('selecting:', selecting)
        if (!coord) return;


        if (selecting === 'start') {
            setStartCoords(coord);
            setSelecting(null);
        } else if (selecting === 'end') {
            setEndCoords(coord);
            setSelecting(null);
        }
    };

    return (
        <View className="flex-1 absolute top-20 h-full w-screen">
            {/* <MapboxGL.MapView style={{ flex: 1 }} onLongPress={handleLongPress}> */}
            <MapboxGL.MapView
                style={{ flex: 1 }}
                onLongPress={handleLongPress}
                // onLongPress={(e) => setPointer(e?.geometry?.coordinates)}
                logoEnabled={false}
                attributionEnabled={false}
                compassEnabled={true}
            >
                <MapboxGL.Camera zoomLevel={12} centerCoordinate={[73.0434129, 33.6522521]} />
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
                                backgroundColor: '#A800E8',
                                borderRadius: 15,
                                borderColor: '#fff',
                                borderWidth: 3,
                            }}
                        />
                    </MapboxGL.PointAnnotation>
                )}
            </MapboxGL.MapView>


            <View className="absolute top-0 w-full bg-white rounded-b-xl p-4 space-y-2 shadow-md">
                <TextInput placeholder="Start Location"
                    value={startInput}
                    onChangeText={setStartInput}
                    className="bg-gray-100 rounded px-3 py-2"
                />
                <TextInput placeholder="End Location"
                    value={endInput}
                    onChangeText={setEndInput}
                    className="bg-gray-100 rounded px-3 py-2"
                />

                <View className="flex-row justify-between mt-2">
                    <TouchableOpacity onPress={() => setSelecting('start')} className="bg-blue-500 px-3 py-2 rounded">
                        <Text className="text-white"> { selecting === 'start'? 'Setting on Map 🟡' : 'Set Start on Map' }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelecting('end')} className="bg-blue-500 px-3 py-2 rounded">
                        <Text className="text-white">{ selecting === 'end'? 'Setting on Map 🟡' : 'Set End on Map'}</Text>
                    </TouchableOpacity>
                </View>

                {startCoords && endCoords && (
                    <TouchableOpacity
                        onPress={() => onSubmit(toLatLng(startCoords), toLatLng(endCoords))}
                        className="bg-green-600 mt-3 py-2 rounded"
                    >
                        <Text className="text-white text-center font-semibold">Search Routes</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default StartEndSelector;
