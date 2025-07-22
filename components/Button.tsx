import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Pressable, PressableProps, Text } from "react-native";
import { ButtonStyles } from "./Styles/ButtonStyles.js";

interface ButtonProps extends PressableProps {
  text?: string;
  size?: "small" | "medium" | "large";
  color?: "pink" | "gray";
  icon?: "right" | "down" | null;
}

function Button({
  text,
  size = "large",
  color = "pink",
  icon = null,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        ButtonStyles.container,
        ButtonStyles[size],
        ButtonStyles[color],
        pressed && ButtonStyles.pressed,
      ]}
      {...props}
    >
      {icon && (
        <AntDesign
          name={icon == "right" ? "right" : "down"}
          size={20}
          color="black"
        />
      )}
      {text && <Text>{text}</Text>}
    </Pressable>
  );
}

export default Button;
