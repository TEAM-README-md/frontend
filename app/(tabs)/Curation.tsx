import type React from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const Curation: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 상단 프로필 및 알림 */}
      <View style={styles.header}>
        <View style={styles.topRightIcons}>
          <View style={styles.notificationIcon}>
            <Image source={require("../../assets/images/Vector Y.png")} style={styles.bellIcon} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
          <View style={styles.profileImageContainer}>
            <Image source={require("../../assets/images/image.png")} style={styles.profileImage} />
          </View>
        </View>
      </View>

      {/* 메인 콘텐츠 */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 제목 */}
        <Text style={styles.mainTitle}>이런 건 어때요?</Text>

        {/* 검색 아이콘 */}
        <View style={styles.searchIconContainer}>
          <Image source={require("../../assets/images/Vector S.png")} style={styles.searchIcon} />
        </View>

        {/* 메인 이미지 슬라이더 */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageSliderContainer}>
          <View style={styles.slideContainer}>
            <Image source={require("../../assets/images/image 2.png")} style={styles.mainImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageTitle}>요즘 취업, 어떻게 따라가야할까?</Text>
            </View>
          </View>
          <View style={styles.slideContainer}>
            <Image source={require("../../assets/images/image 2.png")} style={styles.mainImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageTitle}>요즘 취업, 어떻게 따라가야할까?</Text>
            </View>
          </View>
        </ScrollView>

        {/* 페이지 인디케이터 */}
        <View style={styles.pageIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* 블로그 섹션 */}
        <Text style={styles.blogTitle}>블로그</Text>

        {/* 블로그 아이템들 */}
        {[1, 2, 3, 4].map((item, index) => (
          <View key={item} style={styles.blogItemContainer}>
            <View style={styles.blogItem}>
              <Text style={styles.blogNumber}>{item}</Text>
              <View style={styles.blogContent}>
                <Text style={styles.blogItemTitle}>요즘 취업, 어떻게 따라가야할까?</Text>
                <Text style={styles.blogDescription}>
                  최근들어, 개발자로 이직하시는 분들이 많아진 사이에 작년에 비해 취업률도 달라졌는데요.. 과연 어떠한
                  부분이 변화하고 있는 지 알아볼까요?
                </Text>
              </View>
              <Image source={require("../../assets/images/image 2.png")} style={styles.blogImage} />
            </View>
            {index < 3 && <View style={styles.separator} />}
          </View>
        ))}

        {/* 더보기 버튼 */}
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>더보기</Text>
        </TouchableOpacity>

        {/* 하단 여백 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        {[
          {
            icon: require("../../assets/images/Group 22.png"),
            text: "큐레이션",
            active: true,
            badge: true,
          },
          {
            icon: require("../../assets/images/Speech.png"),
            text: "학습",
            active: false,
            badge: true,
          },
          {
            icon: require("../../assets/images/home.png"),
            text: "홈",
            active: false,
            badge: false,
            forceBlackText: true, // 새로운 속성 추가
          },
          {
            icon: require("../../assets/images/Vector.png"),
            text: "알림",
            active: false,
            badge: true,
          },
          {
            icon: require("../../assets/images/Person.png"),
            text: "내 정보",
            active: false,
            badge: false,
          },
        ].map((item, index) => (
          <View key={index} style={styles.navItem}>
            <Image source={item.icon} style={[styles.navIcon, item.active ? styles.navIconActive : null]} />
            <Text
              style={item.active ? styles.navTextActive : item.forceBlackText ? styles.navTextBlack : styles.navText}
            >
              {item.text}
            </Text>
            {item.badge && (
              <View style={styles.navBadge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 11,
    right: 11,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationIcon: {
    width: 30,
    height: 30,
    backgroundColor: "#FF9203",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bellIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFFFFF",
  },
  notificationBadge: {
    position: "absolute",
    width: 14,
    height: 14,
    right: -2,
    top: -2,
    backgroundColor: "#FF5353",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImageContainer: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    overflow: "hidden",
  },
  profileImage: {
    width: 41,
    height: 41,
    borderRadius: 300,
  },
  badgeText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 60,
  },
  mainTitle: {
    marginTop: 70,
    marginLeft: 15,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 23,
    lineHeight: 28,
    color: "#000000",
  },
  searchIconContainer: {
    position: "absolute",
    top: 80,
    right: 15,
    zIndex: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  imageSliderContainer: {
    marginTop: 15,
    height: 200,
  },
  slideContainer: {
    width: 350,
    height: 200,
    marginHorizontal: 15,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
  },
  imageTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDDDDD",
  },
  activeDot: {
    backgroundColor: "#0077FF",
  },
  blogTitle: {
    marginTop: 25,
    marginLeft: 15,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 18,
    color: "#000000",
  },
  blogItemContainer: {
    marginTop: 10,
  },
  blogItem: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  blogNumber: {
    width: 20,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    color: "#AAAAAA",
    marginRight: 10,
  },
  blogContent: {
    flex: 1,
    marginRight: 10,
  },
  blogItemTitle: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    color: "#000000",
    marginBottom: 5,
  },
  blogDescription: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
  },
  blogImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginHorizontal: 15,
  },
  moreButton: {
    alignSelf: "center",
    marginTop: 20,
    width: 80,
    height: 30,
    backgroundColor: "#0077FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  moreButtonText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 12,
    color: "#FFFFFF",
  },
  bottomPadding: {
    height: 100,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "relative",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: "contain",
  },
  navIconActive: {
    tintColor: "#0077FF",
  },
  navTextActive: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 12,
    color: "#0077FF",
    textAlign: "center",
  },
  navText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
  },
  navBadge: {
    position: "absolute",
    width: 14,
    height: 14,
    right: 10,
    top: 5,
    backgroundColor: "#FF5353",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  navTextBlack: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
  },
})

export default Curation