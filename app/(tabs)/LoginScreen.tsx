"use client"

import axios from "axios"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useRef, useState } from "react"
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const LoginScreen = () => {
  const inputRef1 = useRef<TextInput>(null)
  const inputRef2 = useRef<TextInput>(null)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ✅ 수정: API_BASE_URL에서 중복 경로 제거
  const API_BASE_URL = "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app"

  const saveTokenSafely = async (token: any, additionalData?: any): Promise<boolean> => {
    try {
      if (!token) return false
      const tokenString = typeof token === "string" ? token : JSON.stringify(token)
      if (!tokenString || tokenString === "undefined" || tokenString === "null") return false

      console.log("=== LoginScreen 토큰 저장 시작 ===")
      console.log("저장할 토큰:", tokenString.substring(0, 30) + "...")

      // jwt_token 키로 저장 (Test 파일들이 찾는 키)
      await SecureStore.setItemAsync("jwt_token", tokenString)
      console.log("✅ jwt_token 키로 저장 완료")

      // 만료 시간 설정 (24시간 후)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      await SecureStore.setItemAsync("tokenExpiresAt", expiresAt.toString())
      console.log("✅ 만료 시간 저장 완료:", new Date(expiresAt).toLocaleString())

      // 추가 데이터가 있으면 저장
      if (additionalData) {
        if (additionalData.userId || additionalData.user_id || additionalData.id) {
          const userId = additionalData.userId || additionalData.user_id || additionalData.id
          await SecureStore.setItemAsync("userId", userId.toString())
          console.log("✅ userId 저장 완료:", userId)
        }

        if (additionalData.refreshToken || additionalData.refresh_token) {
          const refreshToken = additionalData.refreshToken || additionalData.refresh_token
          await SecureStore.setItemAsync("refreshToken", refreshToken)
          console.log("✅ refreshToken 저장 완료")
        }

        if (additionalData.user || additionalData.userInfo) {
          const userInfo = additionalData.user || additionalData.userInfo
          await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo))
          console.log("✅ userInfo 저장 완료")
        }
      }

      // 저장 확인
      const savedToken = await SecureStore.getItemAsync("jwt_token")
      if (savedToken === tokenString) {
        console.log("✅ 토큰 저장 검증 성공")
        return true
      } else {
        console.error("❌ 토큰 저장 검증 실패")
        return false
      }
    } catch (error) {
      console.error("❌ 토큰 저장 실패:", error)
      return false
    }
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("입력 오류", "아이디와 비밀번호를 모두 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)

      console.log("=== 로그인 요청 시작 ===")
      console.log("요청 URL:", `${API_BASE_URL}/api/users/login`)
      console.log("요청 데이터:", { username, password: "***" })

      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`, // ✅ 수정: 올바른 URL 구성
        { username, password },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )

      console.log("=== 로그인 응답 ===")
      console.log("상태 코드:", response.status)
      console.log("응답 헤더:", response.headers)
      console.log("응답 데이터:", response.data)

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token || response.data.accessToken || response.data.jwt

        if (!token) {
          console.error("❌ 응답에 토큰이 없음:", response.data)
          Alert.alert("오류", "서버에서 토큰을 받지 못했습니다.")
          return
        }

        console.log("=== 로그인 성공 응답 ===")
        console.log("전체 응답:", response.data)
        console.log("토큰 타입:", typeof token)
        console.log("토큰 길이:", token.length)

        const saveSuccess = await saveTokenSafely(token, response.data)
        if (saveSuccess) {
          Alert.alert("성공", "로그인 성공!", [
            {
              text: "설문조사 화면으로 이동",
              onPress: () => {
                setUsername("")
                setPassword("")
                // Test 화면으로 직접 이동
                router.push("/UmfrageHome")
              },
            },
          ])
        } else {
          Alert.alert("오류", "토큰 저장에 실패했습니다.")
        }
      } else {
        console.error("❌ 로그인 실패 - 상태 코드:", response.status)
        Alert.alert("실패", `로그인에 실패했습니다. (상태: ${response.status})`)
      }
    } catch (error: any) {
      console.error("=== 로그인 에러 ===")
      console.error("에러 객체:", error)

      let errorMessage = "로그인 요청 실패"

      if (error.response) {
        console.error("응답 에러:", error.response)
        const status = error.response.status
        const responseData = error.response.data

        console.error("에러 상태:", status)
        console.error("에러 데이터:", responseData)

        switch (status) {
          case 400:
            errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요."
            break
          case 401:
            errorMessage = "아이디 또는 비밀번호가 잘못되었습니다."
            break
          case 403:
            errorMessage = "접근이 거부되었습니다."
            break
          case 404:
            errorMessage = "로그인 서비스를 찾을 수 없습니다."
            break
          case 500:
            errorMessage = "서버 내부 오류가 발생했습니다."
            break
          default:
            errorMessage = responseData?.message || `서버 오류 (${status})`
        }
      } else if (error.request) {
        console.error("요청 에러:", error.request)
        errorMessage = "서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요."
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "연결 시간이 초과되었습니다."
      } else {
        console.error("기타 에러:", error.message)
        errorMessage = `요청 오류: ${error.message}`
      }

      Alert.alert("로그인 실패", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStoredToken = async () => {
    try {
      console.log("=== 저장된 모든 토큰 확인 ===")

      const keys = ["accessToken", "jwt_token", "refreshToken", "tokenExpiresAt", "userId", "userInfo"]
      const tokens: Record<string, string | null> = {}

      for (const key of keys) {
        const value = await SecureStore.getItemAsync(key)
        tokens[key] = value
        if (value) {
          console.log(`✅ ${key}:`, value.length > 50 ? value.substring(0, 50) + "..." : value)
        } else {
          console.log(`❌ ${key}: 없음`)
        }
      }

      const accessToken = tokens.accessToken
      const jwtToken = tokens.jwt_token

      if (accessToken || jwtToken) {
        Alert.alert(
          "저장된 토큰",
          `accessToken: ${accessToken ? "✅ 있음" : "❌ 없음"}\njwt_token: ${jwtToken ? "✅ 있음" : "❌ 없음"}\n\nTest 화면에서 인식 가능: ${jwtToken ? "✅ 예" : "❌ 아니오"}`,
        )
      } else {
        Alert.alert("토큰 없음", "저장된 토큰이 없습니다.")
      }
    } catch (error) {
      console.error("토큰 확인 오류:", error)
      Alert.alert("오류", "토큰 확인 중 오류가 발생했습니다.")
    }
  }

  // ✅ 추가: 테스트용 로그인 함수
  const testLogin = async () => {
    Alert.alert("테스트 로그인", "테스트용 계정으로 로그인하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "테스트 로그인",
        onPress: async () => {
          setUsername("test")
          setPassword("test123")
          // 잠시 후 자동 로그인 시도
          setTimeout(() => {
            handleLogin()
          }, 500)
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>로그인</Text>
      <View style={styles.lineTop} />
      <Text style={styles.debugInfo}>API: {API_BASE_URL}/api/users/login</Text>

      <View style={styles.inputGroup}>
        <TouchableOpacity activeOpacity={1} style={styles.inputBox} onPress={() => inputRef1.current?.focus()}>
          <TextInput
            ref={inputRef1}
            style={styles.input}
            placeholder="아이디"
            placeholderTextColor="rgba(0, 0, 0, 0.27)"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup2}>
        <TouchableOpacity activeOpacity={1} style={styles.inputBox2} onPress={() => inputRef2.current?.focus()}>
          <TextInput
            ref={inputRef2}
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="rgba(0, 0, 0, 0.27)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>로그인</Text>
        )}
      </TouchableOpacity>

      {/* 디버그 버튼들 */}
      {(Platform.OS === "ios" || Platform.OS === "android") && (
        <View style={styles.debugContainer}>
          <TouchableOpacity style={styles.debugButton} onPress={checkStoredToken} disabled={isLoading}>
            <Text style={styles.debugButtonText}>토큰 확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.testButton} onPress={testLogin} disabled={isLoading}>
            <Text style={styles.testButtonText}>테스트 로그인</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => router.push("./Signup")} disabled={isLoading}>
        <Text style={[styles.noAccount, isLoading && styles.disabledText]}>계정이 없으신가요?</Text>
      </TouchableOpacity>

      <Text style={styles.findAccount}>아이디 / 비밀번호 찾기</Text>
      <Text style={styles.orText}>혹은</Text>

      <View style={styles.socialIconGoogle}>
        <View style={[styles.vector, { backgroundColor: "#FFC107" }]} />
        <View style={[styles.vector, { backgroundColor: "#FF3D00" }]} />
        <View style={[styles.vector, { backgroundColor: "#4CAF50" }]} />
        <View style={[styles.vector, { backgroundColor: "#1976D2" }]} />
      </View>

      <View style={styles.socialIconKakao}>
        <View style={styles.circleYellow} />
        <View style={styles.maskGroup} />
      </View>

      <View style={styles.socialIconNaver}>
        <View style={styles.circleGreen} />
        <View style={styles.vectorWhite} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 1344,
    height: 2992,
    backgroundColor: "#FFFFFF",
  },
  debugInfo: {
    position: "absolute",
    left: 25,
    top: 110,
    fontSize: 10,
    color: "#999",
  },
  debugContainer: {
    position: "absolute",
    left: 25,
    top: 380,
    flexDirection: "row",
    gap: 8,
  },
  debugButton: {
    width: 80,
    height: 30,
    backgroundColor: "#6c757d",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  debugButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  testButton: {
    width: 80,
    height: 30,
    backgroundColor: "#28a745",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  testButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  loginTitle: {
    position: "absolute",
    width: 79,
    height: 25,
    left: 185,
    top: 57,
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: "center",
    color: "#474747",
  },
  lineTop: {
    position: "absolute",
    width: 393,
    height: 0.5,
    left: 25,
    top: 101,
    borderColor: "#F2F2F2",
    borderWidth: 0.5,
  },
  inputGroup: {
    position: "absolute",
    width: 386,
    height: 54,
    left: 0,
    top: 164,
  },
  inputBox: {
    position: "absolute",
    width: 361,
    height: 54,
    left: 40,
    top: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  inputGroup2: {
    position: "absolute",
    width: 376,
    height: 54,
    left: 10,
    top: 237,
  },
  inputBox2: {
    position: "absolute",
    width: 361,
    height: 54,
    left: 30,
    top: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 18,
    color: "#000",
  },
  loginButton: {
    position: "absolute",
    width: 361,
    height: 54,
    left: 40,
    top: 310,
    backgroundColor: "#007FFF",
    borderRadius: 10.76,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  loginButtonText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: "center",
    color: "#FFFFFF",
  },
  noAccount: {
    position: "absolute",
    width: 192,
    height: 30,
    left: 128,
    top: 435, // ✅ 수정: 디버그 버튼과 겹치지 않도록 위치 조정
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: "center",
    color: "#71A0FF",
  },
  disabledText: {
    color: "#cccccc",
  },
  findAccount: {
    position: "absolute",
    width: 216,
    height: 34,
    left: 116,
    top: 489, // ✅ 수정: 위치 조정
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: "center",
    color: "#71A0FF",
  },
  orText: {
    position: "absolute",
    width: 97,
    height: 37,
    left: 175,
    top: 571, // ✅ 수정: 위치 조정
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: "center",
    color: "#000000",
  },
  socialIconGoogle: {
    position: "absolute",
    width: 63,
    height: 63,
    left: 92,
    top: 637, // ✅ 수정: 위치 조정
    flexDirection: "row",
    flexWrap: "wrap",
  },
  vector: {
    width: 15,
    height: 15,
    margin: 1,
  },
  socialIconKakao: {
    position: "absolute",
    width: 57,
    height: 57,
    left: 193,
    top: 640, // ✅ 수정: 위치 조정
  },
  circleYellow: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    backgroundColor: "#FFE812",
  },
  maskGroup: {
    position: "absolute",
    width: 39.76,
    height: 40.32,
    left: 8.62,
    top: 8.34,
    backgroundColor: "#000000",
  },
  socialIconNaver: {
    position: "absolute",
    width: 57,
    height: 57,
    left: 288,
    top: 640, // ✅ 수정: 위치 조정
  },
  circleGreen: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    backgroundColor: "#1EE000",
  },
  vectorWhite: {
    position: "absolute",
    width: 25,
    height: 25,
    left: 16,
    top: 16,
    backgroundColor: "#FFFFFF",
  },
})

export default LoginScreen
