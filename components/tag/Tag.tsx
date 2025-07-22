import { colors } from "@/constants";
import { TagInfo } from "@/types/tags";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface TagProps extends PressableProps {
  tagInfo: TagInfo;
  size?: "small" | "large";
  onPress?: () => void;
}

function Tag({ tagInfo, size = "small", onPress, ...props }: TagProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        styles[size],
        styles[tagInfo.type],
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      {...props}
    >
      <Feather name="x-circle" size={10} color="black" />
      <Text style={styles[`${size}Text`]}>{tagInfo.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 3,
    gap: 1,
  },
  small: { width: 45, height: 15, alignItems: "center" },
  large: {},
  smallText: {
    paddingVertical: 2,
    textAlign: "center",
    fontSize: 11,
  },
  largeText: {},
  pressed: {},
  pillTaken: { backgroundColor: colors.BLUE, borderRadius: 8 },
  pillMissed: { backgroundColor: colors.RED, borderRadius: 8 },
  sideEffect: { backgroundColor: colors.PURPLE, borderRadius: 8 },
  pillSchedule: { backgroundColor: colors.YELLOW, borderRadius: 8 },
  appointment: { backgroundColor: colors.PINK, borderRadius: 8 },
});

export default Tag;
