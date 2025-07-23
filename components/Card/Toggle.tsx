import { colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Toggle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>복용 체크하기</Text>
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.PINK,
    borderStyle: "dashed",
    borderRadius: 16,
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  text: {
    color: colors.PINK,
    fontWeight: "bold",
    fontSize: 13,
  },
});
