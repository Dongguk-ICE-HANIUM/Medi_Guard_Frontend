import { colors } from "@/constants/index";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ButtonStyles } from "../Styles/ButtonStyles.js";

interface NavigationCardProps extends PressableProps {
  text: string;
  icon?: "next" | "plus";
}

function NavigationCard({
  text,
  icon = "next",
  ...props
}: NavigationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        NavigationCardStyles.container,
        NavigationCardStyles[icon],
        pressed && ButtonStyles.pressed,
      ]}
      {...props}
    >
      <Text style={NavigationCardStyles.text}>{text}</Text>
      <View style={NavigationCardStyles.iconBox}>
        <AntDesign
          name={icon == "next" ? "right" : "plus"}
          size={12}
          color="black"
        />
      </View>
    </Pressable>
  );
}

export default NavigationCard;

const NavigationCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    width: "45%",
    borderRadius: 16,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
  },
  next: {},
  plus: {},
  iconBox: {
    backgroundColor: colors.PINK,
    width: 25,
    height: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
