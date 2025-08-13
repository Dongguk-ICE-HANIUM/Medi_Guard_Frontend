import { colors } from "@/constants";
import { TAKING_TYPE_OPTIONS } from "@/constants/registerIndex";
import { TakingType } from "@/types/medication";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TakingCycleProps {
  selectedType?: TakingType;
  onTypeChange?: (type: TakingType) => void;
  errors?: string[];
  showError?: boolean;
}

const TakingCycle: React.FC<TakingCycleProps> = ({
  selectedType,
  onTypeChange,
  errors = [],
  showError = false,
}) => {
  const hasError = showError && errors.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>복약 주기</Text>
        <MaterialCommunityIcons
          name="information-outline"
          size={18}
          color="red"
          style={{ marginLeft: 3 }}
        />
        {hasError && (
          <Text style={{ color: colors.RED, marginLeft: 5, top: -1 }}>
            {errors.join(", ")}
          </Text>
        )}
      </View>
      <View style={styles.typeContainer}>
        {TAKING_TYPE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.default,
              selectedType === option.value && styles.selected,
            ]}
            onPress={() => onTypeChange?.(option.value)}
          >
            <Text
              style={[
                styles.text,
                selectedType === option.value && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TakingCycle;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 17,
  },
  default: {
    borderWidth: 0.5,
    borderColor: colors.TEXT_GRAY,
    borderRadius: 10,
    width: "30%",
    padding: 10,
    paddingVertical: 13,
  },
  selected: {
    backgroundColor: colors.PINK + "40", // 40은 16진수로 25% 투명도
    borderColor: colors.PINK,
  },
  text: {
    textAlign: "center",
    alignContent: "center",
  },
  selectedText: {
    fontWeight: "600",
  },
});
