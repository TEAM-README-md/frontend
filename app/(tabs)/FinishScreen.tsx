// FinishScreen.tsx

import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FinishScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <Image
        source={require('../../assets/images/image_60.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 설명 텍스트 */}
      <Text style={styles.description}>
        설문이 완료 되었어요. 여러분이 대답해주신 질문들을 기반으로 맞춤형 서비스를 제공할거에요.
      </Text>

      {/* 이전 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/JobScreen')}>
        <Text style={styles.backText}>이전</Text>
      </TouchableOpacity>

      {/* 시작하기 버튼 */}
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/Home')}>
        <Text style={styles.startText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1334,
    height: 2992,
    backgroundColor: '#4BD37B',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 146,
    height: 146,
    top: 293,
    left: 150,
  },
  description: {
    position: 'absolute',
    width: 379,
    height: 58,
    top: 439,
    left: 35,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 17,
    lineHeight: 21,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 511,
    left: 45,
    width: 165,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.7629,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    top: 511,
    left: 237,
    width: 165,
    height: 54,
    backgroundColor: '#4CAF50',
    borderRadius: 10.7629,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
