import Button from "@/components/Button";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const code = () => {
  const handlePress = () => {
    router.push("/treat/consultation/ongoingConsultation");
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.description}>
          화면의 숫자를 의사 선생님께 공유해주세요!
        </Text>
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
  },
  buttonContainer: {
    paddingVertical: 24,
  },
});
