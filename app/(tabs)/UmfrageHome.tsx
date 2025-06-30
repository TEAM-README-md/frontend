import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UmfrageHome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <Image
        // source={require('../assets/logo.png')} // logo.png로 교체됨
        style={styles.image}
        resizeMode="contain"
      />

      {/* "oo님 반가워요!" 텍스트 */}
      <Text style={styles.greeting}>oo님 반가워요!</Text>

      {/* 설명 텍스트 */}
      <Text style={styles.description} numberOfLines={2}>
  저희가 간단한 설문을 준비했어요.응답해 주시겠어요?    여러분들의 설문은 앱이 성장하는 데 큰 도움을 주신답니다.
</Text>

      {/* 설문 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Company')}
      >
        <Text style={styles.buttonText}>설문하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UmfrageHome;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1344,
    height: 2992,
    backgroundColor: '#0077FF',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 155,
    height: 155,
    top: 304,
    left: 123,
  },
  greeting: {
    position: 'absolute',
    width: 260,
    height: 78,
    top: 433,
    left: 94,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  description: {
    position: 'absolute',
    width: 336,
    height: 78,
    top: 483,
    left: 54,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  button: {
    position: 'absolute',
    top: 561,
    left: 42,
    width: 361,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.7629,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.5258,
    lineHeight: 26,
    color: '#000000',
    textAlign: 'center',
  },
});
