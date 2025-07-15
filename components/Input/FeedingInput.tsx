import { colors } from "@/constants";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "./Input";

function FeedingInput() {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  const feedingOptions = [
    { label: "O", value: true },
    { label: "X", value: false },
  ];

  return (
    <Controller
      name="feeding"
      control={control}
      rules={{
        validate: (data) => {
          if (data === "" || data === undefined) return "필수 입력 항목";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Input
            label="수유여부"
            placeholder="수유여부"
            variant="icon"
            iconName="chevron-down"
            value={value === true ? "O" : "X"}
            onChangeText={onChange}
            onIconPress={() => setIsOpen(!isOpen)}
            error={error?.message}
            size="small"
            editable={false}
          />
          {isOpen && (
            <View style={styles.dropdown}>
              {feedingOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={styles.option}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  dropdown: {
    position: "absolute",
    top: "85%",
    left: 16,
    right: 8,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 6,
  },
  option: {
    padding: 8,
  },
  optionText: {
    left: 6,
  },
});

export default FeedingInput;
