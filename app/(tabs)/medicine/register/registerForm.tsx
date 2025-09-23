

import Button from "@/components/Button";
import Alarm from "@/components/register/Alarm/Alarm";
import DateRange from "@/components/register/DateRange";
import Group from "@/components/register/group/Group";
import PerAOnce from "@/components/register/PerAOnce";
import TakingCycle from "@/components/register/TakingCycle/TakingCycle";
import TakingCycleDetails from "@/components/register/TakingCycle/TakingCycleDetails";
import { colors } from "@/constants";
import { useMedicationForm } from "@/hooks/medication/useMedicationForm";
import { useAddMedication, useMedicationDetail, useUpdateMedication } from "@/hooks/medication/useMedicationQuery";
import { CreateMedicationRequest, UpdateMedicationRequest } from "@/types/medication";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";


const registerForm = () => {
  const params = useLocalSearchParams<{
    mode? : string;
    drugId? :string;
    drugName? : string;
  }>();

  const isEditMode = params.mode === "edit";

  const {data: editingMedication} = useMedicationDetail(
    params.drugId || "",
  );

  const addMedication = useAddMedication(); //약물 등록
  const updateMedication =  useUpdateMedication(); //약물 수정

  const selectedMedicine = useMemo(()=> ({id: params.drugId || '', name: params.drugName || ''}), [params.drugId, params.drugName]);

  //초기상태 (편집 모드)
  const getInitialValues = () : Partial<CreateMedicationRequest> | undefined => {
    if(isEditMode && editingMedication){
      return {
        startAt : editingMedication.startAt,
        endAt : editingMedication.endAt,
        takingType : editingMedication.takingType,
        interval : editingMedication.interval,
        specificDateList: editingMedication.specificDateList,
        perDay : editingMedication.perDay,
        amount : editingMedication.amount,
        groupId : editingMedication.groupId,
      };
    }
    return undefined;
  }
  
  const {
    medication,
    errors,
    submitted,
    updateField,
    validateForm,
    getSelectedDays,
    updateSelectedDays,
  } = useMedicationForm(params.drugId || "", params.drugName || "", getInitialValues())
 

  //제출
  const handleSubmit = async () => {

    const {isValid} = validateForm();

    if(!isValid) {
      return;
    }

    if(isEditMode && params.drugId){
      const updateData : UpdateMedicationRequest = {
        startAt : medication.startAt,
        endAt : medication.endAt,
        takingType : medication.takingType,
        interval : medication.interval,
        specificDateList: medication.specificDateList,
        perDay : medication.perDay,
        amount : medication.amount,
        groupId : medication.groupId,
        groupName : "",
        isActive : true,
        isEssential : false, //다시 확인
      }

      //수정
      updateMedication.mutate(
        { id: params.drugId, data:updateData  },
        {
          onSuccess: () => {
            Alert.alert("수정 완료", "약물 정보가 수정되었습니다.", [
              { text: "확인", onPress: () => router.back() }
            ]);
          },
        }
        );
    }else{
      //등록
      addMedication.mutate(medication, {
        onSuccess : () => {
          router.replace("/medicine");
        },
      });
    }
  };


  const formSections =  [
    {
      id: "drugName",
      component: (
        <View style={styles.nameContainer}>
          <Text style={styles.label}>{params.drugName}</Text>
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
          onTypeChange={(takingType) => updateField("takingType",takingType)}
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
          onIntervalChange={(interval) => updateField("interval",interval)}
          onSpecificDateListChange={(dates)=> updateField("specificDateList",dates)}
          selectedDays={getSelectedDays()}
          onSelectedDaysChange={updateSelectedDays}
          // onIsActiveChange={(isActive) => updateField("isActive", isActive)
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
          // groupName={medication.groupName || ""}
          groupName=""
          onGroupChange={(id)=> updateField("groupId", id)}
          onRemoveFromGroup={() => updateField("groupId", "")}
          showRemoveButton={isEditMode}
        />
      ),
    },
    {
      id: "button",
      component: (
        <Button text={isEditMode ? "저장" : "다음"} onPress={handleSubmit}
        disabled={addMedication.isPending || updateMedication.isPending} />
      ),
    },
  ];

  return (
    <FlatList
      data={formSections}
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
    borderBottomColor : colors.TEXT_GRAY,
    borderBottomWidth :0.3,
  },
  label: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom : 11,
  },

});
