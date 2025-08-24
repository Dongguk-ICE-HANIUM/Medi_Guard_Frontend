import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import Alarm from "@/components/register/Alarm/Alarm";
import DateRange from "@/components/register/DateRange";
import PerAOnce from "@/components/register/PerAOnce";
import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
import Group from "@/components/register/group/Group";
import { mockMedicineStore } from "@/data/mockMedicineStore";

import { useMedicationForm } from "@/hooks/useMedicationForm";
import { Medication, MedicineInfo, TakingType } from "@/types/medication";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export interface registerFormProps {
  selected?: MedicineInfo; //이름 등록 때문에 ? 붙임
  onSubmit?: (medication: Medication) => void;
}
const registerForm = ({ selected, onSubmit }: registerFormProps) => {
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

  //이름 등록 때문
  const [drugName, setDrugName] = useState<string>(
    selected?.name || params.drugName || ""
  );

  // selected가 없을 때 기본값 설정
  const defaultMedicineInfo: MedicineInfo = {
    id: "temp-default",
    name: "새로운 약물", //이름 등록 때문에 drugName 추가
    code: "",
    effect: "",
    warning: "",
    sideEffect: "",
    interaction: "",
    depositMethod: "",
  };
  const medicineInfo = selected || defaultMedicineInfo;

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
        await mockMedicineStore.updateMedication(params.drugId, {
          groupName: undefined,
          groupId: undefined,
        });
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

  //다음
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
        // 편집 모드) mockStorage로 데이터 업데이트 후 상세페이지로 이동
        try {
          console.log("편집 모드 - 데이터 업데이트 시작");

          await mockMedicineStore.updateMedication(params.drugId, {
            startAt: medication.startAt,
            endAt: medication.endAt,
            takingType: medication.takingType,
            interval: medication.interval,
            specificDateList: medication.specificDateList,
            perDay: medication.perDay,
            amount: medication.amount,
            groupName: medication.groupName,
            isActive: medication.isActive,
            isEssential: medication.isEssential,
          });
          console.log("편집 완료 - 상세페이지로 이동");
          router.back();
        } catch (error) {
          console.error("편집 중 오류 발생:", error);
        }
      } else {
        // 새로 등록) 다음 단계로 이동하면서 약물 데이터 전달

        //이름 등록 때문에
        const medicationWithName = {
          ...medication,
          medicineInfo: {
            ...medication.medicineInfo,
            name: drugName,
          },
        };

        const medicationData = encodeURIComponent(
          JSON.stringify(medicationWithName)
        );
        router.push({
          pathname: "/medicine/register/interactionCheck",
          params: { medicationData },
        });
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

  const handleSpecificDateListChange = (dates: string[]) => {
    updateField("specificDateList", dates);
  };

  // flatList에 들어갈 요소들
  const getFormSections = () => [
    {
      id: "drugName",
      component: (
        <View style={styles.nameContainer}>
          {/* <Text style={styles.name}>{medicineInfo.name}</Text> */}
          <Text style={styles.label}>약물 이름</Text>
          <Input value={drugName} onChangeText={setDrugName} />
        </View>
      ),
    },
    {
      id: "dateRange",
      component: (
        <DateRange
          startAt={medication.startAt}
          endAt={medication.endAt}
          onStartChange={(date) => updateField("startAt", date)}
          onEndChange={(date) => updateField("endAt", date)}
          errors={errors.dateRange ?? []}
          showError={submitted}
        />
      ),
    },
    {
      id: "takingCycle",
      component: (
        <TakingCycle
          selectedType={medication.takingType}
          onTypeChange={handleTakingTypeChange}
          errors={errors.takingTypeRequired ?? []}
          showError={submitted}
        />
      ),
    },
    {
      id: "takingCycleDetails",
      component: (
        <TakingCycleDetails
          takingType={medication.takingType}
          interval={medication.interval}
          specificDateList={medication.specificDateList}
          onIntervalChange={handleIntervalChange}
          onSpecificDateListChange={handleSpecificDateListChange}
          selectedDays={getSelectedDays()}
          onSelectedDaysChange={updateSelectedDays}
          onIsActiveChange={(isActive) => updateField("isActive", isActive)}
          errors={[
            ...(errors.takingType ?? []),
            ...(errors.interval ?? []),
            ...(errors.specificDateList ?? []),
          ]}
          showError={submitted}
          startAt={medication.startAt}
          endAt={medication.endAt}
        />
      ),
    },
    {
      id: "perAOnce",
      component: (
        <PerAOnce
          perDay={medication.perDay}
          amount={medication.amount}
          onPerDayChange={(value) => updateField("perDay", value)}
          onAmountChange={(value) => updateField("amount", value)}
        />
      ),
    },
    { id: "alarm", component: <Alarm /> },
    {
      id: "group",
      component: (
        <Group
          groupName={medication.groupName || ""}
          onGroupChange={(name) => updateField("groupName", name)}
          onRemoveFromGroup={handleRemoveFromGroup}
          showRemoveButton={params.mode === "edit"}
        />
      ),
    },
    {
      id: "button",
      component: (
        <Button
          text={params.mode === "edit" ? "저장" : "다음"}
          onPress={handleSubmit}
        />
      ),
    },
  ];

  return (
    <FlatList
      data={getFormSections()}
      renderItem={({ item }) => item.component}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default registerForm;

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
    marginHorizontal: 10,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  nameContainer: {
    // borderBottomWidth: 0.5,
    // borderBottomColor: colors.TEXT_GRAY,
    paddingBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },

  // name: {
  //   fontSize: 23,
  //   fontWeight: "bold",
  //   paddingBottom: 10,
  // },
});
