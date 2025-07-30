import { colors } from "@/constants";
import { useMedicationForm } from "@/hooks/useMedicationForm";
import { Medication, SelectedMedicineInfo } from "@/types/medication";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export interface RegisterInfoProps {
  selected: SelectedMedicineInfo;
  onSubmit?: (medication: Medication) => void;
}
const RegisterInfo = ({ selected, onSubmit }: RegisterInfoProps) => {
  const { medication, errors, updateField, validateForm } =
    useMedicationForm(selected);

  const handleSubmit = () => {
    const { isValid } = validateForm();
    if (isValid && onSubmit) {
      onSubmit(medication);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{selected.name}</Text>
      </View>
    </ScrollView>
  );
};

export default RegisterInfo;

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
    marginHorizontal: 10,
  },
  nameContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.TEXT_GRAY,
  },
  name: {
    fontSize: 23,
    fontWeight: "bold",
    paddingBottom: 10,
  },
});
