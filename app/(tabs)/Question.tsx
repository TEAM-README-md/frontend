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

interface AuthTokens {
  jwtToken: string
  refreshToken?: string
  expiresAt?: number
}

interface InterviewQuestion {
  chapter: string
  question: string
}

const isError = (error: unknown): error is Error => error instanceof Error

export default function Question() {
  const router = useRouter()
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null)
  const [userId, setUserId] = useState("")
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionCount, setQuestionCount] = useState(3)
  const [questionsLoaded, setQuestionsLoaded] = useState(false)

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
    const count = await SecureStore.getItemAsync("questionCount")

    if (jwt) {
      setAuthTokens({
        jwtToken: jwt,
        refreshToken: refreshToken || undefined,
        expiresAt: expiresAt ? parseInt(expiresAt) : undefined,
      })
    }
    if (id) setUserId(id)
    if (count) setQuestionCount(parseInt(count, 10))
  }

  const createHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    if (authTokens?.jwtToken) headers.Authorization = `Bearer ${authTokens.jwtToken}`
    if (userId) headers["X-User-ID"] = userId
    return headers
  }

  const fetchQuestions = async () => {
    if (questionsLoaded) return

    setIsLoading(true)
    try {
      const headers = createHeaders()
      const allQuestions: InterviewQuestion[] = []

      const res1 = await fetch(
        "http://3.34.53.204:8080/api/interview/cover-letter/questions",
        { method: "GET", headers }
      )
      const text1 = await res1.text()
      try {
        const data1 = JSON.parse(text1)
        if (Array.isArray(data1)) {
          data1.forEach((q: any) => {
            if (q.chapter && q.question) {
              allQuestions.push({ chapter: q.chapter, question: q.question })
            }
          })
        }
      } catch {}

      const chapters = ["growth", "motivation", "strength", "experience", "problem", "future"]
      const surveyQuestions: InterviewQuestion[] = []

      for (let i = 0; i < questionCount; i++) {
        const chapter = chapters[i % chapters.length]
        const res = await fetch(
          "http://3.34.53.204:8080/api/interview/survey/questions",
          {
            method: "POST",
            headers,
            body: JSON.stringify({ chapter }),
          }
        )
        const data = await res.json()
        if (data?.chapter && data?.question) {
          surveyQuestions.push({ chapter: data.chapter, question: data.question })
        }
      }

      allQuestions.push(...surveyQuestions)

      if (allQuestions.length === 0) {
        throw new Error("질문을 불러오지 못했습니다.")
      }

      setQuestions(allQuestions)
      setCurrentIndex(0)
      setUserAnswer("")
      setFeedback("")
      setQuestionsLoaded(true)
    } catch (e) {
      Alert.alert("에러", isError(e) ? e.message : String(e))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    const current = questions[currentIndex]
    if (!current || !userAnswer.trim()) {
      Alert.alert("답변 없음", "답변을 작성해 주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const headers = createHeaders()
      const res = await fetch(
        "http://3.34.53.204:8080/api/interview/feedback",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            chapter: current.chapter,
            question: current.question,
            answer: userAnswer,
          }),
        }
      )
      const data = await res.json()
      if (res.ok && data?.feedback) {
        setFeedback(data.feedback)
      } else {
        Alert.alert("피드백 없음", data?.message || "피드백을 받을 수 없습니다.")
      }
    } catch (e) {
      Alert.alert("에러", isError(e) ? e.message : String(e))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
      setFeedback("")
    } else {
      Alert.alert("완료", "모든 질문을 완료했습니다.", [
        {
          text: "확인",
          onPress: async () => {
            setQuestions([])
            setCurrentIndex(0)
            setUserAnswer("")
            setFeedback("")
            setQuestionsLoaded(false)
            await SecureStore.deleteItemAsync("questionCount")
            router.push("/Home")
          },
        },
      ])
    }
  }

  const currentQuestion = questions[currentIndex]

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => router.push("/Home")}> 
        <Text style={styles.closeText}>X</Text>
      </Pressable>

      <Text style={styles.title}>면접 질문 {currentIndex + 1} / {questions.length}</Text>

      <Pressable
        style={styles.button}
        onPress={fetchQuestions}
        disabled={isLoading || questionsLoaded}
      >
        {isLoading
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.buttonText}>질문 가져오기</Text>}
      </Pressable>

      <ScrollView style={styles.scrollBox}>
        {currentQuestion ? (
          <View style={styles.questionBox}>
            <Text style={styles.chapter}>[{currentQuestion.chapter}]</Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>

            <TextInput
              style={styles.input}
              multiline
              placeholder="답변을 입력하세요..."
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
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            질문을 먼저 불러와 주세요.
          </Text>
        )}
      </ScrollView>

      <Pressable
        style={[styles.button, { backgroundColor: "#28A745" }]}
        onPress={handleSubmitAnswer}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.buttonText}>답변 제출 및 피드백 받기</Text>}
      </Pressable>

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor:
              currentIndex >= questions.length - 1
                ? "#28A745"
                : userAnswer && feedback
                ? "#666"
                : "#CCC",
          },
        ]}
        onPress={handleNext}
        disabled={
          currentIndex < questions.length - 1 && (!userAnswer || !feedback)
        }
      >
        <Text style={styles.buttonText}>
          {currentIndex >= questions.length - 1 ? "완료" : "다음 질문"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 24 },
  title: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 12,
    color: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 36,
    left: 16,
    zIndex: 999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    marginVertical: 8,
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
