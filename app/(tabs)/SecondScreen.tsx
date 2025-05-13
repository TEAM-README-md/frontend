import { router } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  // useRef에 TextInput 타입을 명시적으로 지정
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>로그인</Text>
      <View style={styles.lineTop} />

      {/* 아이디 입력 */}
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
          />
        </TouchableOpacity>
      </View>

      {/* 비밀번호 입력 */}
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
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./Signup')}>
        <Text style={styles.noAccount}>계정이 없으신가요?</Text>
      </TouchableOpacity>
      <Text style={styles.findAccount}>아이디 / 비밀번호 찾기</Text>
      <Text style={styles.orText}>혹은</Text>

      {/* 소셜 로그인 아이콘들 */}
      <View style={styles.socialIconGoogle}>
        <View style={[styles.vector, { backgroundColor: '#FFC107' }]} />
        <View style={[styles.vector, { backgroundColor: '#FF3D00' }]} />
        <View style={[styles.vector, { backgroundColor: '#4CAF50' }]} />
        <View style={[styles.vector, { backgroundColor: '#1976D2' }]} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1344,
    height: 2992,
    backgroundColor: '#FFFFFF',
  },
  loginTitle: {
    position: 'absolute',
    width: 79,
    height: 25,
    left: 185,
    top: 57,
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: 'center',
    color: '#474747',
  },
  lineTop: {
    position: 'absolute',
    width: 393,
    height: 0.5,
    left: 25,
    top: 101,
    borderColor: '#F2F2F2',
    borderWidth: 0.5,
  },
  inputGroup: {
    position: 'absolute',
    width: 386,
    height: 54,
    left: 0,
    top: 164,
  },
  inputBox: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 40,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  inputGroup2: {
    position: 'absolute',
    width: 376,
    height: 54,
    left: 10,
    top: 237,
  },
  inputBox2: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 30,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 18,
    color: '#000',
  },
  loginButton: {
    position: 'absolute',
    width: 361,
    height: 54,
    left: 40,
    top: 310,
    backgroundColor: '#007FFF',
    borderRadius: 10.76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  noAccount: {
    position: 'absolute',
    width: 192,
    height: 30,
    left: 128,
    top: 405,
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: 'center',
    color: '#71A0FF',
  },
  findAccount: {
    position: 'absolute',
    width: 216,
    height: 34,
    left: 116,
    top: 459,
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: 'center',
    color: '#71A0FF',
  },
  orText: {
    position: 'absolute',
    width: 97,
    height: 37,
    left: 175,
    top: 541,
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 21.53,
    lineHeight: 26,
    textAlign: 'center',
    color: '#000000',
  },
  socialIconGoogle: {
    position: 'absolute',
    width: 63,
    height: 63,
    left: 92,
    top: 607,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vector: {
    width: 15,
    height: 15,
    margin: 1,
  },
  socialIconKakao: {
    position: 'absolute',
    width: 57,
    height: 57,
    left: 193,
    top: 610,
  },
  circleYellow: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    backgroundColor: '#FFE812',
  },
  maskGroup: {
    position: 'absolute',
    width: 39.76,
    height: 40.32,
    left: 8.62,
    top: 8.34,
    backgroundColor: '#000000',
  },
  socialIconNaver: {
    position: 'absolute',
    width: 57,
    height: 57,
    left: 288,
    top: 610,
  },
  circleGreen: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    backgroundColor: '#1EE000',
  },
  vectorWhite: {
    position: 'absolute',
    width: 25,
    height: 25,
    left: 16,
    top: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default LoginScreen;
