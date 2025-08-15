import Button from "@/components/Button";
import Alarm from "@/components/register/Alarm/Alarm";
import DateRange from "@/components/register/DateRange";
import PerAOnce from "@/components/register/PerAOnce";
import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
import Group from "@/components/register/group/Group";
import { colors } from "@/constants";
import { DEV_SELECTED_MEDICINE } from "@/data/mockMedicine";
import { useMedicationForm } from "@/hooks/useMedicationForm";
import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export interface registerFormProps {
  selected: SelectedMedicineInfo;
  onSubmit?: (medication: Medication) => void;
}
const registerForm = ({
  selected = DEV_SELECTED_MEDICINE,
  onSubmit,
}: registerFormProps) => {
  const router = useRouter();

  const {
    medication,
    errors,
    submitted,
    updateField,
    validateForm,
    getSelectedDays,
    updateSelectedDays,
  } = useMedicationForm(selected);

  // 필드 업데이트 시 디버그
  const debugUpdateField = <K extends keyof Medication>(
    field: K,
    value: Medication[K]
  ) => {
    console.log("[updateField]", field, "=>", value);
    updateField(field, value);
  };

  const handleSubmit = () => {
    console.log("[handleSubmit] 시작");
    console.log("[handleSubmit] medication:", medication);
    const { isValid, errors: all } = validateForm();

    console.log("[handleSubmit] isValid:", isValid);
    console.log("[handleSubmit] errors:", errors);

    if (isValid) {
      console.log("[handleSubmit] 유효성 검사 통과");

      if (onSubmit) {
        console.log("[handleSubmit] onSubmit 호출");
        onSubmit(medication);
      }

      console.log("[handleSubmit] 라우터 네비게이션 시도");
      router.push("/medicine/register/interactionCheck");
    } else {
      console.log("[handleSubmit] 유효성 검사 실패:", errors);
    }
    // if (isValid && onSubmit) {
    //   onSubmit(medication);
    //   router.push("/medicine/register/interactionCheck");
    // }
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
          errors={errors.dateRange ?? []}
          showError={submitted}
        />
        <TakingCycle
          selectedType={medication.takingType}
          onTypeChange={handleTakingTypeChange}
          errors={errors.takingTypeRequired ?? []}
          showError={submitted}
        />
        <TakingCycleDetails
          takingType={medication.takingType}
          interval={medication.interval}
          particularDate={medication.particularDate}
          onIntervalChange={handleIntervalChange}
          onParticularDateChange={handleParticularDateChange}
          selectedDays={getSelectedDays()}
          onSelectedDaysChange={updateSelectedDays}
          errors={[
            ...(errors.takingType ?? []),
            ...(errors.interval ?? []),
            ...(errors.particularDate ?? []),
          ]}
          showError={submitted}
          startAt={medication.startAt}
          endAt={medication.endAt}
        />
        <PerAOnce />
        <Alarm />
        <Group
          groupName={medication.groupName}
          onGroupChange={(name) => updateField("groupName", name)}
        />
        <Button text="다음" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default registerForm;

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
