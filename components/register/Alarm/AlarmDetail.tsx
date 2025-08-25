import { colors } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";

const AlarmDetail = () => {
  return (
    <View>
      <View style={styles.container}>
        {/* <Text style={styles.text}>오전 8 : 00</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>오전 8 : 00</Text> */}
      </View>
    </View>
  );
};

export default AlarmDetail;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: colors.TEXT_GRAY,
    borderWidth: 0.5,
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    padding: 10,
  },
});
