import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const YourComponent = () => {
  return (
    <View style={styles.container}>
      {/* CHi UP */}
      <Text style={styles.chiUp}>CHi UP</Text>

      {/* Rectangle 155 */}
      <View style={styles.rectangle}></View>

      {/* 시작하기 */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>

      {/* 내일을 위해, 목표를 위해 */}
      <Text style={styles.motivationText}>내일을 위해, 목표를 위해.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 412,
    height: 917,
    backgroundColor: '#007FFF',
  },
  chiUp: {
    position: 'absolute',
    width: 295,
    height: 78,
    left: 59,
    top: 337,
    fontFamily: 'Inter',  // Make sure to link Inter font in your project
    fontWeight: '900',
    fontSize: 85,
    lineHeight: 103,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  rectangle: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 26,
    top: 447,
    backgroundColor: '#FFFFFF',
    // React Native doesn't support the exact box-shadow property, so you can use elevation for shadow effects
    elevation: 4, // For Android shadow effect
    borderRadius: 10.7629,
  },
  startButton: {
    position: 'absolute',
    width: 228,
    height: 42,
    left: 88,
    top: 453,
    backgroundColor: 'transparent', // Background color can be added if required
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',  // Ensure that the font is loaded properly
    fontWeight: '500',
    fontSize: 21.5258,
    lineHeight: 26,
    color: '#007FFF',
  },
  motivationText: {
    position: 'absolute',
    width: 210,
    height: 23,
    left: 101,
    top: 415,
    fontFamily: 'Inter',  // Ensure the font is available
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default YourComponent;
