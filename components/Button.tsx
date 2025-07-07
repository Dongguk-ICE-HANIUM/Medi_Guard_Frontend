import React from "react";
import { Pressable, PressableProps, Text } from "react-native";
import { ButtonStyles } from "./Styles/ButtonStyles.js";

interface ButtonProps extends PressableProps {
  text: string;
  size?: "small" | "large";
  color?: "pink" | "gray";
}

function Button({
  text,
  size = "large",
  color = "pink",
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
      <Text>{text}</Text>
    </Pressable>
  );
}

export default Button;
