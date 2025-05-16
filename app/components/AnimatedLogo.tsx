// import React, { useEffect, useRef } from 'react';
// import { Animated, View, Image, StyleSheet } from 'react-native';

// export default function AnimatedLogo() {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const opacityAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 4000,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });



//   useEffect(() => {
//     Animated.loop(
//       Animated.parallel([
//         Animated.sequence([
//           Animated.timing(scaleAnim, {
//             toValue: 1.05,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ]),
//         Animated.sequence([
//           Animated.timing(opacityAnim, {
//             toValue: 0.9,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacityAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ]),
//       ])
//     ).start();
//   }, []);

//   return (

//     <View>
//       {/* <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
//         <Image source={require('../../assets/images/shuttle_logo_1b.png')} style={{ width: 200, height: 80 }} />
//       </Animated.View> */}

//       <Animated.View style={[styles.logoWrap, {
//         transform: [{ scale: scaleAnim }],
//         opacity: opacityAnim,
//       }]}>
//         <Image
//           source={require('../../assets/images/shuttle_logo_1b.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   logoWrap: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//   },
//   logo: {
//     width: 240,
//     height: 84,
//     borderRadius: 12,
//   },
// });



import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const AnimatedLogo = ({ children }: { children: React.ReactNode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View className="flex items-center justify-center"
      style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      {children}
    </Animated.View>
  );
};

export default AnimatedLogo;
