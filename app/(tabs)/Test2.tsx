import { useRouter } from "expo-router";
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
    View,
} from "react-native";

export default function Test2() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [chapter, setChapter] = useState(""); // 챕터 키워드 입력
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !chapter.trim()) {
      Alert.alert("입력 오류", "자기소개와 챕터를 모두 입력해주세요.");
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
          body: JSON.stringify({ content, chapter }),
        }
      );

      const data = await response.json();

      if (response.ok && data?.feedback) {
        setFeedback(data.feedback);
      } else {
        Alert.alert("오류", data?.message || "피드백이 없습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "서버 요청에 실패했습니다.");
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
          <Text style={styles.title}>자기소개 GPT 피드백</Text>

          {/* 챕터 입력 */}
          <TextInput
            style={styles.input}
            placeholder="챕터 입력 (예: growth)"
            value={chapter}
            onChangeText={setChapter}
            editable={!loading}
          />

          {/* 자기소개 입력 */}
          <TextInput
            style={[styles.textInput, { marginTop: 12 }]}
            multiline
            placeholder="자기소개를 입력하세요"
            value={content}
            onChangeText={setContent}
            editable={!loading}
            textAlignVertical="top"
          />

          {/* 제출 버튼 */}
          <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitText}>{loading ? "분석 중..." : "분석하기"}</Text>
          </Pressable>

          {/* 피드백 출력 */}
          {feedback !== "" && (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackTitle}>GPT 피드백</Text>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 16,
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: "#F9F9F9",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    height: 180,
    backgroundColor: "#F9F9F9",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#0348DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  feedbackBox: {
    marginTop: 24,
    backgroundColor: "#E6F0FF",
    padding: 16,
    borderRadius: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0348DB",
  },
  feedbackText: {
    fontSize: 15,
    color: "#000000",
  },
});
