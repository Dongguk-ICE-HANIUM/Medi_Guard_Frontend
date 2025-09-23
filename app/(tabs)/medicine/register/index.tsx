import Button from "@/components/Button";
import { colors } from "@/constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Register = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedMethod === "direct") {
      router.push("/medicine/register/listSearch");
    } else if (selectedMethod === "ai") {
      router.push("/medicine/register/camera");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          약물을 등록할 방법을 {"\n"}선택해주세요
        </Text>
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
      </View>

      <View style={styles.button}>
        <Button text="다음" onPress={handleNext} disabled={!selectedMethod} />
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 40,
  },
  optionsContainer: {
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
    borderColor: colors.LIGHT_GRAY,

    shadowColor: colors.TEXT_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.82,
  },
  selectedCard: {
    backgroundColor: colors.PINK,
    borderColor: colors.PINK,
    borderWidth: 2,
  },
  text: {
    fontSize: 18,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },
  selectedText: {
    color: colors.BLACK,
    fontWeight: "600",
  },
  button: {
    marginBottom: 15,
  },
});
