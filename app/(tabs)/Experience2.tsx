"use client"

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native"

const isError = (error: unknown): error is Error => error instanceof Error

interface AuthTokens {
  jwtToken: string
  refreshToken?: string
  expiresAt?: number
}

type RequestHeaders = Record<string, string>

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export default function Grow2() {
  const router = useRouter()
  const { feedback, shouldSave } = useLocalSearchParams()
  const [selfIntro, setSelfIntro] = useState("")
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null)
  const [userId, setUserId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, []),
  )

  const createHeaders = (additionalHeaders: Partial<RequestHeaders> = {}): RequestHeaders => {
    const baseHeaders: RequestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const headers: RequestHeaders = { ...baseHeaders }

    if (authTokens?.jwtToken) headers.Authorization = `Bearer ${authTokens.jwtToken}`
    if (userId) headers["X-User-ID"] = userId

    Object.entries(additionalHeaders).forEach(([key, value]) => {
      if (value !== undefined && value !== null) headers[key] = value
    })

    return headers
  }

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const headers = createHeaders(options.headers as Record<string, string>)
    return fetch(url, { ...options, headers })
  }

  const generateJWTToken = async () => {
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
      const payload = btoa(
        JSON.stringify({
          sub: "test2-user-" + Math.random().toString(36).substring(2, 8),
          name: "Test2 Generated User",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400,
        }),
      )
      const signature = "test2-signature-" + Math.random().toString(36).substring(2, 15)
      const autoToken = `${header}.${payload}.${signature}`

      await SecureStore.setItemAsync("jwt_token", autoToken)
      const expiresAt = Date.now() + 86400 * 1000
      await SecureStore.setItemAsync("tokenExpiresAt", expiresAt.toString())
      const id = "user-" + Math.random().toString(36).substring(2, 8)
      await SecureStore.setItemAsync("userId", id)
      loadData()
      return true
    } catch (e) {
      console.error("JWT 생성 실패:", e)
      Alert.alert("JWT 생성 실패")
      return false
    }
  }

  const handleSaveDraft = async () => {
    if (!selfIntro) return Alert.alert("에러", "자기소개를 입력해주세요")

    if (!authTokens?.jwtToken) {
      await generateJWTToken()
      await loadData()
    }

    try {
      setIsSaving(true)

      const requestData = {
        content: selfIntro,
        chapter: "experience",
        userId: userId || "anonymous",
        timestamp: new Date().toISOString(),
        isDraft: true,
      }

      const response = await makeAuthenticatedRequest("http://3.34.53.204:8080/api/cover-letter/draft", {
        method: "POST",
        body: JSON.stringify(requestData),
      })

      const text = await response.text()

      if (response.ok) {
        await SecureStore.setItemAsync("experienceSaved", "true")
        Alert.alert("저장 완료", "임시 저장 성공!", [{ text: "확인", onPress: () => router.push("/Writing") }])
      } else {
        console.error("❌ 임시 저장 실패 상태:", response.status)
        console.error("❌ 서버 응답 본문:", text)
        Alert.alert("임시 저장 실패", `상태 코드: ${response.status}\n응답 내용:\n${text}`)
      }
    } catch (e) {
      console.error("❌ 임시 저장 요청 중 에러:", e)
      Alert.alert("에러", `요청 실패\n${isError(e) ? e.message : String(e)}`)
    } finally {
      setIsSaving(false)
    }
  }

  const loadData = async () => {
    const intro = await SecureStore.getItemAsync("selfIntro")
    if (intro) setSelfIntro(intro)
    const jwt = await SecureStore.getItemAsync("jwt_token")
    const refreshToken = await SecureStore.getItemAsync("refreshToken")
    const expiresAt = await SecureStore.getItemAsync("tokenExpiresAt")
    const id = await SecureStore.getItemAsync("userId")

    if (jwt) {
      setAuthTokens({
        jwtToken: jwt,
        refreshToken: refreshToken || undefined,
        expiresAt: expiresAt ? Number.parseInt(expiresAt) : undefined,
      })
    } else {
      setAuthTokens(null)
    }
    if (id) setUserId(id)
  }

  const handleGoBack = () => router.push("/Experience")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 피드백</Text>
      <Text style={styles.description}>
        작성하신 질문을 바탕으로 AI가 질문에{"\n"}
        맞는 피드백을 생성합니다.
      </Text>

      <View style={styles.feedbackBox}>
        <Text style={styles.feedbackText}>
          {feedback ? decodeURIComponent(feedback as string) : "피드백이 없습니다."}
        </Text>
      </View>

      {shouldSave === "true" && (
        <Pressable style={styles.saveButton} onPress={handleSaveDraft} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>임시 저장</Text>
          )}
        </Pressable>
      )}

      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>다시 작성</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.06,
  },
  title: {
    width: "100%",
    fontSize: screenWidth * 0.08,
    fontFamily: "Inter",
    fontWeight: "900",
    textAlign: "center",
    color: "#0077FF",
    marginBottom: screenHeight * 0.02,
  },
  description: {
    width: "100%",
    fontSize: screenWidth * 0.04,
    fontFamily: "Inter",
    fontWeight: "900",
    textAlign: "center",
    color: "#0077FF",
    marginBottom: screenHeight * 0.03,
  },
  feedbackBox: {
    width: "100%",
    height: screenHeight * 0.55,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    padding: screenWidth * 0.04,
    marginBottom: screenHeight * 0.04,
  },
  feedbackText: {
    fontSize: screenWidth * 0.04,
    lineHeight: screenWidth * 0.055,
    color: "#000000",
  },
  saveButton: {
    position: "absolute",
    width: screenWidth * 0.4,
    height: screenHeight * 0.07,
    right: screenWidth * 0.05,
    bottom: screenHeight * 0.05,
    backgroundColor: "#0348DB",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: screenWidth * 0.05,
    color: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    width: screenWidth * 0.4,
    height: screenHeight * 0.07,
    left: screenWidth * 0.05,
    bottom: screenHeight * 0.05,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0077FF",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: screenWidth * 0.05,
    color: "#0077FF",
  },
})
