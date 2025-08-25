// import Button from "@/components/Button";
// import Input from "@/components/Input/Input";
// import Alarm from "@/components/register/Alarm/Alarm";
// import DateRange from "@/components/register/DateRange";
// import PerAOnce from "@/components/register/PerAOnce";
// import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
// import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
// import Group from "@/components/register/group/Group";
// import { mockMedicineStore } from "@/data/mockMedicineStore";

// import { useMedicationForm } from "@/hooks/medication/useMedicationForm";
// import { useMedicationList } from "@/hooks/medication/useMedicationQuery";
// import { Medication, MedicineInfo, TakingType } from "@/types/medication";
// import { useQueryClient } from "@tanstack/react-query";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";

// export interface registerFormProps {
//   selected?: MedicineInfo; //이름 등록 때문에 ? 붙임
//   onSubmit?: (medication: Medication) => void;
// }
// const registerForm = ({ onSubmit }: registerFormProps) => {
//   const router = useRouter();
//   const params = useLocalSearchParams<{
//     mode?: string;
//     drugId?: string;
//     drugName?: string;
//     startAt?: string;
//     endAt?: string;
//     takingType?: string;
//     perDay?: string;
//     amount?: string;
//     groupName?: string;
//     isActive?: string;
//   }>();
//   const queryClient = useQueryClient();
//   const { data: medications = [] } = useMedicationList();
//   const selected = medications.find((med) => med.id === params.drugId);

//   //이름 등록 때문
//   const [drugName, setDrugName] = useState<string>(
//     selected?.medicineInfo?.name || params.drugName || ""
//   );

//   // selected가 없을 때 기본값 설정
//   const defaultMedicineInfo: MedicineInfo = {
//     id: "temp-default",
//     name: "새로운 약물", //이름 등록 때문에 drugName 추가
//     code: "",
//     effect: "",
//     warning: "",
//     sideEffect: "",
//     interaction: "",
//     depositMethod: "",
//   };
//   const medicineInfo = selected?.medicineInfo || defaultMedicineInfo;

//   // 편집 모드일 때 초기값 설정
//   const getInitialValues = () => {
//     if (params.mode === "edit" && params.drugId) {
//       return {
//         startAt: params.startAt || "",
//         endAt: params.endAt || "",
//         takingType: (params.takingType as TakingType) || TakingType.UNSELECTED,
//         perDay: params.perDay ? parseInt(params.perDay) : 1,
//         amount: params.amount ? parseFloat(params.amount) : 1.0,
//         groupName: params.groupName || "",
//         isActive: params.isActive === "true",
//       };
//     }
//     return undefined;
//   };

//   const {
//     medication,
//     errors,
//     submitted,
//     updateField,
//     validateForm,
//     getSelectedDays,
//     updateSelectedDays,
//   } = useMedicationForm(medicineInfo, getInitialValues());

//   // 그룹에서 약물 해제 처리
//   const handleRemoveFromGroup = async () => {
//     if (params.mode === "edit" && params.drugId) {
//       try {
//         await mockMedicineStore.updateMedication(params.drugId, {
//           groupName: undefined,
//           groupId: undefined,
//         });
//         updateField("groupName", "");
//         console.log("그룹에서 약물 해제 완료");
//       } catch (error) {
//         console.error("그룹에서 약물 해제 중 오류:", error);
//       }
//     }
//   };

//   // 필드 업데이트 시 디버그
//   const debugUpdateField = <K extends keyof Medication>(
//     field: K,
//     value: Medication[K]
//   ) => {
//     console.log("[updateField]", field, "=>", value);
//     updateField(field, value);
//   };

//   //다음
//   const handleSubmit = async () => {
//     console.log("[handleSubmit] medication:", medication);
//     const { isValid, errors: all } = validateForm();

//     console.log("[handleSubmit] isValid:", isValid);
//     console.log("[handleSubmit] errors:", errors);

//     if (isValid) {
//       if (onSubmit) {
//         onSubmit(medication);
//       }

//       if (params.mode === "edit" && params.drugId) {
//         // 편집 모드) mockStorage로 데이터 업데이트 후 상세페이지로 이동
//         try {
//           console.log("편집 모드 - 데이터 업데이트 시작");

