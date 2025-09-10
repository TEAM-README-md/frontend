import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 반응형 크기 계산 함수
const responsiveWidth = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
const responsiveHeight = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;
const responsiveFont = (size: number) => (size * SCREEN_WIDTH) / 375; // iPhone X 기준

export default function Grow() {
  const router = useRouter();
  const [selfIntro, setSelfIntro] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_CHARS = 500;

  const exampleAnswer = "웹 프로젝트를 진행하던 중 외부 API 호출이 브라우저의 CORS 정책에 의해 차단되는 문제가 발생했습니다. 당시 저는 프론트엔드를 맡고 있었지만, 문제 해결을 위해 직접 원인을 분석했습니다. CORS에 대한 원리를 학습한 뒤, 백엔드에서 프록시 서버를 구성해 API 요청을 우회하는 방식으로 해결책을 설계했습니다. Spring Boot에서 WebClient를 활용해 외부 데이터를 받아오는 구조를 적용했고, 이를 프론트엔드에 전달해 문제없이 동작하도록 했습니다. 해당 문제를 해결하면서 단순히 프론트엔드 영역에만 머무르지 않고 전체 시스템 구조를 고려해야 한다는 것을 배웠고, 기술적 문제 해결 과정에서의 커뮤니케이션과 협업의 중요성도 체득할 수 있었습니다. 이후 유사한 문제가 발생했을 때도 주도적으로 해결하는 경험이 늘어났습니다.";

  const handleTextChange = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setSelfIntro(text);
    }
  };

  const handleExampleAnswer = () => {
    const truncatedExample = exampleAnswer.slice(0, MAX_CHARS);
    setSelfIntro(truncatedExample);
  };

  const handleSubmit = async () => {
    const trimmedIntro = selfIntro.trim();
    if (!trimmedIntro) {
      Alert.alert("입력 오류", "자기소개를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://3.34.53.204:8080/api/cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: trimmedIntro,
            chapter: "problem",
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
          pathname: "/Problem2",
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>문제 해결 경험 작성</Text>
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              어떤 문제를 해결한 경험이 있는지 알려주세요!{`\n`}저희가 피드백을 해드릴 거예요.
            </Text>
          </View>

          {/* 텍스트 입력 영역 */}
          <View style={styles.textBoxContainer}>
            <View style={styles.textBox}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="자소서를 작성하세요."
                placeholderTextColor="#888"
                value={selfIntro}
                onChangeText={handleTextChange}
                editable={!loading}
                maxLength={MAX_CHARS}
              />
            </View>

            {/* 글자 수 카운터 */}
            <Text style={styles.charCounter}>
              {selfIntro.length} / {MAX_CHARS}자
            </Text>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            {/* 종료 버튼 */}
            <Pressable style={[styles.button, styles.exitButton]} onPress={handleExit}>
              <Text style={[styles.buttonText, { color: "#0077FF" }]}>종료</Text>
            </Pressable>

            {/* 제출 버튼 */}
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
          </View>

          {/* 예시 답변 버튼 */}
          <View style={styles.exampleContainer}>
            <Pressable style={styles.exampleButton} onPress={handleExampleAnswer}>
              <Text style={styles.exampleButtonText}>예시 답변</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  titleContainer: {
    marginTop: responsiveHeight(6),
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: responsiveFont(32),
    textAlign: "center",
    color: "#0077FF",
  },
  descriptionContainer: {
    marginTop: responsiveHeight(4),
    alignItems: "center",
  },
  description: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: responsiveFont(15),
    lineHeight: responsiveFont(18),
    textAlign: "center",
    color: "#0077FF",
  },
  textBoxContainer: {
    flex: 1,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  textBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 11,
    minHeight: responsiveHeight(50),
    position: "relative",
  },
  textInput: {
    flex: 1,
    padding: responsiveWidth(4),
    paddingBottom: responsiveHeight(5), // 하단 글자수 카운터 공간 확보
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: responsiveFont(15),
    lineHeight: responsiveFont(18),
    color: "#000000",
    textAlignVertical: "top",
  },
  charCounter: {
    position: "absolute",
    bottom: responsiveHeight(1),
    right: responsiveWidth(4),
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: responsiveFont(13),
    color: "#FF4D4D",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
  },
  button: {
    width: responsiveWidth(40),
    height: responsiveHeight(7),
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: "#0348DB",
  },
  exitButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0077FF",
  },
  buttonText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: responsiveFont(20),
    textAlign: "center",
  },
  exampleContainer: {
    alignItems: "center",
    marginBottom: responsiveHeight(4),
  },
  exampleButton: {
    width: responsiveWidth(50),
    height: responsiveHeight(4),
    justifyContent: "center",
    alignItems: "center",
  },
  exampleButtonText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: responsiveFont(15),
    textAlign: "center",
    color: "#71A0FF",
  },
});