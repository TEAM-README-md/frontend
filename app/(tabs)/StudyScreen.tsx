import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function StudyScreen() {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const options = [
    {
      label: "발음 연습",
      boxTop: 216,
      boxLeft: 43,
      textTop: 225,
      textLeft: 102,
      img: require("../../assets/images/image_47.png"),
      imgTop: 200,
      imgLeft: 28,
      textWidth: 79,
    },
    {
      label: "자료 준비",
      boxTop: 276,
      boxLeft: 43,
      textTop: 285,
      textLeft: 102,
      img: require("../../assets/images/image_49.png"),
      imgTop: 260,
      imgLeft: 28,
      textWidth: 80,
    },
    {
      label: "기타",
      boxTop: 337,
      boxLeft: 43,
      textTop: 347,
      textLeft: 111,
      img: require("../../assets/images/image_45.png"),
      imgTop: 321,
      imgLeft: 27,
      textWidth: 39,
    },
    {
      label: "면접",
      boxTop: 216,
      boxLeft: 224,
      textTop: 226,
      textLeft: 293,
      img: require("../../assets/images/image_51.png"),
      imgTop: 200,
      imgLeft: 210,
      textWidth: 39,
    },
    {
      label: "사고력",
      boxTop: 275,
      boxLeft: 224,
      textTop: 284,
      textLeft: 286,
      img: require("../../assets/images/image_53.png"),
      imgTop: 259,
      imgLeft: 209,
      textWidth: 57,
    },
  ];

  const handleSelect = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
    setShowWarning(false);
  };

  const handleNext = () => {
    if (selectedIndexes.length > 0) {
      router.push("/TimeScreen");
    } else {
      setShowWarning(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* 도트 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              left: 32 + i * 78,
              backgroundColor: i < 3 ? "#0077FF" : "rgba(0, 0, 0, 0.15)",
            },
          ]}
        />
      ))}

      {/* 질문 */}
      <Text style={styles.questionText}>어떤 것을 집중적으로 공부하고 싶으신가요?</Text>

      {/* 선택 항목 */}
      {options.map((option, index) => {
        const isSelected = selectedIndexes.includes(index);
        return (
          <React.Fragment key={index}>
            <Image
              source={option.img}
              style={{
                position: "absolute",
                width: 85,
                height: 85,
                top: option.imgTop,
                left: option.imgLeft,
                zIndex: 1,
              }}
            />
            <Pressable
              onPress={() => handleSelect(index)}
              style={[
                styles.optionBox,
                {
                  top: option.boxTop,
                  left: option.boxLeft,
                  borderColor: isSelected ? "#0077FF" : "rgba(0, 0, 0, 0.1)",
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    position: "absolute",
                    top: option.textTop - option.boxTop,
                    left: option.textLeft - option.boxLeft,
                    width: option.textWidth,
                    height: 39,
                    textAlign: "left",
                    color: isSelected ? "#0077FF" : "#000000",
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          </React.Fragment>
        );
      })}

      {/* 경고 문구 */}
      {showWarning && (
        <Text style={styles.warningText}>
          1개 이상은 선택하셔야 다음 선택이 가능해요!
        </Text>
      )}

      {/* 이전 버튼 */}
      <Pressable style={styles.prevButton} onPress={() => router.push("/SpeakScreen")}>
        <Text style={styles.prevText}>이전</Text>
      </Pressable>

      {/* 다음 버튼 */}
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 1344,
    height: 2992,
    backgroundColor: "#FFFFFF",
  },
  dot: {
    position: "absolute",
    top: 62,
    width: 72,
    height: 20,
    borderRadius: 10.76,
  },
  questionText: {
    position: "absolute",
    width: 281,
    height: 78,
    left: 80,
    top: 138,
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 25,
    lineHeight: 30,
    textAlign: "center",
    color: "#0077FF",
    display: "flex",
    alignItems: "center",
  },
  optionBox: {
    position: "absolute",
    width: 175,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10.76,
    justifyContent: "center",
  },
  optionText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
    display: "flex",
    alignItems: "center",
  },
  warningText: {
    position: "absolute",
    width: 274,
    height: 17,
    top: 475,
    left: 130,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14.4,
    lineHeight: 17,
    color: "#FF0000",
  },
  prevButton: {
    position: "absolute",
    width: 165,
    height: 54,
    left: 45,
    top: 511,
    backgroundColor: "#FFFFFF",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  prevText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#000000",
    textAlign: "center",
  },
  nextButton: {
    position: "absolute",
    width: 165,
    height: 54,
    left: 237,
    top: 511,
    backgroundColor: "#0348DB",
    borderRadius: 10.76,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nextText: {
    fontFamily: "Inter",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
