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

  const exampleAnswer = "IT 기술이 사람들의 삶을 더 편리하게 만들 수 있다는 가능성에 매력을 느껴 소프트웨어 분야에 진로를 결정하게 되었습니다. 특히 사용자의 니즈를 빠르게 반영할 수 있는 프론트엔드 개발은 저에게 큰 흥미를 주었습니다. 고등학교 시절 교내 웹 프로젝트를 하며 사용자의 피드백에 따라 UI를 개선하고 기능을 최적화하는 과정에서 프론트엔드가 사용자와 가장 가까운 위치에 있다는 점이 매력적으로 다가왔습니다. 귀사는 사용자 중심 서비스를 중심에 두고 기술 혁신을 실현하는 기업이며, 저 또한 이러한 방향에 깊이 공감하고 있습니다. 사용자의 경험을 최우선으로 고려하는 개발 문화 속에서 저의 역량을 발휘하고 더 성장할 수 있을 것이라 생각해 지원하게 되었습니다.";

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
            chapter: "motivation",
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
          pathname: "/Support2",
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
            <Text style={styles.title}>지원동기 작성</Text>
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              이 회사에 지원한 동기를 알려주세요!{`\n`}저희가 피드백을 해드릴 거예요.
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