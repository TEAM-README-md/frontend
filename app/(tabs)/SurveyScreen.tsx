import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SpeakScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedLevel === index) {
      setSelectedLevel(null); // 이미 선택된 옵션을 다시 누르면 선택 해제
    } else {
      setSelectedLevel(index);
    }
    setShowError(false);
  };

  const handleNext = () => {
    if (selectedLevel !== null) {
      router.push("/SpeakScreen");
    } else {
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 도트 진행 표시 */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* 질문 텍스트 */}
      <Text style={styles.questionText}>면접 경험이 얼마나 되시나요?</Text>

      {/* 선택지 */}
      <Pressable
        style={[styles.optionBox, selectedLevel === 0 && styles.selectedOption]}
        onPress={() => handleSelect(0)}
      >
        <Text style={styles.optionText}>1~2번</Text>
      </Pressable>
      <Pressable
        style={[styles.optionBox, { top: 289 }, selectedLevel === 1 && styles.selectedOption]}
        onPress={() => handleSelect(1)}
      >
        <Text style={styles.optionText}>3~4번</Text>
      </Pressable>
      <Pressable
        style={[styles.optionBox, { top: 363 }, selectedLevel === 2 && styles.selectedOption]}
        onPress={() => handleSelect(2)}
      >
        <Text style={styles.optionText}>5번 이상</Text>
      </Pressable>
      <Pressable
        style={[styles.optionBox, { top: 437, left: 43 }, selectedLevel === 3 && styles.selectedOption]}
        onPress={() => handleSelect(3)}
      >
        <Text style={styles.optionText}>이번이 처음이에요</Text>
      </Pressable>

      {/* 에러 메시지 */}
      {showError && (
        <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}

      {/* 다음 버튼 */}
      <Pressable
        style={[styles.nextButton, showError && { top: 604 - 75 }]}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1344,
    height: 2992,
    backgroundColor: '#FFFFFF',
  },
  dotsContainer: {
    position: 'absolute',
    top: 62,
    left: 32,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 72,
    height: 20,
    borderRadius: 10.7629,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  activeDot: {
    backgroundColor: '#0077FF',
  },
  questionText: {
    position: 'absolute',
    top: 137,
    left: 23,
    width: 401,
    height: 78,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 25,
    lineHeight: 30,
    color: '#0077FF',
    textAlign: 'center',
  },
  optionBox: {
    position: 'absolute',
    top: 215,
    left: 43,
    width: 361,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10.7629,
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: '#0077FF',
  },
  optionText: {
    position: 'absolute',
    top: 7,
    left: 16,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  errorText: {
  position: 'absolute',
  width: 274,
  height: 17,
  left: 130,
  top: 504,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: 14.4,
  lineHeight: 17,
  color: '#FF0000',
},
  nextButton: {
    position: 'absolute',
    top: 511,
    left: 237,
    width: 165,
    height: 54,
    backgroundColor: '#0348DB',
    borderRadius: 10.7629,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
