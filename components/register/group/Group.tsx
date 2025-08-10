import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Group = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>그룹</Text>
        <FontAwesome name="toggle-on" size={30} color="pink" />
      </View>
    </View>
  );
};

export default Group;

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