//           const updatedMedication = await mockMedicineStore.updateMedication(
//             params.drugId,
//             {
//               startAt: medication.startAt,
//               endAt: medication.endAt,
//               takingType: medication.takingType,
//               interval: medication.interval,
//               specificDateList: medication.specificDateList,
//               perDay: medication.perDay,
//               amount: medication.amount,
//               groupName: medication.groupName,
//               isActive: medication.isActive,
//               isEssential: medication.isEssential,
//             }
//           );

//           // React Query 캐시 즉시 업데이트
//           if (updatedMedication) {
//             // 상세 정보 캐시 업데이트
//             queryClient.setQueryData(
//               ["medications", "detail", params.drugId],
//               updatedMedication
//             );

//             // 목록 캐시 업데이트
//             queryClient.setQueryData(
//               ["medications", "list"],
//               (oldData: Medication[] | undefined) => {
//                 if (!oldData) return [updatedMedication];
//                 return oldData.map((med) =>
//                   med.id === params.drugId ? updatedMedication : med
//                 );
//               }
//             );

//             // 캘린더 약물 캐시 업데이트
//             queryClient.setQueryData(
//               ["calendarDrugs"],
//               (oldData: any[] | undefined) => {
//                 if (!oldData) return [];
//                 return oldData.map((drug) =>
//                   drug.id === params.drugId
//                     ? {
//                         ...drug,
//                         name: updatedMedication.medicineInfo.name,
//                         startDate: updatedMedication.startAt,
//                         endDate: updatedMedication.endAt,
//                         timeSlot: updatedMedication.perDay,
//                       }
//                     : drug
//                 );
//               }
//             );
//           }

//           console.log("편집 완료 - 상세페이지로 이동");
//           router.back();
//         } catch (error) {
//           console.error("편집 중 오류 발생:", error);
//         }
//       } else {
//         // 새로 등록) 다음 단계로 이동하면서 약물 데이터 전달

//         //이름 등록 때문에
//         const medicationWithName = {
//           ...medication,
//           medicineInfo: {
//             ...medication.medicineInfo,
//             name: drugName,
//           },
//         };

//         const medicationData = encodeURIComponent(
//           JSON.stringify(medicationWithName)
//         );
//         router.push({
//           pathname: "/medicine/register/interactionCheck",
//           params: { medicationData },
//         });
//       }
//     } else {
//       console.log("[handleSubmit] 유효성 검사 실패 - 페이지 이동 불가");
//     }
//   };

//   const handleTakingTypeChange = (takingType: TakingType) => {
//     updateField("takingType", takingType);
//   };

//   const handleIntervalChange = (interval: number) => {
//     updateField("interval", interval);
//   };

//   const handleSpecificDateListChange = (dates: string[]) => {
//     updateField("specificDateList", dates);
//   };

//   // flatList에 들어갈 요소들
//   const getFormSections = () => [
//     {
//       id: "drugName",
//       component: (
//         <View style={styles.nameContainer}>
//           {/* <Text style={styles.name}>{medicineInfo.name}</Text> */}
//           <Text style={styles.label}>약물 이름</Text>
//           <Input value={drugName} onChangeText={setDrugName} />
//         </View>
//       ),
//     },
//     {
//       id: "dateRange",
//       component: (
//         <DateRange
//           startAt={medication.startAt}
//           endAt={medication.endAt}
//           onStartChange={(date) => updateField("startAt", date)}
//           onEndChange={(date) => updateField("endAt", date)}
//           errors={errors.dateRange ?? []}
//           showError={submitted}
//         />
//       ),
//     },
//     {
//       id: "takingCycle",
//       component: (
//         <TakingCycle
//           selectedType={medication.takingType}
//           onTypeChange={handleTakingTypeChange}
//           errors={errors.takingTypeRequired ?? []}
//           showError={submitted}
//         />
//       ),
//     },
//     {
//       id: "takingCycleDetails",
//       component: (
//         <TakingCycleDetails
//           takingType={medication.takingType}
//           interval={medication.interval}
//           specificDateList={medication.specificDateList}
//           onIntervalChange={handleIntervalChange}
//           onSpecificDateListChange={handleSpecificDateListChange}
//           selectedDays={getSelectedDays()}
//           onSelectedDaysChange={updateSelectedDays}
//           onIsActiveChange={(isActive) => updateField("isActive", isActive)}
//           errors={[
//             ...(errors.takingType ?? []),
//             ...(errors.interval ?? []),
//             ...(errors.specificDateList ?? []),
//           ]}
//           showError={submitted}
//           startAt={medication.startAt}
//           endAt={medication.endAt}
//         />
//       ),
//     },
//     {
//       id: "perAOnce",
//       component: (
//         <PerAOnce
//           perDay={medication.perDay}
//           amount={medication.amount}
//           onPerDayChange={(value) => updateField("perDay", value)}
//           onAmountChange={(value) => updateField("amount", value)}
//         />
//       ),
//     },
//     { id: "alarm", component: <Alarm /> },
//     {
//       id: "group",
//       component: (
//         <Group
//           groupName={medication.groupName || ""}
//           onGroupChange={(name) => updateField("groupName", name)}
//           onRemoveFromGroup={handleRemoveFromGroup}
//           showRemoveButton={params.mode === "edit"}
//         />
//       ),
//     },
//     {
//       id: "button",
//       component: (
//         <Button
//           text={params.mode === "edit" ? "저장" : "다음"}
//           onPress={handleSubmit}
//         />
//       ),
//     },
//   ];

