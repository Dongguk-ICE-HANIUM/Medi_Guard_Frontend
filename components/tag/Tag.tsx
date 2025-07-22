import { colors } from "@/constants";
import { tagIcons, TagInfo } from "@/types/tags";
import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface TagProps extends PressableProps {
  tagInfo: TagInfo;
  size?: "small" | "large";
  icon?: string;
  onPress?: () => void;
}

function Tag({ tagInfo, size = "small", onPress, ...props }: TagProps) {
  const iconInfo = tagIcons[tagInfo.type];
  const IconComponet = iconInfo?.Icon;
  const iconName = iconInfo?.name;

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
      <IconComponet name={iconName as any} size={size === "small" ? 10 : 12} />
      <Text style={styles[`${size}Text`]}>{tagInfo.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    gap: 2,
  },
  small: { width: 45, height: 15, alignItems: "center" },
  smallText: {
    paddingVertical: 2,
    textAlign: "center",
    fontSize: 10,
  },
  large: {},
  largeText: {},
  pressed: {},
  pillTaken: { backgroundColor: colors.BLUE, borderRadius: 8 },
  pillMissed: { backgroundColor: colors.RED, borderRadius: 8 },
  sideEffect: { backgroundColor: colors.PURPLE, borderRadius: 8 },
  pillSchedule: { backgroundColor: colors.YELLOW, borderRadius: 8 },
  appointment: { backgroundColor: colors.PINK, borderRadius: 8 },
});

export default Tag;
