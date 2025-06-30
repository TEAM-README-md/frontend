import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const FinishScreen = () => {
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');

        if (!token) {
          Alert.alert('인증 오류', '로그인이 필요합니다.');
          return;
        }

        setJwtToken(token);
        console.log('✅ JWT Token:', token);
      } catch (error) {
        console.error('❌ 인증 정보 로딩 실패:', error);
        Alert.alert('오류', '인증 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const handleSubmit = async () => {
    if (!jwtToken) {
      Alert.alert('인증 오류', 'JWT 토큰이 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const companyType = await SecureStore.getItemAsync('companyType');
      const userType = await SecureStore.getItemAsync('userType');
      const questionCount = await SecureStore.getItemAsync('questionCount');
      const isChangingJob = await SecureStore.getItemAsync('isChangingJob');

      if (!companyType || !userType || !questionCount || !isChangingJob) {
        Alert.alert('제출 오류', '모든 설문 항목이 응답되었는지 확인해주세요.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        companyType,
        userType,
        questionCount: parseInt(questionCount, 10),
        isChangingJob: isChangingJob === 'true',
      };

      console.log('🚀 제출 시작');
      console.log('🔐 JWT:', jwtToken);
      console.log('📝 제출 데이터:', payload);

      const response = await fetch(
        'https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/survey',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      console.log('📬 서버 응답 상태:', response.status);
      console.log('📨 서버 응답 내용:', responseText);

      if (response.ok) {
        Alert.alert('제출 완료', '설문이 성공적으로 제출되었습니다.');
        await SecureStore.deleteItemAsync('companyType');
        await SecureStore.deleteItemAsync('userType');
        await SecureStore.deleteItemAsync('questionCount');
        await SecureStore.deleteItemAsync('isChangingJob');
        router.push('/Home');
      } else {
        Alert.alert('제출 실패', `오류 코드: ${response.status}\n${responseText || '응답 없음'}`);
      }
    } catch (error) {
      console.error('❌ 제출 중 오류:', error);
      Alert.alert('네트워크 오류', '제출 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/image 60.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        이대로 설문조사를 제출하시겠습니까?{'\n'}
        이후 설정을 통해 이미 제출한 내용을 변경 가능합니다.
      </Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/Count')}
        activeOpacity={0.7}
        disabled={isSubmitting || isLoading}
      >
        <Text style={styles.backText}>이전</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.startButton, (isSubmitting || isLoading) && { opacity: 0.7 }]}
        onPress={handleSubmit}
        activeOpacity={0.7}
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.startText}>제출하기</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 1334,
    height: 2992,
    backgroundColor: '#0077FF',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: 146,
    height: 146,
    top: 293,
    left: 150,
  },
  description: {
    position: 'absolute',
    width: 379,
    height: 58,
    top: 439,
    left: 35,
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 511,
    left: 45,
    width: 165,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    top: 511,
    left: 237,
    width: 165,
    height: 54,
    backgroundColor: '#38BA47',
    borderRadius: 10.76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
