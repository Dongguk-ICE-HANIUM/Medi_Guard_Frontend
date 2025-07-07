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
  iconName?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

function Input({
  label,
  variant = "basic",
  iconName,
  onIconPress,
  ...props
}: InputFieldProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.TEXT_GRAY}
            style={[styles.input, variant === "icon" && { paddingRight: 35 }]}
            {...props}
          />
          {variant === "icon" && iconName && (
            <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
              <Ionicons name={iconName} size={20} color={colors.BLACK} />
            </TouchableOpacity>
          )}
        </View>
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
});

export default Input;
