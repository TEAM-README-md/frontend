import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NewsItem {
  title: string;
  description: string;
  link?: string;
  publishedAt?: string;
  author?: string;
}

interface VideoItem {
  title: string;
  thumbnail: string;
  link: string;
}

interface BlogItem {
  title: string;
  subtitle: string; // '요즘 취업, 어떻게 따라가야할까?' 같은 부제목
  description: string; // '최근들어, 개발자로...' 같은 설명
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const Curation: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("큐레이션");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [blogList, setBlogList] = useState<BlogItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [visibleNews, setVisibleNews] = useState(4);
  const [visibleVideoCount, setVisibleVideoCount] = useState(4);
  const [visibleBlogCount, setVisibleBlogCount] = useState(4);

  const [imageIndex, setImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  // 가로 슬라이드(뉴스, 영상, 블로그) 페이지 인덱스
  // 0: 뉴스, 1: 영상, 2: 블로그

  const handleTabPress = (label: string) => {
    setActiveTab(label);
    if (label === "홈") router.push("/Home");
    else if (label === "학습") router.push("/Writing");
    else if (label === "알림") {}
    else if (label === "내 정보") {}
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/curation/news?keywords=%EC%B7%A8%EC%97%85"
        );
        if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
        const text = await response.text();
        if (!text) throw new Error("빈 응답입니다.");
        const json = JSON.parse(text);
        if (Array.isArray(json.news)) setNewsList(json.news);
        else if (Array.isArray(json)) setNewsList(json);
        else setNewsList([]);
      } catch (error) {
        console.error("❌ 뉴스 가져오기 실패:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch(
          "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/curation/videos?keywords=%EC%9D%B4%EB%A0%A5%EC%84%9C%2C%EB%A9%B4%EC%A0%91%2C%EC%B7%A8%EC%97%85"
        );
        if (!response.ok) throw new Error(`영상 서버 오류: ${response.status}`);
        const json = await response.json();
        if (Array.isArray(json)) setVideoList(json);
      } catch (error) {
        console.error("❌ 영상 가져오기 실패:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://port-0-readme-backend-mc3irwlrc1cd1728.sel5.cloudtype.app/api/curation/blogs?keywords=%EC%B7%A8%EC%97%85%20%EB%A9%B4%EC%A0%91"
        );
        if (!response.ok) throw new Error(`블로그 서버 오류: ${response.status}`);
        const json = await response.json();
        if (Array.isArray(json)) setBlogList(json);
      } catch (error) {
        console.error("❌ 블로그 가져오기 실패:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchNews();
    fetchVideos();
    fetchBlogs();
  }, []);

  useFocusEffect(
  React.useCallback(() => {
    setVisibleNews(4);
    setVisibleVideoCount(4);
    setVisibleBlogCount(4);
    setImageIndex(0);

    imageScrollRef.current?.scrollTo({ x: 0, animated: false });
    horizontalScrollRef.current?.scrollTo({ x: 0, animated: false });

    return () => {};
  }, [])
);

  const handleLoadMoreNews = () => setVisibleNews((prev) => prev + 4);
  const handleLoadMoreVideos = () => setVisibleVideoCount((prev) => prev + 4);
  const handleLoadMoreBlogs = () => {
    const newCount = visibleBlogCount + 4;
    setVisibleBlogCount(newCount);

    // 가로 슬라이드 2번째(블로그)로 이동
    horizontalScrollRef.current?.scrollTo({ x: SCREEN_WIDTH * 2, animated: true });
  };

