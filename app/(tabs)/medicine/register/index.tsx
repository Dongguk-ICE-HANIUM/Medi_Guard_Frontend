import { colors } from "@/constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Register = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedMethod === "direct") {
      router.push("/medicine/register/selfRegister");
    } else if (selectedMethod === "ai") {
      router.push("/medicine/register/aiRegister");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약물을 등록할 방법을 {"\n"}선택해주세요</Text>

      <View style={styles.optionsContainer}>
        <Pressable
          onPress={() => setSelectedMethod("direct")}
          style={[
            styles.registerCard,
            selectedMethod === "direct" && styles.selectedCard,
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedMethod === "direct" && styles.selectedText,
            ]}
          >
            직접 등록하기
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setSelectedMethod("ai")}
          style={[
            styles.registerCard,
            selectedMethod === "ai" && styles.selectedCard,
          ]}
        >
          <Text
            style={[
              styles.text,
              selectedMethod === "ai" && styles.selectedText,
            ]}
          >
            AI 이미지 검색으로 등록하기
          </Text>
        </Pressable>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handleNext}
          disabled={!selectedMethod}
          style={[styles.nextButton, !selectedMethod && styles.disabledButton]}
        >
          <Text
            style={[
              styles.nextButtonText,
              !selectedMethod && styles.disabledButtonText,
            ]}
          >
            다음
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 40,
  },
  optionsContainer: {
    flex: 1,
    gap: 15,
  },
  registerCard: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY || "#E0E0E0",

    shadowColor: colors.TEXT_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.82,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: colors.PINK || "#FFB6C1",
    borderColor: colors.PINK || "#FFB6C1",
    borderWidth: 2,
  },
  text: {
    fontSize: 18,
    color: colors.TEXT_GRAY || "#666",
    fontWeight: "500",
  },
  selectedText: {
    color: colors.WHITE || "#FFF",
    fontWeight: "600",
  },
  bottomContainer: {
    paddingTop: 20,
  },
  nextButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.PINK || "#FFB6C1",
  },
  disabledButton: {
    backgroundColor: colors.LIGHT_GRAY || "#E0E0E0",
  },
  nextButtonText: {
    fontSize: 18,
    color: colors.WHITE || "#FFF",
    fontWeight: "600",
  },
  disabledButtonText: {
    color: colors.TEXT_GRAY || "#999",
  },
});
