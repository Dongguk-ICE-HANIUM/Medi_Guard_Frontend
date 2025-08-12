import { colors } from "@/constants";
import { useMedicationForm } from "@/hooks/useMedicationForm";
import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import Alarm from "./Alarm/Alarm";
import DateRange from "./DateRange";
import PerAOnce from "./PerAOnce";
import TakingCycle from "./TakingCycle/TakingCycle";
import TakingCycleDetails from "./TakingCycle/TakingCycleDetails";
import Group from "./group/Group";

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

  const handleTakingTypeChange = (takingType: TakingType) => {
    updateField("takingType", takingType);
  };

  const handleIntervalChange = (interval: number) => {
    updateField("interval", interval);
  };

  const handleParticularDateChange = (dates: string[]) => {
    updateField("particularDate", dates);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{selected.name}</Text>
      </View>
      <View>
        <DateRange
          startAt={medication.startAt}
          endAt={medication.endAt}
          onStartChange={(date) => {
            updateField("startAt", date);
          }}
          onEndChange={(date) => {
            updateField("endAt", date);
          }}
          errors={[...(errors.startAt || []), ...(errors.endAt || [])]}
        />
        <TakingCycle
          selectedType={medication.takingType}
          onTypeChange={handleTakingTypeChange}
        />
        <TakingCycleDetails
          takingType={medication.takingType}
          interval={medication.interval}
          particularDate={medication.particularDate}
          onIntervalChange={handleIntervalChange}
          onParticularDateChange={handleParticularDateChange}
        />
        <PerAOnce />
        <Alarm />
        <Group
          groupName={medication.groupName}
          onGroupChange={(name) => updateField("groupName", name)}
        />
        <Button text="다음" />
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
