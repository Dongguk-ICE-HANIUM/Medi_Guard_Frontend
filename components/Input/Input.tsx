import { colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  variant?: "icon" | "basic";
  size?: "small" | "full";
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  error?: string;
  onIconPress?: () => void;
}

function Input({
  label,
  variant = "basic",
  iconName,
  iconColor,
  error,
  size,
  onIconPress,
  ...props
}: InputFieldProps) {
  const getContainerStyle = () => {
    const baseStyle = styles.container;

    switch (size) {
      case "small":
        return [baseStyle, { width: 186, marginRight: 8 }];
      default:
        return baseStyle;
    }
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getContainerStyle()}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.TEXT_GRAY}
            style={[styles.input, variant === "icon" && { paddingRight: 35 }]}
            {...props}
          />
          {variant === "icon" && iconName && (
            <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
              <Ionicons
                name={iconName}
                size={20}
                color={iconColor ? iconColor : colors.BLACK}
              />
            </TouchableOpacity>
          )}
        </View>
        {Boolean(error) && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: colors.BLACK,
    marginLeft: 19,
    marginTop: 10,
    marginBottom: 5,
  },
  container: {
    marginHorizontal: 16,
    position: "relative",
  },
  inputContainer: {
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 16,
  },
  input: {
    padding: 0,
    fontSize: 16,
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  error: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    color: colors.RED,
  },
});

export default Input;
