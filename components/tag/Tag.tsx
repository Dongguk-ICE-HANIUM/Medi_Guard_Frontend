import { colors } from "@/constants";
import { tagIcons, TagInfo } from "@/types/tags";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface TagProps extends PressableProps {
  tagInfo: TagInfo;
  size?: "small" | "large";
  onPress?: () => void;
}

function Tag({ tagInfo, size = "small", onPress, ...props }: TagProps) {
  const iconInfo = tagIcons[tagInfo.type];
  const IconComponent = iconInfo?.Icon;
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
      <View style={styles.tagIcon}>
        <IconComponent
          name={iconName as any}
          size={size === "small" ? 8 : 12}
        />
      </View>
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
  tagIcon: {
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pillTaken: { backgroundColor: "#B6D0FF", borderRadius: 8 },
  pillMissed: { backgroundColor: "#FF6E70", borderRadius: 8 },
  sideEffect: { backgroundColor: "#D9B6FF", borderRadius: 8 },
  pillSchedule: { backgroundColor: "#FFFDB6", borderRadius: 8 },
  appointment: { backgroundColor: colors.PINK, borderRadius: 8 },
});

export default Tag;
