import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CameraButtonProps {
  onPress?: () => void;
}

export default function CameraButton({ onPress }: CameraButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/medicine/register/camera");
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="camera" size={24} color={colors.WHITE} />
      </View>
      <Text style={styles.text}>사진으로 등록</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.PINK,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.WHITE,
  },
});
