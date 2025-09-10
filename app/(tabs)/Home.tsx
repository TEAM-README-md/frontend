"use client"

import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Dimensions,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const BUTTON_WIDTH = SCREEN_WIDTH * 0.44 // ~198px on 447px screen
const BUTTON_MARGIN = SCREEN_WIDTH * 0.034 // ~15px on 447px screen

const buttons = [
  {
    key: "writing",
    label: "자소서 작성하기",
    icon: require("../../assets/images/image 78.png"),
    route: "/Writing",
  },
  {
    key: "curation",
    label: "큐레이션 보러가기",
    icon: require("../../assets/images/image 10.png"),
    route: "/Curation",
  },
  {
    key: "interview",
    label: "면접 테스트",
    icon: require("../../assets/images/image 90.png"),
    route: "/Question",
  },
] as const

const Home = () => {
  const router = useRouter()
  const scrollRef = useRef<ScrollView>(null)
  const [activeTab, setActiveTab] = useState("홈")

  const repeatedButtons = [...buttons, ...buttons, ...buttons]
  const initialScrollX = (BUTTON_WIDTH + BUTTON_MARGIN) * buttons.length

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: initialScrollX, animated: false })
    }, 10)
  }, [initialScrollX])

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x
    const totalWidth = (BUTTON_WIDTH + BUTTON_MARGIN) * repeatedButtons.length
    const buttonSetWidth = (BUTTON_WIDTH + BUTTON_MARGIN) * buttons.length

    if (x <= buttonSetWidth * 0.5) {
      scrollRef.current?.scrollTo({ x: x + buttonSetWidth, animated: false })
    } else if (x >= totalWidth - buttonSetWidth * 1.5) {
      scrollRef.current?.scrollTo({ x: x - buttonSetWidth, animated: false })
    }
  }

  const handleNavPress = (text: string) => {
    setActiveTab(text)
    if (text === "큐레이션") {
      router.push("/Curation")
    } else if (text === "학습") {
      router.push("/Writing")
    }
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.emptyText}>아직 시작한 면접 테스트가 없어요</Text>

        <View style={styles.largeImage} />
        <View style={styles.whiteBoxTop} />
        <View style={styles.whiteBoxMiddle} />
        <View style={styles.blueBoxBottom} />

        <TouchableOpacity style={styles.testButton} onPress={() => router.push("/Question")} activeOpacity={0.8}>
          <Text style={styles.testButtonText}>면접 테스트 보러 가기</Text>
        </TouchableOpacity>

        <View style={styles.grayBox} />
        <View style={styles.sliderBar} />
        <View style={styles.dot3} />
        <View style={styles.dot2} />
        <View style={styles.dot1} />
        <View style={styles.contentBox} />
        <Text style={styles.labelWriting}>자소서 작성하기</Text>
        <Text style={styles.labelCuration}>큐레이션</Text>
        <View style={styles.underlineCuration} />

        <View style={{ marginTop: SCREEN_HEIGHT * 0.36, height: SCREEN_HEIGHT * 0.098 }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={BUTTON_WIDTH + BUTTON_MARGIN}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: (SCREEN_WIDTH - BUTTON_WIDTH) / 2,
            }}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}
          >
            {repeatedButtons.map((btn, i) => (
              <TouchableOpacity
                key={`${btn.key}-${i}`}
                style={styles.groupButton}
                activeOpacity={0.8}
                onPress={() => router.push(btn.route)}
              >
                <View style={styles.groupButtonBG} />
                <Image source={btn.icon} style={styles.groupIcon} />
                <Text style={styles.groupButtonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: SCREEN_HEIGHT * 0.46 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: require("../../assets/images/Group 22.png"), text: "큐레이션", badge: true },
          { icon: require("../../assets/images/Speech.png"), text: "학습", badge: true },
          { icon: require("../../assets/images/home.png"), text: "홈", badge: false },
          { icon: require("../../assets/images/Vector.png"), text: "알림", badge: true },
          { icon: require("../../assets/images/Person.png"), text: "내 정보", badge: false },
        ].map((item, index) => {
          const isActive = item.text === activeTab
          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => handleNavPress(item.text)}
              activeOpacity={0.8}
            >
              <View style={[styles.navIconWrapper, isActive && { borderColor: "" }]}>
                <Image source={item.icon} style={[styles.navIcon, isActive && { tintColor: "#0077FF" }]} />
              </View>
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.text}</Text>
              {item.badge && (
                <View style={styles.navBadge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  emptyText: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.072, // ~66px on 917px screen
    left: SCREEN_WIDTH * 0.089, // ~40px on 447px screen
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.038, // ~17px on 447px screen
    lineHeight: SCREEN_WIDTH * 0.047, // ~21px on 447px screen
    color: "#000000",
  },
  largeImage: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.828, // ~370px on 447px screen
    height: SCREEN_HEIGHT * 0.245, // ~225px on 917px screen
    left: SCREEN_WIDTH * 0.078, // ~35px on 447px screen
    top: SCREEN_HEIGHT * 0.108, // ~99px on 917px screen
    backgroundColor: "rgba(191,191,191,0.32)",
    borderRadius: SCREEN_WIDTH * 0.024, // ~10.76px on 447px screen
    transform: [{ scaleY: -1 }],
  },
  whiteBoxTop: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.785, // ~351px on 447px screen
    height: SCREEN_HEIGHT * 0.051, // ~47px on 917px screen
    left: SCREEN_WIDTH * 0.098, // ~44px on 447px screen
    top: SCREEN_HEIGHT * 0.156, // ~143px on 917px screen
    backgroundColor: "#FFFFFF",
    opacity: 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: SCREEN_WIDTH * 0.024,
  },
  whiteBoxMiddle: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.785,
    height: SCREEN_HEIGHT * 0.051,
    left: SCREEN_WIDTH * 0.101, // ~45px on 447px screen
    top: SCREEN_HEIGHT * 0.215, // ~197px on 917px screen
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: SCREEN_WIDTH * 0.024,
  },
  blueBoxBottom: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.785,
    height: SCREEN_HEIGHT * 0.051,
    left: SCREEN_WIDTH * 0.098,
    top: SCREEN_HEIGHT * 0.294, // ~270px on 917px screen
    backgroundColor: "#0077FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: SCREEN_WIDTH * 0.024,
  },
  testButton: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.313, // ~140px on 447px screen
    height: SCREEN_HEIGHT * 0.039, // ~36px on 917px screen
    left: SCREEN_WIDTH * 0.342, // ~153px on 447px screen
    top: SCREEN_HEIGHT * 0.3, // ~275px on 917px screen
    backgroundColor: "#0077FF",
    borderRadius: SCREEN_WIDTH * 0.024,
    justifyContent: "center",
    alignItems: "center",
  },
  testButtonText: {
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.027, // ~12px on 447px screen
    lineHeight: SCREEN_WIDTH * 0.034, // ~15px on 447px screen
    color: "#FFFFFF",
    textAlign: "center",
  },
  groupButton: {
    width: BUTTON_WIDTH,
    height: SCREEN_HEIGHT * 0.076, // ~70px on 917px screen
    marginRight: BUTTON_MARGIN,
    borderRadius: SCREEN_WIDTH * 0.024,
    backgroundColor: "rgba(191,191,191,0.32)",
    justifyContent: "center",
  },
  groupButtonBG: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SCREEN_WIDTH * 0.024,
    backgroundColor: "rgba(191,191,191,0.32)",
  },
  groupIcon: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.089, // ~40px on 447px screen
    height: SCREEN_HEIGHT * 0.037, // ~34px on 917px screen
    top: SCREEN_HEIGHT * 0.02, // ~18px on 917px screen
    left: SCREEN_WIDTH * 0.034, // ~15px on 447px screen
  },
  groupButtonText: {
    marginLeft: SCREEN_WIDTH * 0.139, // ~62px on 447px screen
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.036, // ~16px on 447px screen
    color: "#000000",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.141, // ~129px on 917px screen
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.09,
    shadowRadius: 6.5,
    elevation: 10,
    borderTopLeftRadius: SCREEN_WIDTH * 0.045, // ~20px on 447px screen
    borderTopRightRadius: SCREEN_WIDTH * 0.045,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.105, // ~47px on 447px screen
    height: SCREEN_HEIGHT * 0.068, // ~62px on 917px screen
    position: "relative",
  },
  navIconWrapper: {
    width: SCREEN_WIDTH * 0.072, // ~32px on 447px screen
    height: SCREEN_WIDTH * 0.072,
    borderRadius: SCREEN_WIDTH * 0.036, // ~16px on 447px screen
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  navIcon: {
    width: SCREEN_WIDTH * 0.072,
    height: SCREEN_WIDTH * 0.072,
    resizeMode: "contain",
  },
  navText: {
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.031, // ~14px on 447px screen
    width: SCREEN_WIDTH * 0.134, // ~60px on 447px screen
    color: "#000000",
    textAlign: "center",
  },
  navTextActive: {
    color: "#0077FF",
  },
  navBadge: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.031, // ~14px on 447px screen
    height: SCREEN_WIDTH * 0.031,
    right: SCREEN_WIDTH * -0.016, // ~-7px on 447px screen
    top: SCREEN_HEIGHT * -0.002, // ~-2px on 917px screen
    borderRadius: SCREEN_WIDTH * 0.016, // ~7px on 447px screen
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.02, // ~9px on 447px screen
    color: "#FFFFFF",
  },
  grayBox: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.002, // ~448px on 447px screen
    height: SCREEN_HEIGHT * 0.449, // ~412px on 917px screen
    left: SCREEN_WIDTH * 0.001, // ~0.5px on 447px screen
    top: SCREEN_HEIGHT * 0.5, // ~459px on 917px screen
    backgroundColor: "rgba(191, 191, 191, 0.32)",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  sliderBar: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.785, // ~351px on 447px screen
    height: SCREEN_HEIGHT * 0.011, // ~10px on 917px screen
    left: SCREEN_WIDTH * 0.096, // ~43px on 447px screen
    top: SCREEN_HEIGHT * 0.113, // ~104px on 917px screen
    backgroundColor: "#B0B0B0",
    borderRadius: SCREEN_WIDTH * 0.024,
  },
  dot1: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.022, // ~10px on 447px screen
    height: SCREEN_WIDTH * 0.022,
    left: SCREEN_WIDTH * 0.452, // ~202px on 447px screen
    top: SCREEN_HEIGHT * 0.273, // ~250px on 917px screen
    backgroundColor: "#BFBFBF",
    borderRadius: SCREEN_WIDTH * 0.011, // ~5px on 447px screen
  },
  dot2: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.022,
    height: SCREEN_WIDTH * 0.022,
    left: SCREEN_WIDTH * 0.488, // ~218px on 447px screen
    top: SCREEN_HEIGHT * 0.273,
    backgroundColor: "#BFBFBF",
    borderRadius: SCREEN_WIDTH * 0.011,
  },
  dot3: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.022,
    height: SCREEN_WIDTH * 0.022,
    left: SCREEN_WIDTH * 0.524, // ~234px on 447px screen
    top: SCREEN_HEIGHT * 0.273,
    backgroundColor: "#BFBFBF",
    borderRadius: SCREEN_WIDTH * 0.011,
  },
  contentBox: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.884, // ~395px on 447px screen
    height: SCREEN_HEIGHT * 0.369, // ~338px on 917px screen
    left: SCREEN_WIDTH * 0.056, // ~25px on 447px screen
    top: SCREEN_HEIGHT * 0.522, // ~479px on 917px screen
    backgroundColor: "#FFFFFF",
    borderRadius: SCREEN_WIDTH * 0.024,
  },
  labelCuration: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.242, // ~108px on 447px screen
    height: SCREEN_HEIGHT * 0.041, // ~38px on 917px screen
    left: SCREEN_WIDTH * 0.172, // ~77px on 447px screen
    top: SCREEN_HEIGHT * 0.456, // ~418px on 917px screen
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.036, // ~16px on 447px screen
    color: "#000000",
    textAlign: "center",
  },
  labelWriting: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.242,
    height: SCREEN_HEIGHT * 0.041,
    left: SCREEN_WIDTH * 0.562, // ~251px on 447px screen
    top: SCREEN_HEIGHT * 0.456,
    fontWeight: "900",
    fontSize: SCREEN_WIDTH * 0.036,
    color: "#000000",
    textAlign: "center",
  },
  underlineCuration: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.242,
    height: SCREEN_HEIGHT * 0.004, // ~4px on 917px screen
    left: SCREEN_WIDTH * 0.168, // ~75px on 447px screen
    top: SCREEN_HEIGHT * 0.496, // ~455px on 917px screen
    backgroundColor: "#0077FF",
    borderRadius: SCREEN_WIDTH * 0.045, // ~20px on 447px screen
  },
})

export default Home
