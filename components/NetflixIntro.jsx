import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

export default function NetflixIntro({ onFinished, logoText = "N" }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Zoom in and fade out logic
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 12,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onFinished());
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.logo, 
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim
          }
        ]}
      >
        {logoText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    color: '#E50914',
    fontSize: 100,
    fontWeight: '900',
    fontFamily: 'serif',
  },
});