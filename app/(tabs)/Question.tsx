"use client"

import { useFocusEffect, useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

const isError = (error: unknown): error is Error => error instanceof Error

interface AuthTokens {
  jwtToken: string
  refreshToken?: string
  expiresAt?: number
}

interface InterviewQuestion {
  chapter: string
  question: string
}

type RequestHeaders = Record<string, string>

export default function Question() {
  const router = useRouter()
  const [question, setQuestion] = useState<InterviewQuestion | null>(null)
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null)
  const [userId, setUserId] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
  )

  const loadData = async () => {
    const jwt = await SecureStore.getItemAsync("jwt_token")
    const refreshToken = await SecureStore.getItemAsync("refreshToken")
    const expiresAt = await SecureStore.getItemAsync("tokenExpiresAt")
    const id = await SecureStore.getItemAsync("userId")

    if (jwt) {
      setAuthTokens({
        jwtToken: jwt,
        refreshToken: refreshToken || undefined,
        expiresAt: expiresAt ? parseInt(expiresAt) : undefined,
      })
    }
    if (id) setUserId(id)
  }

  const createHeaders = (
    additionalHeaders: Partial<Record<string, string | undefined>> = {}
  ): RequestHeaders => {
    const baseHeaders: RequestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (authTokens?.jwtToken) baseHeaders.Authorization = `Bearer ${authTokens.jwtToken}`
    if (userId) baseHeaders["X-User-ID"] = userId

    for (const [key, value] of Object.entries(additionalHeaders)) {
      if (typeof value === "string") baseHeaders[key] = value
    }

    return baseHeaders
  }

  const handleFetchQuestion = async () => {
  setIsLoading(true)
  try {
    const headers = createHeaders()

    const chapters = ["growth", "motivation", "strength", "experience", "problem", "future"]
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)]

    const response = await fetch(
      "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/interview/survey/questions",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ chapter: randomChapter }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`서버 오류: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
console.log("✅ 서버 응답 내용:", JSON.stringify(data, null, 2))

    // 서버 구조에 맞게 키 수정 필요
    if (data?.question?.chapter && data?.question?.text) {
      setQuestion({
        chapter: data.question.chapter,
        question: data.question.text,
      })
      setUserAnswer("")
      setFeedback("")
    } else {
      throw new Error("서버에서 올바른 질문 형식이 반환되지 않았습니다.")
    }
  } catch (e) {
    console.error("❌ 질문 요청 실패:", e)
    Alert.alert("질문 요청 에러", isError(e) ? e.message : String(e))
  } finally {
    setIsLoading(false)
  }
}

  const handleSubmitAnswer = async () => {
    if (!question || !userAnswer.trim()) {
      Alert.alert("답변 없음", "답변을 작성해 주세요.")
      return
    }

    try {
      const headers = createHeaders()
      const response = await fetch(
        "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/interview/feedback",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            chapter: question.chapter,
            question: question.question,
            answer: userAnswer,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`서버 오류: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      if (data?.feedback) {
        setFeedback(data.feedback)
      } else {
        Alert.alert("서버 응답 오류", "피드백 내용을 받지 못했습니다.")
      }
    } catch (e) {
      console.error("❌ 피드백 요청 실패:", e)
      Alert.alert("에러", isError(e) ? e.message : String(e))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>맞춤형 면접 질문</Text>

      <Pressable style={styles.button} onPress={handleFetchQuestion} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>질문 가져오기</Text>
        )}
      </Pressable>

      <ScrollView style={styles.scrollBox}>
        {question ? (
          <View style={styles.questionBox}>
            <Text style={styles.chapter}>[{question.chapter}]</Text>
            <Text style={styles.question}>{question.question}</Text>

            <TextInput
              style={styles.input}
              multiline
              placeholder="여기에 답변을 작성해 주세요..."
              value={userAnswer}
              onChangeText={setUserAnswer}
              textAlignVertical="top"
            />

            {feedback !== "" && (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackTitle}>💡 피드백</Text>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            질문을 먼저 가져와 주세요.
          </Text>
        )}
      </ScrollView>

      <Pressable
        style={[styles.button, { backgroundColor: "#28A745" }]}
        onPress={handleSubmitAnswer}
      >
        <Text style={styles.buttonText}>답변 제출 및 피드백 받기</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
    color: "#000",
  },
  button: {
    marginVertical: 12,
    backgroundColor: "#0348DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  scrollBox: { marginTop: 12 },
  questionBox: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#F0F4FF",
    borderRadius: 10,
  },
  chapter: { fontWeight: "bold", fontSize: 14, color: "#333", marginBottom: 4 },
  question: { fontSize: 16, color: "#000", lineHeight: 22, marginBottom: 12 },
  input: {
    backgroundColor: "#FFF",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 100,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  feedbackBox: {
    marginTop: 16,
    backgroundColor: "#E6FFF2",
    borderColor: "#28A745",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  feedbackTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#28A745",
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
  },
})