  const onScrollImage = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} nestedScrollEnabled>
        <Text style={styles.title}>오늘의 큐레이션</Text>

        {/* 이미지 슬라이드 */}
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
            <Image
              key={i}
              source={require("../../assets/images/image 2.png")}
              style={styles.slideImage}
            />
          ))}
        </ScrollView>

        <View style={styles.dotContainer}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.dot, i === imageIndex && styles.activeDot]} />
          ))}
        </View>

        {/* 뉴스, 영상, 블로그 가로 슬라이드 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalSlider}
          nestedScrollEnabled
          ref={horizontalScrollRef}
        >
          {/* 뉴스 페이지 */}
          <ScrollView
            style={styles.page}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.newsTitle}>뉴스</Text>
            {loadingNews ? (
              <ActivityIndicator
                style={{ marginTop: 20 }}
                size="small"
                color="#0077FF"
              />
            ) : newsList.length > 0 ? (
              newsList.slice(0, visibleNews).map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.newsItem}
                  onPress={() => item.link && Linking.openURL(item.link)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.newsNumber}>{i + 1}</Text>
                  <View style={styles.newsContent}>
                    <Text style={styles.newsHeading}>{item.title || "제목 없음"}</Text>
                    <Text style={styles.newsDescription}>{item.description || "설명 없음"}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: "#888" }}>뉴스가 없습니다.</Text>
            )}
            {!loadingNews && visibleNews < newsList.length && (
              <TouchableOpacity style={styles.moreButton} onPress={handleLoadMoreNews}>
                <Text style={styles.moreText}>더보기</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* 영상 페이지 */}
          <ScrollView
            style={styles.page}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.videoTitle}>영상</Text>
            {loadingVideos ? (
              <ActivityIndicator
                style={{ marginTop: 20 }}
                size="small"
                color="#0077FF"
              />
            ) : (
              videoList.slice(0, visibleVideoCount).map((video, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.videoCard}
                  onPress={() => Linking.openURL(video.link)}
                  activeOpacity={0.9}
                >
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoText}>{video.title}</Text>
                  </View>
                  <Image source={{ uri: video.thumbnail }} style={styles.videoImage} />
                </TouchableOpacity>
              ))
            )}

            {/* 영상 더보기 버튼 */}
            {!loadingVideos && visibleVideoCount < videoList.length && (
              <TouchableOpacity style={styles.moreButton} onPress={handleLoadMoreVideos}>
                <Text style={styles.moreText}>더보기</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* 블로그 페이지 */}
          <ScrollView
            style={styles.page}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.blogTitle}>블로그</Text>
            {loadingBlogs ? (
              <ActivityIndicator
                style={{ marginTop: 20 }}
                size="small"
                color="#0077FF"
              />
            ) : blogList.length > 0 ? (
              blogList.slice(0, visibleBlogCount).map((item, i) => (
                <View key={i} style={styles.blogCard}>
                  <Text style={styles.blogHeading}>{item.title}</Text>
                  <Text style={styles.blogSubtitle}>{item.subtitle}</Text>
                  <View style={styles.blogDivider} />
                  <Text style={styles.blogDescription}>{item.description}</Text>
                </View>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: "#888" }}>블로그가 없습니다.</Text>
            )}
            {!loadingBlogs && visibleBlogCount < blogList.length && (
              <TouchableOpacity style={styles.moreButton} onPress={handleLoadMoreBlogs}>
                <Text style={styles.moreText}>더보기</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </ScrollView>
      </ScrollView>

      {/* 하단 내비게이션 */}
      <View style={styles.bottomNav}>
        {[
          "큐레이션",
          "학습",
          "홈",
          "알림",
          "내 정보",
        ].map((label, i) => {
          const isActive = activeTab === label;
          const icons = [
            require("../../assets/images/Group 22.png"),
            require("../../assets/images/Speech.png"),
            require("../../assets/images/home.png"),
            require("../../assets/images/Vector.png"),
            require("../../assets/images/Person.png"),
          ];
          return (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              onPress={() => handleTabPress(label)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.navIconWrapper, isActive && { borderColor: "" }]}
              >
                <Image
                  source={icons[i]}
                  style={[styles.navIcon, isActive && { tintColor: "#0077FF" }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.navText, isActive && { color: "#0077FF" }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 100, paddingTop: 50 },
  title: {
    marginLeft: 20,
    fontWeight: "900",
    fontSize: 23,
    color: "#000",
    marginBottom: 16,
  },
  imageSlider: { marginBottom: 12 },
  slideImage: { width: SCREEN_WIDTH, height: 200, resizeMode: "cover" },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#BFBFBF",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#0077FF" },
  horizontalSlider: {
    minHeight: 400,
  },
  page: { width: SCREEN_WIDTH, paddingHorizontal: 23, flex: 1 },
  newsTitle: { fontWeight: "900", fontSize: 17, color: "#000", marginBottom: 8 },
  newsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 58,
  },
  newsNumber: { fontWeight: "900", fontSize: 23, color: "#828282", width: 30 },
  newsContent: { marginLeft: 8, flex: 1 },
  newsHeading: { fontSize: 13, color: "#030000" },
  newsDescription: { fontSize: 10, color: "#676767", marginTop: 2 },
  moreButton: {
    alignSelf: "center",
    marginTop: 10,
    width: 60,
    height: 28,
    backgroundColor: "#0077FF",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: { fontWeight: "900", fontSize: 10, color: "#FFFFFF" },

  videoTitle: { fontWeight: "900", fontSize: 17, color: "#000", marginBottom: 12 },
  videoCard: {
    width: 363,
    height: 70,
    backgroundColor: "#0077FF",
    borderRadius: 10.76,
    flexDirection: "row",
    marginBottom: 12,
  },
  videoInfo: { flex: 1, paddingLeft: 24, justifyContent: "center" },
  videoText: { fontSize: 10, color: "#FFFFFF", fontWeight: "400" },
  videoImage: {
    width: 113,
    height: 70,
    borderRadius: 10.76,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },

  blogTitle: {
    fontWeight: "900",
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
    marginLeft: 0,
  },
  blogCard: {
    marginBottom: 24,
  },
  blogHeading: {
    fontWeight: "900",
    fontSize: 13,
    lineHeight: 18,
    color: "#000000",
    marginBottom: 6,
  },
  blogSubtitle: {
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    color: "#030000",
    marginBottom: 4,
  },
  blogDivider: {
    borderBottomColor: "rgba(130, 130, 130, 0.42)",
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  blogDescription: {
    fontWeight: "400",
    fontSize: 9,
    lineHeight: 7,
    color: "#676767",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    top: 873,
    right: 0,
    bottom: 0,
    height: 129,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  navText: { fontWeight: "900", fontSize: 14, textAlign: "center" },
  navIcon: { width: 32, height: 32, marginBottom: 4 },
  navIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Curation;
