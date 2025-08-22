import Button from "@/components/Button";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const emptyResult = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>잠시만 기다려주세요!</Text>
        <Text style={styles.description}>
          의료진이 진료 내용을 {"\n"}정리하고 있어요
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button text="오늘 진료 결과 보기" color="pink" onPress={() => {}} />
      </View>
    </View>
  );
};

export default emptyResult;

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
