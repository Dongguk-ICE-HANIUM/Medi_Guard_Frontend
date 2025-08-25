import Button from "@/components/Button";
import { colors } from "@/constants";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const code = () => {
  // 랜덤 6자리 숫자 생성
  const [authCode, setAuthCode] = useState(() => {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
  });

  // 1분(60초)부터 시작하는 카운트다운
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePress = () => {
    router.push("/treat/consultation/ongoingConsultation");
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.description}>
          화면의 숫자를 의사 선생님께 공유해주세요!
        </Text>

        {/* 인증 코드 숫자들 */}
        <View style={styles.codeContainer}>
          {authCode.map((digit, index) => (
            <View key={index} style={styles.digitBox}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* 유효 시간 */}
        <Text style={styles.timeText}>유효 시간 {formatTime(timeLeft)}</Text>

        {/* 코드 다시 생성하기 버튼 (작동 안 함) */}
        <TouchableOpacity style={styles.regenerateButton}>
          <Text style={styles.regenerateText}>코드 다시 생성하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button text="진료 시작" color="pink" onPress={handlePress} />
      </View>
    </View>
  );
};

export default code;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  description: {
    fontSize: 16,
    lineHeight: 30,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    paddingVertical: 24,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },

  digitBox: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  digitText: {
    fontSize: 22,
    fontWeight: "500",
  },

  timeText: {
    fontSize: 14,
    color: colors.RED,
    marginBottom: 16,
    textAlign: "center",
  },

  regenerateButton: {
    paddingVertical: 8,
    width: "40%",
    height: "8%",
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
    backgroundColor: colors.LIGHT_GRAY + "40",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignSelf: "center",
  },

  regenerateText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
});
