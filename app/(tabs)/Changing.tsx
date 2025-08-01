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
            { top: height * 0.42 + index * height * 0.09 },
            selectedLevel === index && styles.selectedOption,
          ]}
          onPress={() => handleSelect(index)}
        >
          <Text style={styles.optionText}>{text}</Text>
        </Pressable>
      ))}

      {showError && <Text style={styles.errorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>}

      <Pressable
        style={[styles.prevButton, showError && { top: height * 0.69 }]}
        onPress={handleBack}
      >
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      <Pressable
        style={[styles.nextButton, showError && { top: height * 0.69 }]}
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
    left: width * 0.16,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: width * 0.15,
    height: height * 0.015,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  image: {
    position: "absolute",
    top: height * 0.15,
    left: width * 0.3,
    width: width * 0.35,
    height: width * 0.35,
    resizeMode: "contain",
  },
  questionText: {
    position: "absolute",
    top: height * 0.32,
    left: width * 0.05,
    width: width * 0.9,
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: width * 0.06,
    color: "#0077FF",
  },
  optionBox: {
    position: "absolute",
    left: width * 0.1,
    width: width * 0.8,
    height: height * 0.065,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: "#0077FF",
  },
  optionText: {
    marginLeft: width * 0.04,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: width * 0.045,
    color: "#000000",
  },
  errorText: {
    position: "absolute",
    top: height * 0.63,
    alignSelf: "center",
    fontSize: width * 0.035,
    color: "#FF0000",
    fontFamily: "Inter",
  },
  prevButton: {
    position: "absolute",
    top: height * 0.67,
    left: width * 0.1,
    width: width * 0.38,
    height: height * 0.065,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  prevText: {
    fontSize: width * 0.045,
    fontWeight: "900",
    color: "#333333",
    fontFamily: "Inter",
  },
  nextButton: {
    position: "absolute",
    top: height * 0.67,
    left: width * 0.52,
    width: width * 0.38,
    height: height * 0.065,
    backgroundColor: "#0348DB",
    borderRadius: 12,
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
    fontFamily: "Inter",
  },
});
