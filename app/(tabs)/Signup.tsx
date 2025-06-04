import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SignupScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    // ✅ 모든 필드 유효성 검사
    if (!username || !nickname || !password || !confirmPassword || !email) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://192.168.36.56:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          nickname,
          password,
          email,
        }),
      });

      if (response.ok) {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          { text: '확인', onPress: () => router.push('/LoginScreen') },
        ]);
      } else {
        const data = await response.json();
        Alert.alert('회원가입 실패', data.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('네트워크 오류', '서버와 연결할 수 없습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="아이디"
          placeholderTextColor="rgba(0, 0, 0, 0.27)"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="이름"
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
        value={nickname}
        onChangeText={setNickname}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="rgba(0, 0, 0, 0.27)"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
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
