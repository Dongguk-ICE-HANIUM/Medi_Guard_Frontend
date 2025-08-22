import Button from "@/components/Button";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ongoingConsultation = () => {
  const handlePress = () => {
    router.push("/treat/consultation/result");
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>지금은 진료 시간이에요!</Text>
        <Text style={styles.description}>
          궁금한 점은 진료 중에 {"\n"}꼭 말씀해 주세요!
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button text="오늘 진료 결과 보기" color="pink" onPress={handlePress} />
      </View>
    </View>
  );
};

export default ongoingConsultation;

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
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 18,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingVertical: 24,
  },
});
