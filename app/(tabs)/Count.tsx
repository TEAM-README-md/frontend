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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CountScreen() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [errorType, setErrorType] = useState<null | "min" | "max">(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        setJwtToken(token);
        console.log("✅ JWT 토큰:", token);
      } catch (error) {
        console.error("❌ JWT 토큰 불러오기 실패:", error);
      }
    };
    loadToken();
  }, []);

  const handleNext = async () => {
    if (count > 0) {
      if (!jwtToken) {
        Alert.alert("JWT 오류", "JWT 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      try {
        await SecureStore.setItemAsync("questionCount", String(count));
        console.log("✅ questionCount 저장됨:", count);
        router.push("/Submission");
      } catch (err) {
        console.error("❌ 답변 저장 실패:", err);
        Alert.alert("저장 실패", "값을 저장하는 중 문제가 발생했습니다.");
      }
    } else {
      setErrorType("min");
    }
  };

  const handleBack = () => {
    router.push("/Changing");
  };

  const increment = () => {
    if (count < 15) {
      setCount(count + 1);
      setErrorType(null);
    } else {
      setErrorType("max");
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
      setErrorType(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      <Image source={require("../../assets/images/image 80.png")} style={styles.image} />

      <Text style={styles.questionText}>면접 질문 갯수를 선택해주세요!</Text>

      <View style={styles.counterBox}>
        <Pressable onPress={decrement} style={styles.counterButton}>
          <Text style={styles.counterSign}>-</Text>
        </Pressable>

        <Text style={styles.countText}>{count}</Text>

        <Pressable onPress={increment} style={styles.counterButton}>
          <Text style={styles.counterSign}>+</Text>
        </Pressable>
      </View>

      {errorType === "min" && (
        <Text style={styles.minErrorText}>1개 이상은 선택하셔야 다음 선택이 가능해요!</Text>
      )}
      {errorType === "max" && (
        <Text style={styles.maxErrorText}>최대 15 이하로 선택하실 수 있어요</Text>
      )}

      <Pressable style={[styles.prevButton, errorType && { top: SCREEN_HEIGHT * 0.53 }]} onPress={handleBack}>
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      <Pressable style={[styles.nextButton, errorType && { top: SCREEN_HEIGHT * 0.53 }]} onPress={handleNext}>
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
    marginTop: SCREEN_HEIGHT * 0.06,
    marginLeft: SCREEN_WIDTH * 0.17,
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.015,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    marginRight: 5,
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  image: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  questionText: {
    marginTop: SCREEN_HEIGHT * 0.03,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 24,
    color: "#0077FF",
    textAlign: "center",
  },
  counterBox: {
    marginTop: SCREEN_HEIGHT * 0.04,
    marginHorizontal: SCREEN_WIDTH * 0.1,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
  },
  countText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    color: "#000000",
  },
  counterButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  counterSign: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  minErrorText: {
    marginTop: SCREEN_HEIGHT * 0.015,
    alignSelf: "center",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
    color: "#FF0000",
  },
  maxErrorText: {
    marginTop: SCREEN_HEIGHT * 0.015,
    alignSelf: "center",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
    color: "#FF0000",
  },
  prevButton: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.5,
    left: SCREEN_WIDTH * 0.1,
    width: SCREEN_WIDTH * 0.37,
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
    color: "#333333",
  },
  nextButton: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.5,
    left: SCREEN_WIDTH * 0.53,
    width: SCREEN_WIDTH * 0.37,
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
    color: "#FFFFFF",
  },
});
