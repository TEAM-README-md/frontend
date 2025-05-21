import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SpeakScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const tickPositions = [83, 110, 137, 164, 191, 250, 278, 305, 332, 359];
  const indicatorX = useRef(new Animated.Value(tickPositions[selectedLevel])).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx + tickPositions[selectedLevel];

        // 트랙 범위 제한
        const minX = tickPositions[0];
        const maxX = tickPositions[tickPositions.length - 1];
        newX = Math.max(minX, Math.min(newX, maxX));

        indicatorX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dragX = gestureState.dx + tickPositions[selectedLevel];

        const minX = tickPositions[0];
        const maxX = tickPositions[tickPositions.length - 1];
        const clampedX = Math.max(minX, Math.min(dragX, maxX));

        const closest = tickPositions.reduce((prev, curr) =>
          Math.abs(curr - clampedX) < Math.abs(prev - clampedX) ? curr : prev
        );
        const newIndex = tickPositions.indexOf(closest);
        setSelectedLevel(newIndex);

        Animated.spring(indicatorX, {
          toValue: closest,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleNext = () => {
  if (selectedLevel !== null) {
    router.push("/StudyScreen"); // 다음 화면으로 이동
  }
};

  const handlePrev = () => {
    router.push("/SurveyScreen"); // 이전 화면
  };

  return (
    <View style={styles.container}>
      {/* 상단 도트 */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* 질문 */}
      <Text style={styles.questionText}>언어 능력이 어느 정도이신가요?</Text>

      {/* 선택지 */}
      <Pressable
        style={[
          styles.optionBox,
          selectedLevel === 0 && styles.selectedOption,
        ]}
        onPress={() => {
          setSelectedLevel(0);
          Animated.spring(indicatorX, {
            toValue: tickPositions[0],
            useNativeDriver: false,
          }).start();
        }}
      >
        <Text style={styles.optionText}>👀 평균 미만이에요</Text>
      </Pressable>

      {/* 눈금 선 및 눈금 표시 */}
      <View style={styles.progressLine} />
      <View style={styles.progressTickLeft} />
      <View style={styles.progressTickMiddle} />
      <View style={styles.progressTickRight} />
      {tickPositions.map((left, idx) => (
        <View key={idx} style={[styles.smallTick, { left }]} />
      ))}

      {/* 파란 원 핸들 */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.indicatorCircle,
          {
            transform: [{ translateX: Animated.subtract(indicatorX, 47) }],
          },
        ]}
      />

      {/* 슬라이더 라벨 */}
      <Text style={[styles.label, { left: 53.5 }]}>0</Text>
      <Text style={[styles.label, { left: 213 }]}>50</Text>
      <Text style={[styles.label, { left: 372 }]}>100</Text>

      {/* 이전/다음 버튼 */}
      <Pressable style={styles.prevButton} onPress={handlePrev}>
        <Text style={styles.prevText}>이전</Text>
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
    left: 32,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 72,
    height: 20,
    borderRadius: 10.76,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  questionText: {
    position: "absolute",
    top: 137,
    left: 23,
    width: 401,
    height: 78,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 25,
    lineHeight: 30,
    textAlign: "center",
    color: "#0077FF",
  },
  optionBox: {
    position: "absolute",
    top: 281,
    left: 50,
    width: 149,
    height: 67,
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(0, 0, 0, 0.28)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  selectedOption: {
    borderColor: "#0077FF",
    borderWidth: 2,
  },
  optionText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 14.8,
    lineHeight: 18,
    color: "#000000",
  },
  prevButton: {
    position: "absolute",
    top: 511,
    left: 45,
    width: 165,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  prevText: {
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
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nextText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#FFFFFF",
  },
  progressLine: {
    position: "absolute",
    top: 378,
    left: 55,
    width: 332,
    height: 0,
    borderWidth: 4,
    borderColor: "#000000",
    borderRadius: 10,
  },
  progressTickLeft: {
    position: "absolute",
    top: 360,
    left: 55,
    width: 0,
    height: 44,
    borderWidth: 4,
    borderColor: "#000000",
    borderRadius: 10,
  },
  progressTickMiddle: {
    position: "absolute",
    top: 360,
    left: 221,
    width: 0,
    height: 44,
    borderWidth: 4,
    borderColor: "#000000",
    borderRadius: 10,
  },
  progressTickRight: {
    position: "absolute",
    top: 360,
    left: 385,
    width: 0,
    height: 44,
    borderWidth: 4,
    borderColor: "#000000",
    borderRadius: 10,
  },
  smallTick: {
    position: "absolute",
    top: 373,
    width: 0,
    height: 18,
    borderWidth: 2,
    borderColor: "#000000",
  },
  indicatorCircle: {
    position: "absolute",
    top: 370,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0077FF",
  },
  label: {
    position: "absolute",
    top: 405,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
  },
});
