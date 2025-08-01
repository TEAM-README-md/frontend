import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const options = {
  headerShown: false,
};

// 디바이스 화면 크기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const YourComponent = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* CHi UP 이미지 */}
      <Image
        source={require('../../assets/images/CHi UP.png')}
        style={styles.chiUpImage}
        resizeMode="contain"
      />

      {/* 내일을 위해, 목표를 위해 */}
      <Text style={styles.motivationText}>내일을 위해, 목표를 위해.</Text>

      {/* 시작하기 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/LoginScreen')}
      >
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#007FFF',
  },
  chiUpImage: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.7,      // 예: 전체 너비의 70%
    height: SCREEN_HEIGHT * 0.1,    // 예: 전체 높이의 10%
    left: SCREEN_WIDTH * 0.15,      // 중앙 정렬을 위한 left
    top: SCREEN_HEIGHT * 0.3,
  },
  motivationText: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.03,
    left: SCREEN_WIDTH * 0.1,
    top: SCREEN_HEIGHT * 0.43,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: SCREEN_WIDTH * 0.05,
    lineHeight: SCREEN_HEIGHT * 0.03,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  startButton: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.06,
    left: SCREEN_WIDTH * 0.1,
    top: SCREEN_HEIGHT * 0.48,
    backgroundColor: '#FFFFFF',
    borderRadius: SCREEN_WIDTH * 0.025,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: SCREEN_WIDTH * 0.055,
    lineHeight: SCREEN_HEIGHT * 0.03,
    color: '#007FFF',
  },
});

export default YourComponent;
