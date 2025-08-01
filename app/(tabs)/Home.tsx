import { useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const BUTTON_WIDTH = 198
const BUTTON_MARGIN = 15

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

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => router.push("/Question")}
          activeOpacity={0.8}
        >
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

        <View style={{ marginTop: 330, height: 90 }}>
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

        <View style={{ height: 420 }} />
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
                <Image
                  source={item.icon}
                  style={[styles.navIcon, isActive && { tintColor: "#0077FF" }]}
                />
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
    position: "relative",
    width: 447,
    height: 917,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  emptyText: {
    position: "absolute",
    top: 66,
    left: 40,
    fontWeight: "900",
    fontSize: 17,
    lineHeight: 21,
    color: "#000000",
  },
  largeImage: {
    position: "absolute",
    width: 370,
    height: 225,
    left: 35,
    top: 99,
    backgroundColor: "rgba(191,191,191,0.32)",
    borderRadius: 10.76,
    transform: [{ scaleY: -1 }],
  },
  whiteBoxTop: {
    position: "absolute",
    width: 351,
    height: 47,
    left: 44,
    top: 143,
    backgroundColor: "#FFFFFF",
    opacity: 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10.76,
  },
  whiteBoxMiddle: {
    position: "absolute",
    width: 351,
    height: 47,
    left: 45,
    top: 197,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10.76,
  },
  blueBoxBottom: {
    position: "absolute",
    width: 351,
    height: 47,
    left: 44,
    top: 270,
    backgroundColor: "#0077FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10.76,
  },
  testButton: {
    position: "absolute",
    width: 140,
    height: 36,
    left: 153,
    top: 275,
    backgroundColor: "#0077FF",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
  },
  testButtonText: {
    fontWeight: "900",
    fontSize: 12,
    lineHeight: 15,
    color: "#FFFFFF",
    textAlign: "center",
  },
  groupButton: {
    width: BUTTON_WIDTH,
    height: 70,
    marginRight: BUTTON_MARGIN,
    borderRadius: 10.76,
    backgroundColor: "rgba(191,191,191,0.32)",
    justifyContent: "center",
  },
  groupButtonBG: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10.76,
    backgroundColor: "rgba(191,191,191,0.32)",
  },
  groupIcon: {
    position: "absolute",
    width: 40,
    height: 34,
    top: 18,
    left: 15,
  },
  groupButtonText: {
    marginLeft: 62,
    fontWeight: "900",
    fontSize: 16,
    color: "#000000",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    top: 873,
    left: 0,
    right: 0,
    height: 129,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.09,
    shadowRadius: 6.5,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 47,
    height: 62,
    position: "relative",
  },
  navIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  navIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  navText: {
    fontWeight: "900",
    fontSize: 14,
    width: 60,
    color: "#000000",
    textAlign: "center",
  },
  navTextActive: {
    color: "#0077FF",
  },
  navBadge: {
    position: "absolute",
    width: 14,
    height: 14,
    right: -7,
    top: -2,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontWeight: "900",
    fontSize: 9,
    color: "#FFFFFF",
  },
 grayBox: {
    position: "absolute",
    width: 448,
    height: 412,
    left: 0.5,
    top: 459,
    backgroundColor: "rgba(191, 191, 191, 0.32)",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  sliderBar: {
    position: "absolute",
    width: 351,
    height: 10,
    left: 43,
    top: 104,
    backgroundColor: "#B0B0B0",
    borderRadius: 10.76,
  },
  dot1: {
    position: "absolute",
    width: 10,
    height: 10,
    left: 202,
    top: 250,
    backgroundColor: "#BFBFBF",
    borderRadius: 5,
  },
  dot2: {
    position: "absolute",
    width: 10,
    height: 10,
    left: 218,
    top: 250,
    backgroundColor: "#BFBFBF",
    borderRadius: 5,
  },
  dot3: {
    position: "absolute",
    width: 10,
    height: 10,
    left: 234,
    top: 250,
    backgroundColor: "#BFBFBF",
    borderRadius: 5,
  },
  contentBox: {
    position: "absolute",
    width: 395,
    height: 338,
    left: 25,
    top: 479,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
  },
  labelCuration: {
    position: "absolute",
    width: 108,
    height: 38,
    left: 77,
    top: 418,
    fontWeight: "900",
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
  },
  labelWriting: {
    position: "absolute",
    width: 108,
    height: 38,
    left: 251,
    top: 418,
    fontWeight: "900",
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
  },
  underlineCuration: {
    position: "absolute",
    width: 108,
    height: 4,
    left: 75,
    top: 455,
    backgroundColor: "#0077FF",
    borderRadius: 20,
  },
})

export default Home;
