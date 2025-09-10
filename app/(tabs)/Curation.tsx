"use client"

import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

interface NewsItem {
  title: string
  description: string
  link?: string
  publishedAt?: string
  author?: string
}

interface VideoItem {
  title: string
  thumbnail: string
  link: string
  viewCount: number
  likes: number
  publishedAt: string
}

interface BlogItem {
  title: string
  subtitle: string
  description: string
  link?: string
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100
const fontSize = (size: number) => (SCREEN_WIDTH / 375) * size // Base width 375px

const Curation: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("큐레이션")
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [videoList, setVideoList] = useState<VideoItem[]>([])
  const [blogList, setBlogList] = useState<BlogItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [loadingBlogs, setLoadingBlogs] = useState(true)

  const [visibleNews, setVisibleNews] = useState(4)
  const [visibleVideoCount, setVisibleVideoCount] = useState(4)
  const [visibleBlogCount, setVisibleBlogCount] = useState(4)

  const [videoSortOrder, setVideoSortOrder] = useState<"latest" | "popular">("latest")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("")

  const [imageIndex, setImageIndex] = useState(0)
  const imageScrollRef = useRef<ScrollView>(null)
  const horizontalScrollRef = useRef<ScrollView>(null)

  const handleTabPress = (label: string) => {
    setActiveTab(label)
    if (label === "홈") router.push("/Home")
    else if (label === "학습") router.push("/Writing")
  }

  const fetchNews = useCallback(async (keyword = "") => {
    setLoadingNews(true)
    try {
      const defaultKeyword = keyword || "취업"
      const encodedKeyword = encodeURIComponent(defaultKeyword)
      const url = `http://3.34.53.204:8080/api/curation/news?keywords=${encodedKeyword}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`서버 오류: ${response.status}`)
      const text = await response.text()
      if (!text) throw new Error("빈 응답입니다.")
      const json = JSON.parse(text)
      if (Array.isArray(json.news)) setNewsList(json.news)
      else if (Array.isArray(json)) setNewsList(json)
    } catch (error) {
      console.error("❌ 뉴스 가져오기 실패:", error)
      setNewsList([])
    } finally {
      setLoadingNews(false)
    }
  }, [])

  const fetchVideos = useCallback(async (keyword = "") => {
    setLoadingVideos(true)
    try {
      const defaultKeyword = keyword || "이력서,면접,취업"
      const encodedKeyword = encodeURIComponent(defaultKeyword)
      const url = `http://3.34.53.204:8080/api/curation/videos?keywords=${encodedKeyword}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`영상 서버 오류: ${response.status}`)
      const json = await response.json()
      if (Array.isArray(json)) {
        const enhancedVideos = json.map((video, index) => ({
          ...video,
          viewCount: Math.floor(Math.random() * 100000) + 1000,
          likes: Math.floor(Math.random() * 50000) + 500,
          publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }))
        setVideoList(enhancedVideos)
      }
    } catch (error) {
      console.error("❌ 영상 가져오기 실패:", error)
      setVideoList([])
    } finally {
      setLoadingVideos(false)
    }
  }, [])

