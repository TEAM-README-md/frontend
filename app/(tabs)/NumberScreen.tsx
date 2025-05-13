import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SurveyScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 설문 질문 */}
      <Text style={styles.title}>면접 경험이 얼마나 되시나요?</Text>

      {/* 선택지 */}
      <TouchableOpacity style={[styles.optionBox, { top: 215 }]}>
        <Text style={styles.optionText}>1~2번</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionBox, styles.optionBoxSelected, { top: 289 }]}
        onPress={() => router.push('/NumberScreen')}
      >
        <Text style={[styles.optionText, styles.optionTextSelected]}>
          3~4번
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 362 }]}>
        <Text style={styles.optionText}>5번 이상</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { top: 437 }]}>
        <Text style={styles.optionText}>이번이 처음이에요</Text>
      </TouchableOpacity>

      {/* 이전 버튼 */}
      <TouchableOpacity
        style={styles.prevButton}
        onPress={() => router.push('/FriendScreen')}
      >
        <Text style={styles.prevButtonText}>이전</Text>
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

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1344,
    height: 2992,
    backgroundColor: '#FFFFFF',
  },
  title: {
    position: 'absolute',
    width: 401,
    height: 78,
    left: 19,
    top: 137,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 25,
    lineHeight: 30,
    display: 'flex',
    alignItems: 'center',
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
    justifyContent: 'center',
    ...shadowStyle,
  },
  optionBoxSelected: {
    borderColor: '#0077FF',
    borderWidth: 2,
  },
  optionText: {
    marginLeft: 16,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  optionTextSelected: {
    color: '#000000', // 명시적으로 유지
  },
  prevButton: {
    position: 'absolute',
    width: 165,
    height: 54,
    left: 39,
    top: 511,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    ...shadowStyle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButtonText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
  },
  nextButton: {
    position: 'absolute',
    width: 165,
    height: 54,
    left: 233,
    top: 511,
    backgroundColor: '#0348DB',
    borderRadius: 10.76,
    ...shadowStyle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default SurveyScreen;
