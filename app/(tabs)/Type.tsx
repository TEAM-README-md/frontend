import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SpeakScreen() {
  const router = useRouter();

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const options = ["신입", "경력", "인턴"];

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        if (token) {
          setJwtToken(token);
          console.log("✅ 불러온 JWT:", token);
        } else {
          console.warn("❌ JWT 토큰 없음");
        }
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
      Alert.alert("인증 오류", "JWT 토큰이 존재하지 않습니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

    try {
      const selectedAnswer = options[selectedLevel];
      await SecureStore.setItemAsync("userType", selectedAnswer);
      console.log("✅ userType 저장됨:", selectedAnswer);
      router.push("/Changing");
    } catch (error) {
      console.error("❌ 답변 저장 실패:", error);
      Alert.alert("저장 오류", "답변을 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleBack = () => {
    router.push("/Company");
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <Image source={require("../../assets/images/image 50.png")} style={styles.image} />

      <Text style={styles.questionText}>사용자님은 어떤 유형이신가요?</Text>

      {options.map((text, index) => (
        <Pressable
          key={index}
          style={[
            styles.optionBox,
            { top: height * (0.38 + index * 0.085) },
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
        style={[styles.prevButton, showError && { top: height * 0.66 }]}
        onPress={handleBack}
      >
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      <Pressable
        style={[styles.nextButton, showError && { top: height * 0.66 }]}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  dotsContainer: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.125,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: width * 0.18,
    height: height * 0.015,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  image: {
    position: "absolute",
    top: height * 0.13,
    left: width * 0.28,
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  questionText: {
    position: "absolute",
    top: height * 0.28,
    left: width * 0.05,
    width: width * 0.9,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: width * 0.06,
    lineHeight: 30,
    color: "#0077FF",
    textAlign: "center",
  },
  optionBox: {
    position: "absolute",
    left: width * 0.1,
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#0077FF",
  },
  optionText: {
    marginLeft: width * 0.04,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: width * 0.05,
    lineHeight: 24,
    color: "#000000",
  },
  errorText: {
    position: "absolute",
    top: height * 0.62,
    left: width * 0.2,
    width: width * 0.6,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: width * 0.031,
    color: "#FF0000",
    textAlign: "center",
  },
  prevButton: {
    position: "absolute",
    top: height * 0.66,
    left: width * 0.1,
    width: width * 0.38,
    height: height * 0.06,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
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
    fontSize: width * 0.05,
    color: "#333333",
  },
  nextButton: {
    position: "absolute",
    top: height * 0.66,
    left: width * 0.52,
    width: width * 0.38,
    height: height * 0.06,
    backgroundColor: "#0348DB",
    borderRadius: 10,
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
    fontSize: width * 0.05,
    color: "#FFFFFF",
  },
});
