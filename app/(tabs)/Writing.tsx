import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ROUTES = ['/Grow', '/Support', '/Strength', '/Experience', '/Problem', '/Aspiration'] as const;
type RoutePath = (typeof ROUTES)[number];
type IconType = 'check' | 'arrow';

interface SectionItem {
  title: string;
  key: string;
  route: RoutePath;
}

interface SectionState {
  title: string;
  active: boolean;
  iconType: IconType;
  route: RoutePath;
}

const bottomNavItems = [
  {
    icon: require('../../assets/images/Group 22.png'),
    text: '큐레이션',
    badge: true,
    route: '/Curation',
  },
  {
    icon: require('../../assets/images/Speech.png'),
    text: '학습',
    badge: true,
    route: '', // 추후 연결할 경우 지정
  },
  {
    icon: require('../../assets/images/home.png'),
    text: '홈',
    badge: false,
    route: '/Home',
  },
  {
    icon: require('../../assets/images/Vector.png'),
    text: '알림',
    badge: true,
    route: '', // 추후 연결할 경우 지정
  },
  {
    icon: require('../../assets/images/Person.png'),
    text: '내 정보',
    badge: false,
    route: '', // 추후 연결할 경우 지정
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [sectionsState, setSectionsState] = useState<SectionState[]>([]);
  const [showResetButton, setShowResetButton] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(1);

  const icons: Record<IconType, any> = {
    check: require('../../assets/images/Check.png'),
    arrow: require('../../assets/images/Vector A.png'),
  };

  const sectionItems: SectionItem[] = [
    { title: '성장과정 작성하기', key: 'growthSaved', route: '/Grow' },
    { title: '지원동기 작성하기', key: 'supportSaved', route: '/Support' },
    { title: '장단점 작성하기', key: 'strengthSaved', route: '/Strength' },
    { title: '직무 관련 경험 작성하기', key: 'experienceSaved', route: '/Experience' },
    { title: '문제 해결 경험 작성하기', key: 'problemSaved', route: '/Problem' },
    { title: '입사 후 포부 작성하기', key: 'aspirationSaved', route: '/Aspiration' },
  ];

  const loadSavedStates = async () => {
    const updatedSections: SectionState[] = await Promise.all(
      sectionItems.map(async (item) => {
        const saved = await SecureStore.getItemAsync(item.key);
        const isActive = saved === 'true';
        return {
          title: item.title,
          active: isActive,
          iconType: isActive ? 'check' : 'arrow',
          route: item.route,
        } satisfies SectionState;
      })
    );
    setSectionsState(updatedSections);
  };

  useFocusEffect(useCallback(() => {
    loadSavedStates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const jwtToken = await SecureStore.getItemAsync('jwt_token');
      if (!jwtToken) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const keys = [
        { storeKey: 'growthContent', field: 'growth' },
        { storeKey: 'supportContent', field: 'support' },
        { storeKey: 'strengthContent', field: 'strength' },
        { storeKey: 'experienceContent', field: 'experience' },
        { storeKey: 'problemContent', field: 'problem' },
        { storeKey: 'aspirationContent', field: 'aspiration' },
      ];

      const requestBody: Record<string, string> = {};
      for (const { storeKey, field } of keys) {
        const value = await SecureStore.getItemAsync(storeKey);
        requestBody[field] = value || '';
      }

      const response = await fetch(
        'https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/cover-letter/final',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        Alert.alert('완료', '최종 저장이 완료되었습니다.');
        setShowResetButton(true);
      } else {
        const errorText = await response.text();
        console.error('저장 실패:', errorText);
        Alert.alert('오류', '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      Alert.alert('에러', '예상치 못한 에러가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const jwtToken = await SecureStore.getItemAsync('jwt_token');
      if (!jwtToken) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const response = await fetch(
        'https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/cover-letter/reset',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        for (const item of sectionItems) {
          await SecureStore.setItemAsync(item.key, 'false');
        }

        const resetSections: SectionState[] = sectionItems.map((item) => ({
          title: item.title,
          active: false,
          iconType: 'arrow',
          route: item.route,
        }));

        setSectionsState(resetSections);
        setShowResetButton(false);
        Alert.alert('초기화 완료', '데이터가 초기화되었습니다.');
      } else {
        Alert.alert('오류', '초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('초기화 중 에러:', error);
      Alert.alert('에러', '초기화 중 문제가 발생했습니다.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>자소서 작성</Text>

      {sectionsState.map(({ title, active, iconType, route }, index) => (
        <View
          key={index}
          style={[styles.sectionButton, active ? styles.activeButton : styles.inactiveButton]}
        >
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionText}>{title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({ pathname: route })}
            style={styles.iconContainer}
          >
            <Image source={icons[iconType]} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      ))}

      {sectionsState.every((section) => section.active) ? (
        !showResetButton ? (
          <Pressable style={styles.resultButton} onPress={handleFinalSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.resultButtonText}>최종 저장</Text>
            )}
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.resetButton} onPress={handleReset} disabled={isResetting}>
              {isResetting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.resetText}>초기화</Text>
              )}
            </Pressable>

            <Pressable style={styles.resultButtonAfter} onPress={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.resultTextAfter}>최종 저장</Text>
              )}
            </Pressable>
          </>
        )
      ) : null}

      <View style={styles.bottomBar}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {bottomNavItems.map((item, index) => {
      const isActive = index === activeNavIndex;

      const handleNavPress = () => {
        setActiveNavIndex(index);
        if (item.route) router.push(item.route as any);
      };

      return (
        <TouchableOpacity key={index} onPress={handleNavPress}>
          <View style={styles.navItemWrapper}>
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <Image
                source={item.icon}
                style={[
                  styles.navIconImage,
                  { tintColor: isActive ? '#0077FF' : '#000000' }, // ✅ 핵심 변경
                ]}
              />
              {item.badge && <View style={styles.badgeBox} />}
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 445,
    height: 917,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 46,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 28,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 60,
    color: '#000000',
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 66,
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  activeButton: { backgroundColor: '#38BA47' },
  inactiveButton: { backgroundColor: '#0077FF' },
  sectionTextContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionText: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconImage: { width: 24, height: 24 },
  resultButton: {
    marginTop: 24,
    height: 48,
    backgroundColor: '#0348DB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resultButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
  resetButton: {
    position: 'absolute',
    width: 165,
    height: 54,
    left: 46,
    top: 678,
    backgroundColor: '#C21010',
    borderRadius: 10.76,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resetText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultButtonAfter: {
    position: 'absolute',
    width: 165,
    height: 54,
    left: 236,
    top: 678,
    backgroundColor: '#0348DB',
    borderRadius: 10.76,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resultTextAfter: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 4,
    right: 0,
    top: 903,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.09,
    shadowRadius: 6.5,
  },
  navItemWrapper: {
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    paddingHorizontal: 10,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  navIconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  navLabel: {
    fontFamily: 'Inter',
    fontSize: 14.66,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
  },
  navLabelActive: {
    color: '#0077FF',
  },
  badgeBox: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
});
