import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDriverRouteStore } from '@/store/useDriverStore';

const RestartRouteButton = () => {

const { resetRoute } = useDriverRouteStore();


return (
    <View className="flex-1 justify-center items-center px-4 bg-slate-50">
        <View className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <Text className="text-xl font-semibold text-slate-800 mb-2">
                Route Completed 💛
            </Text>
            <Text className="text-slate-500 text-base mb-4">
                Great job finishing the shift. Take a break or restart when ready.
            </Text>

            <TouchableOpacity
                onPress={resetRoute}
                className="bg-sky-600 px-4 py-3 rounded-xl"
            >
                <Text className="text-white font-semibold text-center text-lg">
                    Restart Route
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);
}

export default RestartRouteButton


