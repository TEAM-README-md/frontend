import { useRouter } from 'expo-router'; // ✅ 추가
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignupScreen = () => {
  const router = useRouter(); // ✅ 추가

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      {/* 아이디 */}
      <View style={styles.inputRow}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="아이디" placeholderTextColor="rgba(0, 0, 0, 0.27)" />
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      {/* 닉네임 */}
      <TextInput style={styles.input} placeholder="닉네임" placeholderTextColor="rgba(0, 0, 0, 0.27)" />

      {/* 비밀번호 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
      />

      {/* 비밀번호 확인 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
      />

      {/* 이메일 */}
      <TextInput style={styles.input} placeholder="이메일" placeholderTextColor="rgba(0, 0, 0, 0.27)" />

      {/* 회원가입 버튼 */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push('/UmfrageHome')} // ✅ 경로에 맞게 수정
      >
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    minHeight: 915,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    color: '#474747',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    height: 54,
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 14,
    color: '#7B7B7B',
  },
  signupButton: {
    backgroundColor: '#007FFF',
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  signupButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default SignupScreen;
