import { colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NumberInputProps {
  title: string;
  description: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  compact?: boolean; // 제목과 설명을 숨기고 입력 부분만 표시
}

const NumberInput: React.FC<NumberInputProps> = ({
  title,
  description,
  value,
  unit,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  compact = false,
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onValueChange(newValue);
  };

  const formatValue = (val: number) => {
    return val % 1 === 0 ? val.toString() : val.toFixed(2);
  };

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      {!compact && (
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDecrease}
          disabled={value <= min}
        >
          <Text
            style={[styles.buttonText, value <= min && styles.disabledText]}
          >
            -
          </Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>
            {formatValue(value)}
            {unit}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleIncrease}
          disabled={value >= max}
        >
          <Text
            style={[styles.buttonText, value >= max && styles.disabledText]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NumberInput;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "baseline",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
    color: colors.BLACK,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.TEXT_GRAY,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    alignSelf: "center",
  },
  button: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  disabledText: {
    color: colors.TEXT_GRAY,
  },
  valueContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 60,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.BLACK,
    textAlign: "center",
  },
});
