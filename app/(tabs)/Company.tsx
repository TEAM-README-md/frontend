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

  const options = ["대기업", "중견기업", "스타트업", "공공기관"];

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        setJwtToken(token);
        console.log("✅ 불러온 JWT 토큰:", token);
      } catch (error) {
        console.error("❌ JWT 토큰 로딩 실패:", error);
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
      Alert.alert("오류", "JWT 토큰이 존재하지 않습니다. 로그인 후 이용해주세요.");
      return;
    }

    try {
      const selectedAnswer = options[selectedLevel];
      await SecureStore.setItemAsync("companyType", selectedAnswer);
      console.log("✅ companyType 저장됨:", selectedAnswer);
      router.push("/Type");
    } catch (error) {
      console.error("❌ 답변 저장 실패:", error);
      Alert.alert("저장 오류", "답변을 저장하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <Image source={require("../../assets/images/image 76.png")} style={styles.image} />

      <Text style={styles.questionText}>
        면접을 보고 싶은 회사의 유형은 무엇인가요?
      </Text>

      {options.map((text, index) => (
        <Pressable
          key={index}
          style={[styles.optionBox, {
            top: height * 0.44 + index * height * 0.09,
            borderColor: selectedLevel === index ? "#0077FF" : "rgba(0, 0, 0, 0.1)"
          }]}
          onPress={() => handleSelect(index)}
        >
          <Text style={styles.optionText}>{text}</Text>
        </Pressable>
      ))}

      {showError && (
        <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}

      <Pressable
        style={[styles.nextButton, showError && { top: height * 0.82 }]}
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
    paddingHorizontal: width * 0.15,
  },
  dotsContainer: {
    marginTop: height * 0.06,
    flexDirection: "row",
    gap: width * 0.02,
    justifyContent: "flex-start",
  },
  dot: {
    width: width * 0.16,
    height: height * 0.015,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  image: {
    width: width * 0.35,
    height: width * 0.35,
    alignSelf: "center",
    marginTop: height * 0.05,
    resizeMode: "contain",
  },
  questionText: {
    marginTop: height * 0.04,
    fontSize: width * 0.05,
    fontWeight: "900",
    color: "#0077FF",
    textAlign: "center",
  },
  optionBox: {
    position: "absolute",
    left: width * 0.1,
    width: width * 0.8,
    height: height * 0.06,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderRadius: 10,
    justifyContent: "center",
  },
  optionText: {
    marginLeft: width * 0.04,
    fontSize: width * 0.045,
    fontWeight: "900",
    color: "#000000",
  },
  errorText: {
    position: "absolute",
    top: height * 0.78,
    left: width * 0.2,
    fontSize: width * 0.035,
    color: "#FF0000",
  },
  nextButton: {
    position: "absolute",
    top: height * 0.79,
    left: width * 0.5 - (width * 0.4) / 2,
    width: width * 0.4,
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
    fontSize: width * 0.045,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