//   return (
//     <FlatList
//       data={getFormSections()}
//       renderItem={({ item }) => item.component}
//       keyExtractor={(item) => item.id}
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.contentContainer}
//     />
//   );
// };

// export default registerForm;

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 25,
//     marginHorizontal: 10,
//     flex: 1,
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   nameContainer: {
//     // borderBottomWidth: 0.5,
//     // borderBottomColor: colors.TEXT_GRAY,
//     paddingBottom: 15,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "600",
//     paddingBottom: 8,
//   },

//   // name: {
//   //   fontSize: 23,
//   //   fontWeight: "bold",
//   //   paddingBottom: 10,
//   // },
// });

// app/medicine/registerForm.tsx
import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import Alarm from "@/components/register/Alarm/Alarm";
import DateRange from "@/components/register/DateRange";
import PerAOnce from "@/components/register/PerAOnce";
import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
import Group from "@/components/register/group/Group";
import { mockMedicineStore } from "@/data/mockMedicineStore";

import { useMedicationForm } from "@/hooks/medication/useMedicationForm";
import { useMedicationList } from "@/hooks/medication/useMedicationQuery";
import { Medication, MedicineInfo, TakingType } from "@/types/medication";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";

import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

export interface registerFormProps {
  selected?: MedicineInfo;
  onSubmit?: (medication: Medication) => void;
}

const registerForm = ({ onSubmit }: registerFormProps) => {
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
    recognizedMedicine?: string;
    imageUri?: string;
  }>();

  const queryClient = useQueryClient();
  const { data: medications = [] } = useMedicationList();
  const selected = medications.find((med) => med.id === params.drugId);

  const [recogInfo, setRecogInfo] = useState<RecognizedMedicineInfo | null>(
    null
  );
  const isEdit = params.mode === "edit" && !!params.drugId;

  useEffect(() => {
    if (params.recognizedMedicine) {
      try {
        const parsed = JSON.parse(
          params.recognizedMedicine
        ) as RecognizedMedicineInfo;
        setRecogInfo(parsed);
      } catch {
        setRecogInfo(null);
      }
    }
  }, [params.recognizedMedicine]);

  const [drugName, setDrugName] = useState<string>(
    selected?.medicineInfo?.name || params.drugName || recogInfo?.name || ""
  );

  const defaultMedicineInfo: MedicineInfo = useMemo(
    () => ({
      id: "temp-default",
      name: recogInfo?.name || "새로운 약물",
      code: recogInfo?.code || "",
      effect: "",
      warning: "",
      sideEffect: "",
      interaction: "",
      depositMethod: "",
    }),
    [recogInfo]
  );
  const medicineInfo = selected?.medicineInfo || defaultMedicineInfo;

  const getInitialValues = () => {
    if (isEdit) {
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

  useEffect(() => {
    if (!isEdit && recogInfo) {
      // AI 등록 시에도 날짜는 사용자가 직접 입력하도록 함
      if (!drugName) setDrugName(recogInfo.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recogInfo]);

  const handleRemoveFromGroup = async () => {
    if (isEdit && params.drugId) {
      try {
        await mockMedicineStore.updateMedication(params.drugId, {
          groupName: undefined,
          groupId: undefined,
        });
        updateField("groupName", "");
      } catch (error) {
        console.error("그룹에서 약물 해제 중 오류:", error);
      }
    }
  };

  const handleSubmit = async () => {
    const { isValid } = validateForm();

    if (isValid) {
      if (onSubmit) onSubmit(medication);

      if (isEdit && params.drugId) {
        try {
          const updatedMedication = await mockMedicineStore.updateMedication(
            params.drugId,
            {
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
            }
          );

          if (updatedMedication) {
            queryClient.setQueryData(
              ["medications", "detail", params.drugId],
              updatedMedication
            );

            queryClient.setQueryData(
              ["medications", "list"],
              (oldData: Medication[] | undefined) => {
                if (!oldData) return [updatedMedication];
                return oldData.map((med) =>
                  med.id === params.drugId ? updatedMedication : med
                );
              }
            );

            queryClient.setQueryData(
              ["calendarDrugs"],
              (oldData: any[] | undefined) => {
                if (!oldData) return [];
                return oldData.map((drug) =>
                  drug.id === params.drugId
                    ? {
                        ...drug,
                        name: updatedMedication.medicineInfo.name,
                        startDate: updatedMedication.startAt,
                        endDate: updatedMedication.endAt,
                        timeSlot: updatedMedication.perDay,
                      }
                    : drug
                );
              }
            );
          }

          router.back();
        } catch (error) {
          console.error("편집 중 오류 발생:", error);
        }
      } else {
        // 직접 등록: AI 로직을 거치지 않고 바로 저장
        try {
          const completeMedication: Medication = {
            id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            medicineInfo: {
              id: `direct_${Date.now()}`,
              name: drugName,
              code: "",
              effect: "",
              warning: "",
              sideEffect: "",
              interaction: "",
              depositMethod: "",
            },
            startAt: medication.startAt,
            endAt: medication.endAt,
            takingType: medication.takingType,
            interval: medication.interval,
            specificDateList: medication.specificDateList,
            perDay: medication.perDay,
            amount: medication.amount,
            isActive: medication.isActive,
            isEssential: medication.isEssential,
            groupName: "",
            groupId: "",
            notifiTakingList: [],
            takenDates: {},
          };

          // 직접 저장
          await mockMedicineStore.addMedication(completeMedication);

          // React Query 캐시 업데이트
          queryClient.setQueryData(
            ["medications", "list"],
            (oldData: Medication[] | undefined) => {
              if (!oldData) return [completeMedication];
              return [...oldData, completeMedication];
            }
          );

          queryClient.invalidateQueries({ queryKey: ["medications", "list"] });
          queryClient.invalidateQueries({ queryKey: ["calendarDrugs"] });

          Alert.alert("등록 완료", "약물이 성공적으로 등록되었습니다.", [
            {
              text: "확인",
              onPress: () => router.navigate("/medicine"),
            },
          ]);
        } catch (error) {
          console.error("직접 등록 중 오류 발생:", error);
          Alert.alert("오류", "약물 등록에 실패했습니다.");
        }
      }
    } else {
      Alert.alert("입력 오류", "필수 입력 항목을 확인해주세요.");
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

  const header = recogInfo ? (
    <View style={styles.recognitionInfo}>
      <View style={styles.recognitionHeader}>
        <Ionicons name="camera" size={20} color={colors.PINK} />
        <Text style={styles.recognitionTitle}>사진으로 인식된 약물</Text>
      </View>
      <Text style={styles.recognizedName}>{recogInfo.name}</Text>
      <Text style={styles.recognizedCode}>식별코드: {recogInfo.code}</Text>
    </View>
  ) : null;

  const getFormSections = () => [
    {
      id: "drugName",
      component: (
        <View style={styles.nameContainer}>
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
          showRemoveButton={isEdit}
        />
      ),
    },
    {
      id: "button",
      component: (
        <Button text={isEdit ? "저장" : "다음"} onPress={handleSubmit} />
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
      ListHeaderComponent={header}
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
    paddingBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
  recognitionInfo: {
    backgroundColor: "#F0F8FF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.PINK,
  },
  recognitionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  recognitionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.PINK,
  },
  recognizedName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.BLACK,
    marginBottom: 5,
  },
  recognizedCode: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },
});
