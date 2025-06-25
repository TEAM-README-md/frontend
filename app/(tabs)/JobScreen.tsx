import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function JobScreen() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  const handleSelect = (index: number) => {
    setSelectedJob(prev => (prev === index ? null : index));
    setShowError(false);
  };

  const handleNext = () => {
    if (selectedJob !== null) {
      router.push("/FinishScreen");
    } else {
      setShowError(true);
    }
  };

  const handleBack = () => {
  router.push("/TimeScreen");
};

  return (
    <View style={styles.container}>
      {/* 도트 */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.dot} />
        ))}
      </View>

      {/* 질문 */}
      <Text style={styles.questionText}>어떤 직군이신가요?</Text>

      {/* 선택지 그룹 */}
      <View style={styles.optionsGroup}>
        {["프론트", "백엔드", "인공지능", "사고력", "기타"].map((label, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionBox,
              selectedJob === index && styles.selectedOption,
            ]}
            onPress={() => handleSelect(index)}
          >
            <Text style={styles.optionText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {showError && (
        <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}

      {/* 버튼 */}
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
    left: 32,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 72,
    height: 20,
    borderRadius: 10.76,
    backgroundColor: "#0077FF",
  },
  questionText: {
    position: "absolute",
    top: 138,
    left: 85,
    width: 281,
    height: 78,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 25,
    lineHeight: 30,
    textAlign: "center",
    color: "#0077FF",
  },
  optionsGroup: {
    position: "absolute",
    top: 216,
    left: 41,
    width: 364,
    flexWrap: "wrap",
    flexDirection: "row",
    rowGap: 15,
    columnGap: 6,
  },
  optionBox: {
    width: 175,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.7629,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#0077FF",
  },
  optionText: {
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
