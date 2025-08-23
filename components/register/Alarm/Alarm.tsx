import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AlarmDetail from "./AlarmDetail";

const Alarm = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>알림</Text>
        <FontAwesome name="plus-square" size={24} color="pink" />
      </View>
      <AlarmDetail />
    </View>
  );
};

export default Alarm;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
});
