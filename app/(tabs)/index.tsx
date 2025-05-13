import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const YourComponent = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* CHi UP */}
      <Text style={styles.chiUp}>CHi UP</Text>

      {/* 내일을 위해, 목표를 위해 */}
      <Text style={styles.motivationText}>내일을 위해, 목표를 위해.</Text>

      {/* 시작하기 버튼 전체 터치 영역 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/SecondScreen')} // 여기를 고쳤습니다!
      >
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1344,
    height: 2992,
    backgroundColor: '#007FFF',
  },
  chiUp: {
    position: 'absolute',
    width: 295,
    height: 90,
    left: 70,
    top: 337,
    fontFamily: '',
    fontWeight: '900',
    fontSize: 85,
    lineHeight: 103,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  startButton: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 40,
    top: 447,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.52,
    lineHeight: 26,
    color: '#007FFF',
  },
  motivationText: {
    position: 'absolute',
    width: 300,
    height: 23,
    left: 70,
    top: 415,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default YourComponent;
