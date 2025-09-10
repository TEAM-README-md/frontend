import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function Yourself() {
  const router = useRouter();
  const [selfIntro, setSelfIntro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selfIntro.trim()) {
      Alert.alert("입력 오류", "자기소개를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://3.34.53.204:8080/api/intro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ intro: selfIntro }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data?.token) {
          await SecureStore.setItemAsync("jwt", data.token);
        }

        Alert.alert("제출이 완료되었습니다.", "자기소개가 제출되었습니다.", [
          { text: "확인", onPress: () => router.push("/Feedback") },
        ]);
      } else {
        Alert.alert("오류", data?.message || "제출에 실패했습니다.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* 질문 */}
          <Text style={styles.question}>자기 소개를 작성해 보세요</Text>

          {/* 회색 배경 */}
          <View style={styles.grayBox} />

          {/* 텍스트 입력 */}
          <TextInput
            style={styles.textInput}
            multiline
            placeholder=""
            placeholderTextColor="#888"
            value={selfIntro}
            onChangeText={setSelfIntro}
            editable={!loading}
            // inputMode="text"
          />

          {/* 제출 버튼 */}
          <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitText}>{loading ? "제출 중..." : "제출"}</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    position: "relative",
    width: 412,
    height: 917,
    backgroundColor: "#FFFFFF",
  },
  grayBox: {
    position: "absolute",
    width: 379,
    height: 493,
    left: 16,
    top: 212,
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.42)",
  },
  question: {
    position: "absolute",
    width: 394,
    height: 77,
    left: 9,
    top: 34,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    color: "#000000",
  },
  textInput: {
    position: "absolute",
    width: 346,
    height: 459,
    left: 34,
    top: 234,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 15,
    lineHeight: 18,
    color: "#000000",
    textAlignVertical: "top",
  },
  submitButton: {
    position: "absolute",
    width: 165,
    height: 54,
    left: 123,
    top: 737,
    backgroundColor: "#0348DB",
    borderRadius: 10.76,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    color: "#FFFFFF",
  },
});
