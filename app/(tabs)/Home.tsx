import type React from "react"
import { Image, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native"

// 이미지가 없는 경우를 위한 대체 컴포넌트
interface ImagePlaceholderProps {
  style: ViewStyle | ViewStyle[]
  color?: string
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ style, color = "#CCCCCC" }) => (
  <View style={[style, { backgroundColor: color }]} />
)

const Home: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 상단 프로필 및 검색 */}
      <View style={styles.header}>
        <Text style={styles.greetingText}>안녕하세요, H0Y4님!</Text>
        <View style={styles.topRightIcons}>
          <View style={styles.notificationIcon}>
            <Text style={styles.notificationEmoji}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
          {/* 프로필 이미지 - 실제 이미지로 교체 */}
          <View style={styles.profileImageContainer}>
            <Image source={require("../../assets/images/image.png")} style={styles.profileImage} />
          </View>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchText}>검색</Text>
        <View style={styles.searchIcon}>
          <Text style={styles.searchIconText}>🔍</Text>
        </View>
      </View>

      {/* 콘텐츠 카드들 - 가로 스크롤 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.contentCardsContainer}
        contentContainerStyle={styles.contentCardsContent}
      >
        {/* Rank 카드 */}
        <View style={styles.contentCard1}>
          <View style={styles.rankCardContent}>
            <Text style={styles.rankText}>rank</Text>
            <View style={styles.rankArrow}>
              <Text style={styles.arrowText}>▶</Text>
            </View>
          </View>
        </View>

        {/* SW개발 카드 */}
        <View style={styles.contentCard2}>
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>SW개발</Text>
            <Text style={styles.cardSubtitle}>신입사원</Text>
            <Text style={styles.cardSubtitle}>채용</Text>
          </View>
        </View>

        {/* LINE 카드 */}
        <View style={styles.contentCard3}>
          <View style={styles.lineCardContent}>
            <Text style={styles.lineText}>LINE</Text>
            {/* LINE 브라운 베어 이미지 */}
            <View style={styles.brownBearContainer}>
              <Image source={require("../../assets/images/Rectangle 185.png")} style={styles.brownBearImage} />
            </View>
          </View>
        </View>

        {/* 네 번째 카드 */}
        <View style={styles.contentCard4}>
          <View style={styles.cardOverlay}>
            {/* 흰색 캐릭터 이미지 */}
            <View style={styles.whiteCharacterContainer}>
              <Image source={require("../../assets/images/image 36.png")} style={styles.whiteCharacterImage} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI 면접 섹션 */}
      <View style={styles.aiSection}>
        <View style={styles.aiTextContent}>
          <Text style={styles.aiTitle}>AI를 통해</Text>
          <Text style={styles.aiSubtitle}>자신의 면접 실력을 검사해보세요</Text>
          <View style={styles.arrowIcon}>
            <Text style={styles.arrowText}>▶</Text>
          </View>
        </View>
        {/* AI 캐릭터 이미지 */}
        <View style={styles.aiImageContainer}>
          <Image source={require("../../assets/images/image 36.png")} style={styles.aiImage} />
        </View>
      </View>

      {/* 이어서 학습하기 섹션 */}
      <View style={styles.learningSection}>
        <View style={styles.learningSectionHeader}>
          <Text style={styles.learningTitle}>이어서 학습하기</Text>
          <View style={styles.fireIcon}>
            <Text style={styles.fireText}>🔥</Text>
            <Text style={styles.fireNumber}>3</Text>
          </View>
          <View style={styles.questionIcon}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>

        {/* 요일별 진행상황 */}
        <View style={styles.weeklyProgress}>
          <View style={styles.weekDays}>
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <Text key={day} style={[styles.dayText, { left: 35 + index * 52 }]}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.progressCircles}>
            {[0, 1, 2].map((index) => (
              <View key={index} style={[styles.checkmark, { left: 28 + index * 52 }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            ))}
            {[3, 4, 5, 6].map((index) => (
              <View key={index} style={[styles.emptyCircle, { left: 28 + index * 52 }]} />
            ))}
          </View>
        </View>
      </View>

      {/* 통계 섹션 */}
      <View style={styles.statsSection}>
        <View style={styles.statsSectionHeader}>
          <Text style={styles.statsTitle}>내 통계</Text>
          <View style={styles.questionIcon}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>
        <Text style={styles.pronunciationTitle}>내 발음 점수</Text>

        <View style={styles.chartContainer}>
          {/* Y축 라벨들 */}
          {[80, 70, 60, 50].map((value, index) => (
            <Text key={value} style={[styles.yAxisText, { top: 45 + index * 30 }]}>
              {value}
            </Text>
          ))}

          {/* 차트 라인들 */}
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={[styles.chartLine, { top: 50 + index * 30 }]} />
          ))}

          {/* 차트 데이터 포인트들과 연결선 */}
          <View style={styles.chartPath} />
          <View style={styles.chartDot1} />
          <View style={styles.chartDot2} />
          <View style={styles.chartDot3} />

          {/* 점수 텍스트들 */}
          <Text style={styles.scoreText1}>53</Text>
          <Text style={styles.scoreText2}>61</Text>
          <Text style={styles.scoreText3}>72</Text>
        </View>

        <Text style={styles.improvementText}>🔥 점점 좋아지고 있어요!</Text>
      </View>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        {[
          {
            icon: require("../../assets/images/Group 22.png"),
            text: "큐레이션",
            active: false,
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
            active: true,
            badge: false,
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
            <Text style={item.active ? styles.navTextActive : styles.navText}>{item.text}</Text>
            {item.badge && (
              <View style={styles.navBadge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingTop: 43,
    paddingBottom: 10,
  },
  greetingText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 17,
    lineHeight: 21,
    color: "#000000",
  },
  topRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    borderRadius: 20.5,
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
  notificationEmoji: {
    fontSize: 16,
    color: "#FFFFFF",
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
  },
  badgeText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 9,
    color: "#FFFFFF",
  },
  searchBar: {
    marginHorizontal: 11,
    marginVertical: 10,
    height: 35,
    backgroundColor: "#F5F5F5",
    borderRadius: 10.76,
    justifyContent: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 15.59,
    color: "rgba(0, 0, 0, 0.6)",
  },
  searchIcon: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconText: {
    fontSize: 12,
    color: "#363636",
  },
  contentCardsContainer: {
    marginVertical: 10,
  },
  contentCardsContent: {
    paddingLeft: 11,
    paddingRight: 11,
  },
  contentCard1: {
    width: 206,
    height: 152,
    marginRight: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 10.76,
    overflow: "hidden",
  },
  rankCardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  rankText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 24,
    color: "#FFFFFF",
  },
  rankArrow: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  contentCard2: {
    width: 206,
    height: 152,
    marginRight: 10,
    backgroundColor: "#8B4513",
    borderRadius: 10.76,
    overflow: "hidden",
  },
  contentCard3: {
    width: 206,
    height: 152,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    overflow: "hidden",
  },
  contentCard4: {
    width: 206,
    height: 152,
    marginRight: 10,
    backgroundColor: "#0077FF",
    borderRadius: 10.76,
    overflow: "hidden",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  cardTitle: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 16,
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 14,
    color: "#FFFFFF",
  },
  lineCardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  lineText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 16,
    color: "#00C300",
    marginBottom: 10,
  },
  brownBearContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  brownBearImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  whiteCharacterContainer: {
    position: "absolute",
    right: 15,
    top: 15,
    width: 80,
    height: 80,
  },
  whiteCharacterImage: {
    width: 80,
    height: 80,
  },
  aiSection: {
    marginHorizontal: 11,
    marginVertical: 10,
    height: 97,
    backgroundColor: "#0077FF",
    borderRadius: 10.76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  aiSubtitle: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 15,
    color: "#FFFFFF",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  arrowText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  aiImageContainer: {
    width: 102,
    height: 102,
    borderRadius: 5,
    overflow: "hidden",
  },
  aiImage: {
    width: 102,
    height: 102,
    borderRadius: 5,
  },
  learningSection: {
    marginHorizontal: 11,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    padding: 15,
  },
  learningSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  learningTitle: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    color: "#000000",
    flex: 1,
  },
  fireIcon: {
    width: 29,
    height: 29,
    backgroundColor: "#FF6723",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  fireText: {
    fontSize: 12,
  },
  fireNumber: {
    position: "absolute",
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 10,
    color: "#FFFFFF",
  },
  questionIcon: {
    width: 15,
    height: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 7.5,
    justifyContent: "center",
    alignItems: "center",
  },
  questionMark: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 10,
    color: "#666666",
  },
  weeklyProgress: {
    height: 60,
  },
  weekDays: {
    position: "relative",
    height: 20,
  },
  dayText: {
    position: "absolute",
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 10,
    color: "#000000",
  },
  progressCircles: {
    position: "relative",
    height: 25,
    marginTop: 15,
  },
  checkmark: {
    position: "absolute",
    width: 25,
    height: 25,
    backgroundColor: "#4BD37B",
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  emptyCircle: {
    position: "absolute",
    width: 25,
    height: 25,
    backgroundColor: "#D9D9D9",
    borderRadius: 12.5,
  },
  statsSection: {
    marginHorizontal: 11,
    marginVertical: 10,
    paddingBottom: 100,
  },
  statsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statsTitle: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    color: "#000000",
    flex: 1,
  },
  pronunciationTitle: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 15,
    color: "#BFBFBF",
    marginBottom: 15,
  },
  chartContainer: {
    height: 200,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    padding: 20,
    position: "relative",
  },
  chartLine: {
    position: "absolute",
    width: "85%",
    height: 1,
    left: 40,
    backgroundColor: "#D7DDE3",
  },
  yAxisText: {
    position: "absolute",
    left: 10,
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 12,
    color: "#BFBFBF",
  },
  chartPath: {
    position: "absolute",
    left: 71,
    top: 140,
    width: 150,
    height: 60,
    borderTopWidth: 3,
    borderTopColor: "#0077FF",
    borderLeftWidth: 3,
    borderLeftColor: "#0077FF",
    borderRightWidth: 3,
    borderRightColor: "#0077FF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  chartDot1: {
    position: "absolute",
    width: 12,
    height: 12,
    left: 65,
    top: 134,
    backgroundColor: "#0077FF",
    borderRadius: 6,
  },
  chartDot2: {
    position: "absolute",
    width: 12,
    height: 12,
    left: 140,
    top: 104,
    backgroundColor: "#0077FF",
    borderRadius: 6,
  },
  chartDot3: {
    position: "absolute",
    width: 12,
    height: 12,
    left: 215,
    top: 74,
    backgroundColor: "#0077FF",
    borderRadius: 6,
  },
  scoreText1: {
    position: "absolute",
    left: 60,
    top: 150,
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
  },
  scoreText2: {
    position: "absolute",
    left: 135,
    top: 120,
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
  },
  scoreText3: {
    position: "absolute",
    left: 210,
    top: 90,
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 16,
    color: "#000000",
  },
  improvementText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    marginTop: 20,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 79,
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
    fontWeight: "900",
    fontSize: 12,
    color: "#0077FF",
    textAlign: "center",
  },
  navText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
  },
  navBadge: {
    position: "absolute",
    width: 14,
    height: 14,
    right: -7,
    top: -2,
    backgroundColor: "#FF5353",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Home