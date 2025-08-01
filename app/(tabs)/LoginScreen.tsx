"use client"

import axios from "axios"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width, height } = Dimensions.get("window")

const LoginScreen = () => {
  const inputRef1 = useRef<TextInput>(null)
  const inputRef2 = useRef<TextInput>(null)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE_URL =
    "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app"

  const saveTokenSafely = async (token: any, additionalData?: any): Promise<boolean> => {
    try {
      if (!token) return false
      const tokenString = typeof token === "string" ? token : JSON.stringify(token)
      if (!tokenString || tokenString === "undefined" || tokenString === "null") return false

      await SecureStore.setItemAsync("jwt_token", tokenString)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      await SecureStore.setItemAsync("tokenExpiresAt", expiresAt.toString())

      if (additionalData) {
        const userId = additionalData.userId || additionalData.user_id || additionalData.id
        if (userId) await SecureStore.setItemAsync("userId", userId.toString())

        const refreshToken = additionalData.refreshToken || additionalData.refresh_token
        if (refreshToken) await SecureStore.setItemAsync("refreshToken", refreshToken)

        const userInfo = additionalData.user || additionalData.userInfo
        if (userInfo) await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo))
      }

      const savedToken = await SecureStore.getItemAsync("jwt_token")
      return savedToken === tokenString
    } catch {
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
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { username, password },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      const token = response.data.token || response.data.accessToken || response.data.jwt
      if (!token) {
        Alert.alert("오류", "서버에서 토큰을 받지 못했습니다.")
        return
      }

      const saveSuccess = await saveTokenSafely(token, response.data)
      if (saveSuccess) {
        Alert.alert("성공", "로그인 성공!", [
          {
            text: "설문조사 화면으로 이동",
            onPress: () => {
              setUsername("")
              setPassword("")
              router.push("/UmfrageHome")
            },
          },
        ])
      } else {
        Alert.alert("오류", "토큰 저장에 실패했습니다.")
      }
    } catch (error: any) {
      let errorMessage = "로그인 요청 실패"
      if (error.response) {
        const status = error.response.status
        switch (status) {
          case 400:
            errorMessage = "잘못된 요청입니다."
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
            errorMessage = "서버 오류가 발생했습니다."
            break
        }
      } else {
        errorMessage = error.message || errorMessage
      }

      Alert.alert("로그인 실패", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = () => {
    Alert.alert("테스트 로그인", "테스트 계정으로 로그인하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "테스트 로그인",
        onPress: () => {
          setUsername("test")
          setPassword("test123")
          setTimeout(() => handleLogin(), 500)
        },
      },
    ])
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.loginTitle}>로그인</Text>

      <View style={styles.inputGroup}>
        <TextInput
          ref={inputRef1}
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          ref={inputRef2}
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
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

      <TouchableOpacity onPress={testLogin} disabled={isLoading}>
        <Text style={styles.testLogin}>테스트 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Signup")} disabled={isLoading}>
        <Text style={styles.noAccount}>계정이 없으신가요?</Text>
      </TouchableOpacity>

      <Text style={styles.findAccount}>아이디 / 비밀번호 찾기</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loginTitle: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.05,
  },
  inputGroup: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  input: {
    width: "100%",
    height: height * 0.06,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: width * 0.04,
    backgroundColor: "#fff",
  },
  loginButton: {
    width: "100%",
    height: height * 0.06,
    backgroundColor: "#0077FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.03,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  testLogin: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: "#28a745",
  },
  noAccount: {
  marginTop: height * 0.02,
  fontSize: width * 0.04,
  fontWeight: "500",
  color: "#71A0FF",
  textAlign: "center",
},
  findAccount: {
    position: "absolute",
    top: height * 0.55,
    left: width * 0.22,
    width: width * 0.6,
    height: height * 0.04,
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "#71A0FF",
    textAlign: "center",
  },
})

export default LoginScreen
