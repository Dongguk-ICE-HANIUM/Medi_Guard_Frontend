import { colors } from "@/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TermsItemProps {
  id: string;
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onViewTerms: () => void;
}

const TermsItem: React.FC<TermsItemProps> = ({
  id,
  label,
  required = false,
  checked,
  onChange,
  onViewTerms,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => onChange(!checked)}>
          {checked ? (
            <AntDesign name="check" size={24} color={colors.BLACK} />
          ) : (
            <Ionicons
              name="ellipse-outline"
              size={24}
              color={colors.TEXT_GRAY}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.label}>
          {required && <Text style={styles.required}>(필수)</Text>} {label}
        </Text>
      </View>
      <TouchableOpacity onPress={onViewTerms} style={styles.button}>
        <AntDesign name="right" size={20} color={colors.TEXT_GRAY} />
      </TouchableOpacity>
    </View>
  );
};

export default TermsItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  required: {
    color: colors.RED,
  },
  button: {
    padding: 4,
  },
});
