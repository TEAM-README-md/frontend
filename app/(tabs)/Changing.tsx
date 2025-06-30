// 실행되는

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function SpeakScreen() {
  const router = useRouter();

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const options = ["이직 준비 중이다", "이직 생각이 없다"];

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        setJwtToken(token);
        console.log("✅ 불러온 JWT:", token);
      } catch (error) {
        console.error("❌ JWT 로딩 실패:", error);
      }
    };
    loadToken();
  }, []);

  const handleSelect = (index: number) => {
    setSelectedLevel(index === selectedLevel ? null : index);
    setShowError(false);
  };

  const handleNext = async () => {
    if (selectedLevel === null) {
      setShowError(true);
      return;
    }

    if (!jwtToken) {
      Alert.alert("오류", "JWT 토큰이 존재하지 않습니다.");
      return;
    }

    try {
  // ✅ boolean으로 저장 (selectedLevel이 0이면 true, 1이면 false)
  const isChangingJob = selectedLevel === 0;
  await SecureStore.setItemAsync("isChangingJob", JSON.stringify(isChangingJob));
  console.log("✅ isChangingJob 저장됨:", isChangingJob);

  router.push("/Count");
} catch (error) {
      console.error("❌ 답변 저장 실패:", error);
      Alert.alert("저장 오류", "답변 저장 중 문제가 발생했습니다.");
    }
  };

  const handleBack = () => {
    router.push("/Type");
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      <Image source={require("../../assets/images/image 70.png")} style={styles.image} />

      <Text style={styles.questionText}>이직이 고민 중이신가요?</Text>

      {options.map((text, index) => (
        <Pressable
          key={index}
          style={[
            styles.optionBox,
            { top: 365 + index * 74 },
            selectedLevel === index && styles.selectedOption,
          ]}
          onPress={() => handleSelect(index)}
        >
          <Text style={styles.optionText}>{text}</Text>
        </Pressable>
      ))}

      {showError && (
        <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}

      <Pressable
        style={[styles.prevButton, showError && { top: 567 }]}
        onPress={handleBack}
      >
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      <Pressable
        style={[styles.nextButton, showError && { top: 567 }]}
        onPress={handleNext}
      >
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
    left: 74,
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
  image: {
    position: "absolute",
    top: 140,
    left: 150,
    width: 148,
    height: 148,
    resizeMode: "contain",
  },
  questionText: {
    position: "absolute",
    top: 287,
    left: 23,
    width: 401,
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
    left: 43,
    width: 361,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#0077FF",
  },
  optionText: {
    position: "absolute",
    top: 10,
    left: 16,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
  },
  errorText: {
    position: "absolute",
    width: 274,
    height: 17,
    left: 130,
    top: 540,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14.4,
    lineHeight: 17,
    color: "#FF0000",
  },
  prevButton: {
    position: "absolute",
    top: 567,
    left: 43,
    width: 165,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
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
    color: "#333333",
  },
  nextButton: {
    position: "absolute",
    top: 567,
    left: 237,
    width: 165,
    height: 54,
    backgroundColor: "#0348DB",
    borderRadius: 10.76,
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
