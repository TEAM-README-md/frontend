// 실행되는

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

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
        // 단일 값으로 questionCount 저장
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

      <Pressable style={[styles.prevButton, errorType && { top: 487 }]} onPress={handleBack}>
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      <Pressable style={[styles.nextButton, errorType && { top: 487 }]} onPress={handleNext}>
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
    borderRadius: 10,
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
  counterBox: {
    position: "absolute",
    top: 368,
    left: 42,
    width: 361,
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
    position: "absolute",
    width: 274,
    height: 17,
    left: 124,
    top: 459,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14.4,
    lineHeight: 17,
    color: "#FF0000",
  },
  maxErrorText: {
    position: "absolute",
    width: 212,
    height: 17,
    left: 186,
    top: 459,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14.4,
    lineHeight: 17,
    color: "#FF0000",
  },
  prevButton: {
    position: "absolute",
    top: 487,
    left: 43,
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
    color: "#333333",
  },
  nextButton: {
    position: "absolute",
    top: 487,
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
    color: "#FFFFFF",
  },
});
