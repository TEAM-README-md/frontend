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

  const exampleAnswer = "어릴 적부터 부모님께서 항상 “작은 일도 성실히 하라”는 말씀을 해오셨고, 이 가르침은 저의 가치관의 중심이 되었습니다. 고등학교 시절, 청소 당번으로 배정되었을 때 단순히 형식적으로 끝내지 않고, 교실 구석진 곳까지 꼼꼼히 청소하며 책임감을 실천했습니다. 처음엔 눈에 띄지 않는 일이었지만, 나중엔 선생님과 친구들의 신뢰를 얻어 학급 부반장을 맡게 되었고, 이후 맡은 역할마다 주도적으로 행동할 수 있는 자신감을 얻게 되었습니다. 이러한 경험을 바탕으로, 저는 앞으로도 주어진 일에 책임감을 가지고 임하며 팀의 신뢰를 이끄는 사람이 되고 싶습니다. 특히 개발자로서 협업과 소통이 중요한 만큼, 작지만 중요한 업무도 놓치지 않고 성실히 수행하는 태도를 유지하며, 장기적으로는 팀을 이끄는 리더로 성장하는 것을 목표로 하고 있습니다.";

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
            chapter: "future",
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
          pathname: "/Aspiration2",
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
            <Text style={styles.title}>입사 후 포부 작성</Text>
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              회사 입사 후 앞으로의 계획을 알려주세요!{`\n`}저희가 피드백을 해드릴거예요.
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