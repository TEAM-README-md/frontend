import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
        'http://3.34.53.204:8080/api/survey',
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
        router.push('/FinishScreen');
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
        이대로 설문조사를 제출하시겠습니까?{"\n"}
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
    flex: 1,
    backgroundColor: '#0077FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  description: {
    width: SCREEN_WIDTH * 0.9,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: SCREEN_WIDTH * 0.04,
    lineHeight: SCREEN_WIDTH * 0.06,
    color: '#FFFFFF',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  backButton: {
    width: SCREEN_WIDTH * 0.4,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 10.76,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  startButton: {
    width: SCREEN_WIDTH * 0.4,
    height: 54,
    backgroundColor: '#38BA47',
    borderRadius: 10.76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
