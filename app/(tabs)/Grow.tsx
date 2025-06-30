import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
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

export default function Grow() {
  const router = useRouter();
  const [selfIntro, setSelfIntro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedIntro = selfIntro.trim();
    if (!trimmedIntro) {
      Alert.alert("입력 오류", "자기소개를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: trimmedIntro,
            chapter: "growth",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("selfIntro", trimmedIntro);

        if (data?.token) {
          await SecureStore.setItemAsync("jwt", data.token);
        }

        const shouldSave = data.shouldSave?.toString() || "false";

        router.push({
          pathname: "/Grow2",
          params: {
            feedback: encodeURIComponent(data.feedback || "성공적으로 제출되었습니다."),
            shouldSave,
          },
        });
      } else {
        Alert.alert("오류", data?.message || "제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("서버 오류:", error);
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    router.push("/Writing"); // 🔄 종료 시 Writing으로 이동
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* 상단 타이틀 */}
          <Text style={styles.title}>성장과정 작성</Text>

          {/* 설명 텍스트 */}
          <Text style={styles.description}>
            어떻게 성장하셨는지 알려주세요!{`\n`}저희가 피드백을 해드릴 거예요.
          </Text>

          {/* 흰색 배경 박스 */}
          <View style={styles.textBox}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="자소서를 작성하세요."
              placeholderTextColor="#888"
              value={selfIntro}
              onChangeText={setSelfIntro}
              editable={!loading}
            />
          </View>

          {/* 버튼: 제출 */}
          <Pressable
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>확인</Text>
            )}
          </Pressable>

          {/* 버튼: 종료 */}
          <Pressable style={[styles.button, styles.exitButton]} onPress={handleExit}>
            <Text style={[styles.buttonText, { color: "#0077FF" }]}>종료</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077FF",
  },
  inner: {
    position: "relative",
    width: 412,
    height: 917,
  },
  title: {
    position: "absolute",
    width: 394,
    height: 77,
    left: 33,
    top: 52,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    color: "#FFFFFF",
  },
  description: {
    position: "absolute",
    width: 210,
    height: 53,
    left: 126,
    top: 121,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 15,
    lineHeight: 18,
    textAlign: "center",
    color: "#FFFFFF",
  },
  textBox: {
    position: "absolute",
    width: 361,
    height: 551,
    left: 45,
    top: 164,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 15,
    lineHeight: 18,
    color: "#000000",
    textAlignVertical: "top",
  },
  button: {
    position: "absolute",
    width: 165,
    height: 54,
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  submitButton: {
    left: 243,
    top: 754,
    backgroundColor: "#0348DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exitButton: {
    left: 53,
    top: 754,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
});
