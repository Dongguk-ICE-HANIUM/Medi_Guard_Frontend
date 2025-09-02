import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type Status = "taking" | "planned" | "done";

interface CalendarCheckboxGroupProps {
  status: Status;
  onChange: (status: Status) => void;
}

const CalendarCheckboxGroup = ({
  status,
  onChange,
}: CalendarCheckboxGroupProps) => {
  const options: { key: Status; label: string; labelStyle: any }[] = [
    { key: "taking", label: "복용중", labelStyle: styles.takingLabel },
    { key: "planned", label: "예정", labelStyle: styles.plannedLabel },
    { key: "done", label: "완료", labelStyle: styles.doneLabel },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = status === option.key;

        return (
          <Pressable
            key={option.key}
            style={styles.item}
            onPress={() => onChange(option.key)}
          >
            <View style={styles.checkBox}>
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={24}
                  color="black"
                  style={styles.checkIcon}
                />
              )}
            </View>
            <View style={[styles.labelBox, option.labelStyle]}>
              <Text style={styles.labelText}>{option.label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    marginHorizontal: 3,
  },
  checkBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "black",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    position: "absolute",
    top: -6,
    left: -2,
  },
  labelBox: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 10,
    fontWeight: "600",
    color: "black",
  },
  takingLabel: {
    backgroundColor: "#B6D0FF",
  },
  plannedLabel: {
    backgroundColor: "#FFFDB6",
  },
  doneLabel: {
    backgroundColor: "#BFFFB6",
  },
});

export default CalendarCheckboxGroup;
