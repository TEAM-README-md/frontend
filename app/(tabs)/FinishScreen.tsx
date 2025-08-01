import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FinishScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <Image
        source={require('../../assets/images/image 68.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 설명 텍스트 */}
      <Text style={styles.description}>
        설문이 완료 되었어요. 여러분이 대답해주신 질문들을 기반으로 맞춤형 서비스를 제공할거에요.
      </Text>

      {/* 이전 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Submission')}>
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#4BD37B',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.25, // 예: 약 100~150px
    height: SCREEN_WIDTH * 0.25,
    top: SCREEN_HEIGHT * 0.25,
    left: SCREEN_WIDTH * 0.37,
  },
  description: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.1,
    top: SCREEN_HEIGHT * 0.41,
    left: SCREEN_WIDTH * 0.07,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: SCREEN_WIDTH * 0.042, // 약 16~18
    lineHeight: SCREEN_WIDTH * 0.055,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.5,
    left: SCREEN_WIDTH * 0.08,
    width: SCREEN_WIDTH * 0.38,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    fontSize: SCREEN_WIDTH * 0.05,
    lineHeight: SCREEN_WIDTH * 0.06,
    color: '#000000',
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.5,
    left: SCREEN_WIDTH * 0.54,
    width: SCREEN_WIDTH * 0.38,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
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
    fontSize: SCREEN_WIDTH * 0.05,
    lineHeight: SCREEN_WIDTH * 0.06,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
