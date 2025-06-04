// app/TimeScreen.tsx

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TimeScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedLevel === index) {
      setSelectedLevel(null); // 토글
    } else {
      setSelectedLevel(index);
    }
    setShowError(false);
  };

  const handleNext = () => {
    if (selectedLevel !== null) {
      router.push("/JobScreen"); // 다음 화면 경로로 바꿔주세요
    } else {
      setShowError(true);
    }
  };

  const handleBack = () => {
  router.push("/StudyScreen");
};

  return (
    <View style={styles.container}>
      {/* 도트 */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.inactiveDot]} />
      </View>

      {/* 질문 */}
      <Text style={styles.questionText}>학습을 얼마나 하실건가요?</Text>

      {/* 선택지 */}
      <Pressable
        style={[styles.optionBox, { top: 232 }, selectedLevel === 0 && styles.selectedOption]}
        onPress={() => handleSelect(0)}
      >
        <Text style={styles.optionText}>10분 이상</Text>
      </Pressable>
      <Pressable
        style={[styles.optionBox, { top: 306 }, selectedLevel === 1 && styles.selectedOption]}
        onPress={() => handleSelect(1)}
      >
        <Text style={styles.optionText}>20분 이상</Text>
      </Pressable>
      <Pressable
        style={[styles.optionBox, { top: 380 }, selectedLevel === 2 && styles.selectedOption]}
        onPress={() => handleSelect(2)}
      >
        <Text style={styles.optionText}>30분 이상</Text>
      </Pressable>

      {/* 에러 메시지 */}
      {showError && (
        <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}

      {/* 버튼들 */}
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>이전</Text>
      </Pressable>

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 1344,
    height: 2992,
    backgroundColor: "#FFFFFF",
  },
  dotsContainer: {
    position: "absolute",
    top: 62,
    left: 30,
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 72,
    height: 20,
    borderRadius: 10.76,
    backgroundColor: "#0077FF",
  },
  inactiveDot: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  questionText: {
    position: "absolute",
    top: 138,
    left: 80,
    width: 281,
    height: 78,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 25,
    lineHeight: 30,
    color: "#0077FF",
    textAlign: "center",
  },
  optionBox: {
    position: "absolute",
    left: 41,
    width: 361,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.7629,
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#0077FF",
  },
  optionText: {
    position: "absolute",
    top: 7,
    left: 16,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
  },
  errorText: {
    position: "absolute",
    top: 479,
    left: 130,
    width: 274,
    height: 17,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14.4,
    lineHeight: 17,
    color: "#FF0000",
  },
  backButton: {
    position: "absolute",
    top: 511,
    left: 45,
    width: 165,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.7629,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
  },
  nextButton: {
    position: "absolute",
    top: 511,
    left: 237,
    width: 165,
    height: 54,
    backgroundColor: "#0348DB",
    borderRadius: 10.7629,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#FFFFFF",
  },
});
