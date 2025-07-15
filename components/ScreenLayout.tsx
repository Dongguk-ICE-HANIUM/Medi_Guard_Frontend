import { colors } from "@/constants";
import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}
export const ScreenLayout = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.background, style]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.BG_COLOR,
  },
  container: {
    marginHorizontal: 13,
  },
});
