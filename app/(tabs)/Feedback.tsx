import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  View,
} from "react-native";

export default function Feedback() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);

  useEffect(() => {
  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        "http://3.34.53.204:8080/api/intro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            introduction: "안녕하세요. 저는 사용자가 입력한 자기소개입니다.", // 🔑 중요!
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.feedback) {
        setFeedback(data.feedback); // IntroResponseDTO의 "feedback" 필드
      } else {
        Alert.alert("오류", "피드백이 없습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "피드백을 불러오지 못했습니다.");
    }
  };

  fetchFeedback();
}, []);

  const handleSubmit = async () => {
    router.push("/Home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>피드백</Text>

          <View style={styles.grayBox} />

          <TextInput
            style={styles.textInput}
            multiline
            value={feedback}
            editable={false}
            textAlignVertical="top"
          />

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>완료</Text>
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
  title: {
    position: "absolute",
    width: 320,
    height: 65,
    left: 46,
    top: 38,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 36,
    lineHeight: 44,
    textAlign: "center",
    color: "#000000",
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
    position: "absolute",
    width: 114,
    height: 44,
    left: 0,
    top: 0,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    color: "#FFFFFF",
    textAlignVertical: "center",
  },
});
