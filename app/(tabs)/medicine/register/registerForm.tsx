import { removeDrugFromGroup, updateDrugDetail } from "@/api/medicine";
import Button from "@/components/Button";
import Alarm from "@/components/register/Alarm/Alarm";
import DateRange from "@/components/register/DateRange";
import PerAOnce from "@/components/register/PerAOnce";
import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
import Group from "@/components/register/group/Group";
import { colors } from "@/constants";

import { useMedicationForm } from "@/hooks/useMedicationForm";
import { Medication, MedicineInfo, TakingType } from "@/types/medication";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export interface registerFormProps {
  selected: MedicineInfo;
  onSubmit?: (medication: Medication) => void;
}
const registerForm = ({ selected, onSubmit }: registerFormProps) => {
  // selected가 없을 때 기본값 설정
  const defaultMedicineInfo: MedicineInfo = {
    id: "default",
    name: "새로운 약물",
    code: "",
    effect: "",
    warning: "",
    sideEffect: "",
    interaction: "",
    deposit_method: "",
  };

  const medicineInfo = selected || defaultMedicineInfo;
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    drugId?: string;
    drugName?: string;
    startAt?: string;
    endAt?: string;
    takingType?: string;
    perDay?: string;
    amount?: string;
    groupName?: string;
    isActive?: string;
  }>();

  // 편집 모드일 때 초기값 설정
  const getInitialValues = () => {
    if (params.mode === "edit" && params.drugId) {
      return {
        startAt: params.startAt || "",
        endAt: params.endAt || "",
        takingType: (params.takingType as TakingType) || TakingType.UNSELECTED,
        perDay: params.perDay ? parseInt(params.perDay) : 1,
        amount: params.amount ? parseFloat(params.amount) : 1.0,
        groupName: params.groupName || "",
        isActive: params.isActive === "true",
      };
    }
    return undefined;
  };

  const {
    medication,
    errors,
    submitted,
    updateField,
    validateForm,
    getSelectedDays,
    updateSelectedDays,
  } = useMedicationForm(medicineInfo, getInitialValues());

  // 그룹에서 약물 해제 처리
  const handleRemoveFromGroup = async () => {
    if (params.mode === "edit" && params.drugId) {
      try {
        console.log("그룹에서 약물 해제 시작");
        await removeDrugFromGroup(params.drugId);
        updateField("groupName", "");
        console.log("그룹에서 약물 해제 완료");
      } catch (error) {
        console.error("그룹에서 약물 해제 중 오류:", error);
      }
    }
  };

  // 필드 업데이트 시 디버그
  const debugUpdateField = <K extends keyof Medication>(
    field: K,
    value: Medication[K]
  ) => {
    console.log("[updateField]", field, "=>", value);
    updateField(field, value);
  };

  const handleSubmit = async () => {
    console.log("[handleSubmit] medication:", medication);
    const { isValid, errors: all } = validateForm();

    console.log("[handleSubmit] isValid:", isValid);
    console.log("[handleSubmit] errors:", errors);

    if (isValid) {
      if (onSubmit) {
        onSubmit(medication);
      }

      if (params.mode === "edit" && params.drugId) {
        // 편집 모드) API로 데이터 업데이트 후 상세페이지로 이동
        try {
          console.log("편집 모드 - 데이터 업데이트 시작");
          await updateDrugDetail(params.drugId, {
            startAt: medication.startAt,
            endAt: medication.endAt,
            takingType: medication.takingType,
            perDay: medication.perDay,
            amount: medication.amount,
            groupName: medication.groupName,
            isActive: medication.isActive,
          });
          console.log("편집 완료 - 상세페이지로 이동");
          router.back();
        } catch (error) {
          console.error("편집 중 오류 발생:", error);
        }
      } else {
        // 새로 등록) 다음 단계로 이동
        router.push("/medicine/register/interactionCheck");
      }
    } else {
      console.log("[handleSubmit] 유효성 검사 실패 - 페이지 이동 불가");
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
        <Text style={styles.name}>{medicineInfo.name}</Text>
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
          onIsActiveChange={(isActive) => updateField("isActive", isActive)}
          errors={[
            ...(errors.takingType ?? []),
            ...(errors.interval ?? []),
            ...(errors.particularDate ?? []),
          ]}
          showError={submitted}
          startAt={medication.startAt}
          endAt={medication.endAt}
        />
        <PerAOnce
          perDay={medication.perDay}
          amount={medication.amount}
          onPerDayChange={(value) => updateField("perDay", value)}
          onAmountChange={(value) => updateField("amount", value)}
        />
        <Alarm />
        <Group
          groupName={medication.groupName}
          onGroupChange={(name) => updateField("groupName", name)}
          onRemoveFromGroup={handleRemoveFromGroup}
          showRemoveButton={params.mode === "edit"}
        />

        <Button
          text={params.mode === "edit" ? "저장" : "다음"}
          onPress={handleSubmit}
        />
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
