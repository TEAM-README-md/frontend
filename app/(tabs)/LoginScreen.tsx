"use client"

import axios from "axios"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const LoginScreen = () => {
  const inputRef1 = useRef<TextInput>(null)
  const inputRef2 = useRef<TextInput>(null)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE_URL =
    "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app"

  const saveTokenSafely = async (token: any): Promise<boolean> => {
    try {
      if (!token) return false
      const tokenString =
        typeof token === "string" ? token : JSON.stringify(token)
      if (!tokenString || tokenString === "undefined" || tokenString === "null")
        return false

      await SecureStore.setItemAsync("jwt_token", tokenString)
      return true
    } catch (error) {
      console.error("토큰 저장 실패:", error)
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

      if (response.status === 200 || response.status === 201) {
        const token =
          response.data.token ||
          response.data.accessToken ||
          response.data.jwt

        if (!token) {
          Alert.alert("오류", "서버에서 토큰을 받지 못했습니다.")
          return
        }

        const saveSuccess = await saveTokenSafely(token)
        if (saveSuccess) {
          Alert.alert("성공", "로그인 성공!", [
            {
              text: "확인",
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
      } else {
        Alert.alert("실패", "로그인에 실패했습니다.")
      }
    } catch (error: any) {
      let errorMessage = "로그인 요청 실패"

      if (error.response) {
        const status = error.response.status
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
            errorMessage =
              error.response.data?.message || `서버 오류 (${status})`
        }
      } else if (error.request) {
        errorMessage = "서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요."
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "연결 시간이 초과되었습니다."
      } else {
        errorMessage = `요청 오류: ${error.message}`
      }

      Alert.alert("로그인 실패", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const checkStoredToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt_token")
      if (token) {
        Alert.alert("저장된 토큰", `토큰: ${token.substring(0, 50)}...`)
      } else {
        Alert.alert("토큰 없음", "저장된 토큰이 없습니다.")
      }
    } catch (error) {
      console.error("토큰 확인 오류:", error)
      Alert.alert("오류", "토큰 확인 중 오류가 발생했습니다.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>로그인</Text>
      <View style={styles.lineTop} />
      <Text style={styles.debugInfo}>API: {API_BASE_URL}</Text>

      <View style={styles.inputGroup}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.inputBox}
          onPress={() => inputRef1.current?.focus()}
        >
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
        <TouchableOpacity
          activeOpacity={1}
          style={styles.inputBox2}
          onPress={() => inputRef2.current?.focus()}
        >
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

      {Platform.OS === "ios" || Platform.OS === "android"
        ? __DEV__ && (
            <TouchableOpacity
              style={styles.debugButton}
              onPress={checkStoredToken}
              disabled={isLoading}
            >
              <Text style={styles.debugButtonText}>토큰 확인</Text>
            </TouchableOpacity>
          )
        : null}

      <TouchableOpacity
        onPress={() => router.push("./Signup")}
        disabled={isLoading}
      >
        <Text style={[styles.noAccount, isLoading && styles.disabledText]}>
          계정이 없으신가요?
        </Text>
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
  debugButton: {
    position: "absolute",
    width: 100,
    height: 30,
    left: 25,
    top: 380,
    backgroundColor: "#6c757d",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  debugButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
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
    top: 405,
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
    top: 459,
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
    top: 541,
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
    top: 607,
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
    top: 610,
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
    top: 610,
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
