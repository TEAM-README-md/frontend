import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

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

export default function HomeScreen() {
  const router = useRouter();
  const [sectionsState, setSectionsState] = useState<SectionState[]>([]);

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

  useFocusEffect(
    useCallback(() => {
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

      loadSavedStates();
    }, [])
  );

  const handleFinalSubmit = async () => {
    try {
      const jwtToken = await SecureStore.getItemAsync("jwtToken");
      console.log("jwtToken 확인:", jwtToken);

      if (!jwtToken || jwtToken.trim() === "") {
        Alert.alert("오류", "로그인이 필요합니다.");
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
        "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/cover-letter/final",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        Alert.alert("완료", "최종 저장이 완료되었습니다.");
      } else {
        const errorText = await response.text();
        console.error("저장 실패:", errorText);
        Alert.alert("오류", "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      Alert.alert("에러", "예상치 못한 에러가 발생했습니다.");
    }
  };

  const bottomNavItems = [
    {
      icon: require('../../assets/images/Group 22.png'),
      text: '큐레이션',
      active: false,
      badge: true,
    },
    {
      icon: require('../../assets/images/Speech.png'),
      text: '학습',
      active: true,
      badge: true,
    },
    {
      icon: require('../../assets/images/home.png'),
      text: '홈',
      active: false,
      badge: false,
    },
    {
      icon: require('../../assets/images/Vector.png'),
      text: '알림',
      active: false,
      badge: true,
    },
    {
      icon: require('../../assets/images/Person.png'),
      text: '내 정보',
      active: false,
      badge: false,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>자소서 작성</Text>

      {sectionsState.map(({ title, active, iconType, route }, index) => (
        <Pressable
          key={index}
          style={[styles.sectionButton, active ? styles.activeButton : styles.inactiveButton]}
          onPress={() => router.push({ pathname: route })}
        >
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionText}>{title}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={icons[iconType]} style={styles.iconImage} resizeMode="contain" />
          </View>
        </Pressable>
      ))}

      <Pressable style={styles.resultButton} onPress={handleFinalSubmit}>
        <Text style={styles.resultButtonText}>최종 저장</Text>
      </Pressable>

      <View style={styles.bottomNav}>
        {bottomNavItems.map(({ icon, text, active, badge }, index) => (
          <View key={index} style={styles.navItemContainer}>
            <View>
              <Image source={icon} style={[styles.navIcon, active && { tintColor: '#0077FF' }]} />
              {badge && <View style={styles.badge} />}
            </View>
            <Text style={[styles.navItemText, active && styles.navItemActive]}>{text}</Text>
          </View>
        ))}
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
  activeButton: {
    backgroundColor: '#38BA47',
  },
  inactiveButton: {
    backgroundColor: '#0077FF',
  },
  sectionTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
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
  resultButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: 412,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
    borderTopWidth: 0,
    borderColor: 'transparent',
  },
  navItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  navItemText: {
    fontFamily: 'Inter',
    fontWeight: '900',
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  navItemActive: {
    color: '#0077FF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