  const fetchBlogs = useCallback(async (keyword = "") => {
    setLoadingBlogs(true)
    try {
      const defaultKeyword = keyword || "취업 면접"
      const encodedKeyword = encodeURIComponent(defaultKeyword)
      const url = `http://3.34.53.204:8080/api/curation/blogs?keywords=${encodedKeyword}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`블로그 서버 오류: ${response.status}`)
      const json = await response.json()
      if (Array.isArray(json)) setBlogList(json)
    } catch (error) {
      console.error("❌ 블로그 가져오기 실패:", error)
      setBlogList([])
    } finally {
      setLoadingBlogs(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchKeyword])

  useEffect(() => {
    fetchNews(debouncedSearchKeyword)
    fetchVideos(debouncedSearchKeyword)
    fetchBlogs(debouncedSearchKeyword)
  }, [fetchNews, fetchVideos, fetchBlogs, debouncedSearchKeyword])

  useEffect(() => {
    if (debouncedSearchKeyword.trim()) {
      fetchNews(debouncedSearchKeyword)
      fetchVideos(debouncedSearchKeyword)
      fetchBlogs(debouncedSearchKeyword)
      setVisibleNews(4)
      setVisibleVideoCount(4)
      setVisibleBlogCount(4)
    } else {
      fetchNews("")
      fetchVideos("")
      fetchBlogs("")
    }
  }, [debouncedSearchKeyword, fetchNews, fetchVideos, fetchBlogs])

  useFocusEffect(
    React.useCallback(() => {
      setVisibleNews(4)
      setVisibleVideoCount(4)
      setVisibleBlogCount(4)
      setImageIndex(0)

      imageScrollRef.current?.scrollTo({ x: 0, animated: false })
      horizontalScrollRef.current?.scrollTo({ x: 0, animated: false })

      return () => {}
    }, []),
  )

  const handleLoadMoreNews = () => setVisibleNews((prev) => prev + 4)
  const handleLoadMoreVideos = () => setVisibleVideoCount((prev) => prev + 4)
  const handleLoadMoreBlogs = () => {
    setVisibleBlogCount((prev) => prev + 4)
    horizontalScrollRef.current?.scrollTo({ x: SCREEN_WIDTH * 2, animated: true })
  }

  const onScrollImage = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setImageIndex(index)
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return Math.floor(count / 1000000) + "M"
    } else if (count >= 1000) {
      return Math.floor(count / 1000) + "k"
    }
    return count.toString()
  }

  const getSortedVideos = () => {
    const videos = [...videoList]
    if (videoSortOrder === "popular") {
      return videos.sort((a, b) => b.viewCount - a.viewCount)
    } else {
      return videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }
  }

  const toggleSortOrder = () => {
    setVideoSortOrder((prev) => (prev === "latest" ? "popular" : "latest"))
  }

  const getFilteredNews = () => {
    return newsList
  }

  const getFilteredVideos = () => {
    return getSortedVideos()
  }

  const getFilteredBlogs = () => {
    return blogList
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled>
        <Text style={styles.title}>오늘의 큐레이션</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="키워드를 입력해주세요( 예시 : 게임, 기술, 여행, 요리 등)"
            placeholderTextColor="#676767"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
          <Image source={require("../../assets/images/Vector S.png")} style={styles.searchIcon} />
        </View>

        <ScrollView
          ref={imageScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScrollImage}
          scrollEventThrottle={16}
          style={styles.imageSlider}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Image key={i} source={require("../../assets/images/image 2.png")} style={styles.slideImage} />
          ))}
        </ScrollView>

        <View style={styles.dotContainer}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.dot, i === imageIndex && styles.activeDot]} />
          ))}
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalSlider}
          nestedScrollEnabled
          ref={horizontalScrollRef}
        >
          <ScrollView style={styles.page} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View style={styles.newsContainer}>
              <Text style={styles.newsTitle}>뉴스</Text>

              {loadingNews ? (
                <ActivityIndicator style={{ marginTop: hp(2.5) }} size="small" color="#0077FF" />
              ) : getFilteredNews().length > 0 ? (
                getFilteredNews()
                  .slice(0, visibleNews)
                  .map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.newsCard}
                      onPress={() => item.link && Linking.openURL(item.link!)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.newsTextBox}>
                        <Text style={styles.newsHeading} numberOfLines={1}>
                          {item.title || "제목 없음"}
                        </Text>
                        <Text style={styles.newsDescription} numberOfLines={2}>
                          {item.description || "설명 없음"}
                        </Text>
                      </View>
                      <Image source={require("../../assets/images/image 2.png")} style={styles.newsImage} />
                    </TouchableOpacity>
                  ))
              ) : (
                <Text style={{ marginLeft: wp(5), color: "#888" }}>
                  {searchKeyword ? "검색 결과가 없습니다." : "뉴스가 없습니다."}
                </Text>
              )}

              {!loadingNews && visibleNews < getFilteredNews().length && (
                <TouchableOpacity style={styles.newsMoreButton} onPress={handleLoadMoreNews}>
                  <Text style={styles.newsMoreText}>더보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <ScrollView style={styles.page} nestedScrollEnabled showsVerticalScrollIndicator={true}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoTitle}>영상</Text>
              <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
                <Text style={styles.sortButtonText}>{videoSortOrder === "latest" ? "최신순" : "인기순"}</Text>
                <View style={styles.sortArrow} />
              </TouchableOpacity>
            </View>

            {loadingVideos ? (
              <ActivityIndicator style={{ marginTop: hp(2.5) }} size="small" color="#0077FF" />
            ) : (
              getFilteredVideos()
                .slice(0, visibleVideoCount)
                .map((video, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.videoCard}
                    onPress={() => Linking.openURL(video.link)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoText}>{video.title}</Text>
                      <View style={styles.videoStats}>
                        <View style={styles.statItem}>
                          <Image source={require("../../assets/images/eye.png")} style={styles.eyeIcon} />
                          <Text style={styles.statText}>{formatCount(video.viewCount)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Image source={require("../../assets/images/like.png")} style={styles.heartIcon} />
                          <Text style={styles.statText}>{formatCount(video.likes)}</Text>
                        </View>
                      </View>
                    </View>
                    <Image source={{ uri: video.thumbnail }} style={styles.videoImage} />
                  </TouchableOpacity>
                ))
            )}

            {!loadingVideos && visibleVideoCount < getFilteredVideos().length && (
              <TouchableOpacity style={styles.moreButton} onPress={handleLoadMoreVideos}>
                <Text style={styles.moreText}>더보기</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <ScrollView style={styles.page} nestedScrollEnabled showsVerticalScrollIndicator={true}>
            <View style={styles.blogContainer}>
              <Text style={styles.blogTitle}>블로그</Text>
              {loadingBlogs ? (
                <ActivityIndicator style={{ marginTop: hp(2.5) }} size="small" color="#0077FF" />
              ) : getFilteredBlogs().length > 0 ? (
                getFilteredBlogs()
                  .slice(0, visibleBlogCount)
                  .map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.blogCard}
                      onPress={() => item.link && Linking.openURL(item.link)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.blogHeading}>{item.title}</Text>
                    </TouchableOpacity>
                  ))
              ) : (
                <Text style={{ marginLeft: wp(5), color: "#888" }}>
                  {searchKeyword ? "검색 결과가 없습니다." : "블로그가 없습니다."}
                </Text>
              )}
              {!loadingBlogs && visibleBlogCount < getFilteredBlogs().length && (
                <TouchableOpacity style={styles.blogMoreButton} onPress={handleLoadMoreBlogs}>
                  <Text style={styles.blogMoreText}>더보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomNav}>
        {["큐레이션", "학습", "홈", "알림", "내 정보"].map((label, i) => {
          const isActive = activeTab === label
          const icons = [
            require("../../assets/images/Group 22.png"),
            require("../../assets/images/Speech.png"),
            require("../../assets/images/home.png"),
            require("../../assets/images/Vector.png"),
            require("../../assets/images/Person.png"),
          ]
          return (
            <TouchableOpacity key={i} style={styles.navItem} onPress={() => handleTabPress(label)} activeOpacity={0.8}>
              <View style={[styles.navIconWrapper, isActive && { borderColor: "#0077FF" }]}>
                <Image
                  source={icons[i]}
                  style={[styles.navIcon, isActive && { tintColor: "#0077FF" }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.navText, isActive && { color: "#0077FF" }]}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: hp(12), paddingTop: hp(6) },
  title: {
    marginLeft: wp(5),
    fontWeight: "900",
    fontSize: fontSize(23),
    color: "#000",
    marginBottom: hp(2),
  },
  searchContainer: {
    position: "relative",
    marginHorizontal: wp(1.5),
    marginBottom: hp(2),
  },
  searchInput: {
    width: wp(95),
    height: hp(5),
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    fontSize: fontSize(9),
    fontFamily: "Inter",
    fontWeight: "400",
    color: "#676767",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    position: "absolute",
    right: wp(4),
    top: "50%",
    marginTop: -wp(2),
    width: wp(4),
    height: wp(4),
    resizeMode: "contain",
  },
  imageSlider: { marginBottom: hp(1.5) },
  slideImage: { width: SCREEN_WIDTH, height: hp(25), resizeMode: "cover" },
  dotContainer: { flexDirection: "row", justifyContent: "center", marginBottom: hp(2.5) },
  dot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: "#BFBFBF",
    marginHorizontal: wp(1),
  },
  activeDot: { backgroundColor: "#0077FF" },
  horizontalSlider: { minHeight: hp(50) },
  page: { width: SCREEN_WIDTH, paddingHorizontal: wp(6), flex: 1 },

  newsContainer: {
    backgroundColor: "rgba(176,176,176,0.37)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.28)",
    borderRadius: wp(2.5),
    padding: wp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  newsTitle: { fontWeight: "900", fontSize: fontSize(17), color: "#000", marginBottom: hp(1) },
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(129,126,126,0.87)",
    borderRadius: wp(2.5),
    marginBottom: hp(2),
    padding: wp(3),
  },
  newsTextBox: { flex: 1, marginRight: wp(3) },
  newsHeading: { fontWeight: "400", fontSize: fontSize(16), color: "#FFFFFF", marginBottom: hp(0.8) },
  newsDescription: { fontWeight: "400", fontSize: fontSize(10), lineHeight: fontSize(12), color: "#FFFFFF" },
  newsImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  newsMoreButton: {
    alignSelf: "center",
    width: wp(15),
    height: hp(3.5),
    backgroundColor: "#0077FF",
    borderRadius: wp(2.5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  newsMoreText: { fontWeight: "900", fontSize: fontSize(10), color: "#FFFFFF" },

  videoTitle: {
    fontWeight: "900",
    fontSize: fontSize(20),
    color: "#000",
  },
  videoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(129, 126, 126, 0.86)",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(1.25),
    minWidth: wp(19),
    height: hp(2.8),
  },
  sortButtonText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: fontSize(12.4),
    color: "#000000",
    marginRight: wp(1.5),
  },
  sortArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: wp(1.5),
    borderRightWidth: wp(1.5),
    borderTopWidth: wp(2),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#000000",
  },
  videoCard: {
    width: wp(88),
    height: hp(8.5),
    backgroundColor: "rgba(129,126,126,0.87)",
    borderRadius: wp(2.5),
    flexDirection: "row",
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  videoInfo: {
    flex: 1,
    paddingLeft: wp(6),
    justifyContent: "center",
  },
  videoText: {
    fontSize: fontSize(10),
    color: "#FFFFFF",
    fontWeight: "400",
    marginBottom: hp(1),
  },
  videoStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(5),
  },
  eyeIcon: {
    width: wp(3),
    height: wp(2),
    marginRight: wp(1),
  },
  heartIcon: {
    width: wp(2.5),
    height: wp(2.5),
    marginRight: wp(1),
  },
  statText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: fontSize(10),
    color: "#000000",
  },
  videoImage: {
    width: wp(28),
    height: hp(8.5),
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  moreButton: {
    alignSelf: "center",
    width: wp(15),
    height: hp(3.5),
    backgroundColor: "#0077FF",
    borderRadius: wp(2.5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(0.5),
  },
  moreText: { fontWeight: "900", fontSize: fontSize(10), color: "#FFFFFF" },

  blogContainer: {
    backgroundColor: "rgba(176,176,176,0.37)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.28)",
    borderRadius: wp(2.5),
    padding: wp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  blogTitle: {
    fontWeight: "900",
    fontSize: fontSize(20),
    color: "#000",
    marginBottom: hp(1.5),
    textAlign: "center",
  },
  blogCard: {
    width: wp(80),
    height: hp(8.5),
    backgroundColor: "rgba(129,126,126,0.87)",
    borderRadius: wp(2.5),
    marginBottom: hp(1.8),
    paddingHorizontal: wp(6),
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  blogHeading: {
    fontWeight: "400",
    fontSize: fontSize(10),
    lineHeight: fontSize(12),
    color: "#FFFFFF",
  },
  blogSubtitle: { fontWeight: "400", fontSize: fontSize(10), color: "#030000", marginBottom: hp(0.5) },
  blogDivider: { borderBottomColor: "rgba(130,130,130,0.42)", borderBottomWidth: 1, marginBottom: hp(0.5) },
  blogDescription: { fontWeight: "400", fontSize: fontSize(9), lineHeight: fontSize(12), color: "#676767" },
  blogMoreButton: {
    alignSelf: "center",
    width: wp(12.5),
    height: hp(3.2),
    backgroundColor: "#0077FF",
    borderRadius: wp(2.5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  blogMoreText: {
    fontWeight: "900",
    fontSize: fontSize(10),
    color: "#FFFFFF",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(10),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.09,
    shadowRadius: 6.5,
    elevation: 10,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontWeight: "900", fontSize: fontSize(14), textAlign: "center" },
  navIcon: { width: wp(8), height: wp(8), marginBottom: hp(0.5) },
  navIconWrapper: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Curation
