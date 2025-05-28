// import React, { useRef, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
// import { Link } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// const WelcomeScreen = () => {
//   const shineAnim = useRef(new Animated.Value(-200)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(shineAnim, {
//           toValue: width,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(shineAnim, {
//           toValue: -200,
//           duration: 0,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);


//   return (
//     <View className='bg-slate-200 flex h-screen flex-1 items-center justify-center'>
// {/* <View style={{ flex: 1, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' }}> */}
//       <View style={{ position: 'relative' }}>
//         <Image
//           source={require('../../assets/images/shuttle_logo_1b.png')}
//           style={{ height: 96, width: 240, borderRadius: 12 }}
//         />

//         <Animated.View
//           style={{
//             position: 'absolute',
//             top: 0,
//             bottom: 0,
//             width: 60,
//             transform: [{ translateX: shineAnim }],
//             overflow: 'hidden',
//             borderRadius: 12,
//           }}
//         >
//           {/* <LinearGradient
//             colors={['#4c669f', '#3b5998', '#192f6a']}
//             style={{ width: 200, height: 100, borderRadius: 12 }}
//           />
//  */}
//           {/* <LinearGradient
//             colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
//             start={{ x: 0, y: 0.5 }}
//             end={{ x: 1, y: 0.5 }}
//             style={{ flex: 1 }}
//           /> */}
//         </Animated.View>
//       </View>

//       <Link href="/auth/Login" asChild>
//         <TouchableOpacity style={{ marginTop: 30, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#3b82f6', borderRadius: 10 }}>
//           <Text style={{ color: 'white', fontWeight: '600' }}>Go to Dashboard</Text>
//         </TouchableOpacity>
//       </Link>
//     </View>
//   );
// };

// export default WelcomeScreen;













import React, { useRef, useEffect } from 'react';
import { Image, StyleSheet, Dimensions, View, Text, TouchableOpacity, Animated } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoginScreen from '../auth/Login';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedLogo from '../components/AnimatedLogo';
import UpdateCheck from './UpdateCheck';

const { width } = Dimensions.get('window');


export default function HomeScreen() {

  return (
    <View className='bg-slate-200 flex h-screen flex-1 items-center justify-center'>
      {/* <View style={{ flex: 1, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' }}>  */}

      <AnimatedLogo>
        {/* <Image source={require('../../assets/images/shuttle_logo_1b.png')} className='w-60 h-24 rounded-lg' /> */}
        <Image source={require('../../assets/images/shuttle_logo_2_png.png')} className='w-60 h-40 rounded-lg' />
      </AnimatedLogo>

      <Link href="/auth/Login" asChild>
        <TouchableOpacity className="mt-4 px-4 py-2 bg-blue-500 rounded">
          <Text className="text-white">Go to the Dashboard</Text>
        </TouchableOpacity>
      </Link>

      <UpdateCheck/>

    </View>
  );



  
  // return (
  //   <ParallaxScrollView
  //     headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  //     headerImage={
  //       <Image
  //         source={require('@/assets/images/partial-react-logo.png')}
  //         style={styles.reactLogo}
  //       />
  //     }>
  //     <ThemedView style={styles.titleContainer}>
  //       <ThemedText type="title">Welcome!</ThemedText>
  //       <HelloWave />
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <ThemedText type="subtitle">Step 1: Try it</ThemedText>
  //       <ThemedText>
  //         Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
  //         Press{' '}
  //         <ThemedText type="defaultSemiBold">
  //           {Platform.select({
  //             ios: 'cmd + d',
  //             android: 'cmd + m',
  //             web: 'F12'
  //           })}
  //         </ThemedText>{' '}
  //         to open developer tools.
  //       </ThemedText>
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <ThemedText type="subtitle">Step 2: Explore</ThemedText>
  //       <ThemedText>
  //         Tap the Explore tab to learn more about what's included in this starter app.
  //       </ThemedText>
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
  //       <ThemedText>
  //         When you're ready, run{' '}
  //         <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
  //         <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
  //         <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
  //         <ThemedText type="defaultSemiBold">app-example</ThemedText>.
  //       </ThemedText>
  //     </ThemedView>
  //   </ParallaxScrollView>
  // );

}
