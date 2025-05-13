import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FriendScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 설문 질문 */}
      <Text style={styles.title}>저희 앱을 어떻게 알게 되셨나요?</Text>

      {/* 설문 선택지 */}
      <TouchableOpacity style={[styles.optionBox, { top: 212 }]}>
        <Text style={[styles.optionText, { top: 5 }]}>블로그/리뷰</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBoxSelected, { top: 279 }]}>
        <Text style={[styles.optionText, { top: 10 }]}>친구 추천</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 346 }]}>
        <Text style={[styles.optionText, { top: 5 }]}>인스타 광고</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 413 }]}>
        <Text style={[styles.optionText, { top: 5 }]}>앱 스토어</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 479 }]}>
        <Text style={[styles.optionText, { top: 5 }]}>유튜브</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 548 }]}>
        <Text style={[styles.optionText, { top: 5 }]}>기타</Text>
      </TouchableOpacity>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/SurveyScreen2')}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1334,
    height: 2992,
    backgroundColor: '#FFFFFF',
  },
  title: {
    position: 'absolute',
    width: 401,
    height: 78,
    left: 19,
    top: 134,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 25,
    lineHeight: 30,
    textAlign: 'center',
    color: '#0077FF',
  },
  optionBox: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 38,
    backgroundColor: '#EEEBEB',
    borderRadius: 10.76,
    paddingLeft: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionBoxSelected: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 38,
    backgroundColor: '#EEEBEB',
    borderRadius: 10.76,
    paddingLeft: 24,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0077FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    position: 'absolute',
    width: 200,
    height: 39,
    left: 24,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 39,
    color: '#000000',
  },
  nextButton: {
    position: 'absolute',
    width: 165,
    height: 54,
    left: 233,
    top: 627,
    backgroundColor: '#0348DB',
    borderRadius: 10.76,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButtonText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FriendScreen;
