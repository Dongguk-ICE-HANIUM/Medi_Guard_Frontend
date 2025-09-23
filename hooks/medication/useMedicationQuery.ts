import { fetchPatientDrugDetail, registerPatientDrug } from "@/api/medicine";
import { mockMedicineStore, mockStoreUtils } from "@/data/mockMedicineStore";
import {
  CreateMedicationRequest,
  Drug,
  DrugGroup,
  Medication,
  UpdateMedicationRequest,
} from "@/types/medication";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

//Query Keys
export const medicationKeys = {
  all: ["medications"] as const,
  lists: () => [...medicationKeys.all, "list"] as const,
  detail: (id: string) => [...medicationKeys.all, "detail", id] as const,
  groups: () => ["drugGroups"] as const,
  calendarDrugs: () => ["calendarDrugs"] as const,
};

//딜레이
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 400));

//약물 목록 조회
export const useMedicationList = () => {
  return useQuery({
    queryKey: medicationKeys.lists(),
    queryFn: async (): Promise<Medication[]> => {
      await mockDelay();
      const medications = await mockMedicineStore.getMedicationsList();
      console.log("약물 목록 조회 성공");

      return medications;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 10,
  });
};

//약물 등록
export const useAddMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicationRequest): Promise<CreateMedicationRequest> => {
      try {
        const response = await registerPatientDrug(data);

      if(typeof response === 'string'){
        console.log('서버가 빈문자열 반환, 성공으로 처리');
        return data;
      }

      if (response.errorCode) {
          throw new Error(response.message || "약물 등록에 실패했습니다.");
      }

      return response.result || data;
 
       }catch(error){
        console.error("약물 등록 실패", error);
        throw error;
       }
    },
    onSuccess: (newMedication) => {
      console.log("약물 등록 성공", newMedication.name);

      // 캐시 즉시 업데이트
      queryClient.setQueryData(
        medicationKeys.lists(),
        (oldData: Medication[] | undefined) => {
          return oldData ? [...oldData, newMedication] : [newMedication];
        }
      );

      // CreateMedicationRequest에는 id가 없으므로 임시 ID 생성
  const tempId = Date.now().toString(); // 또는 uuid 등 사용
  
  console.log("약물 등록 성공", newMedication.name);

  // 캐시 즉시 업데이트
  queryClient.setQueryData(
    medicationKeys.lists(),
    (oldData: Medication[] | undefined) => {
      const medicationWithId = {
        id: tempId, // 임시 ID 추가
        ...newMedication,
        medicineInfo: { name: newMedication.name }, // 필요한 필드들 추가
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return oldData ? [...oldData, medicationWithId] : [medicationWithId];
    }
  );

      // 다른 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.calendarDrugs(),
      });

      queryClient.setQueryData(
        medicationKeys.calendarDrugs(),
        (oldData: Drug[] | undefined) => {
          const newCalendarDrug: Drug = {
            id: tempId,
            calendarDrugId: tempId,
            name: newMedication.name,
            startDate: newMedication.startAt,
            endDate: newMedication.endAt,
            timeSlot: newMedication.perDay,
            takenDaysCount: 0,
            missedDaysCount: 0,
          };
          return oldData ? [...oldData, newCalendarDrug] : [newCalendarDrug];
        }
      );
        Alert.alert(
          "등록 완료",
          `약물이 성공적으로 등록되었습니다.`,
          [{ text: "확인" }]
        );
    },
    onError: (error : any ) => {
      console.error("약물 등록 실패", error);
      Alert.alert("등록 실패", "약물 등록에 실패했습니다.", [{ text: "확인" }]);
    },
  });
};

//약물 수정
export const useUpdateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMedicationRequest;
    }): Promise<Medication> => {
      await mockDelay();
      console.log("약물 수정 요청: ", data);

      const updatedMedication = await mockMedicineStore.updateMedication(
        id,
        data
      );

      if (!updatedMedication) {
        throw new Error("약물을 찾을 수 없습니다.");
      }

      return updatedMedication;
    },
    onSuccess: (updatedMedication, variables) => {
      console.log("약물 수정 성공", updatedMedication.medicineInfo.name);

      // 캐시 즉시 업데이트
      queryClient.setQueryData(
        medicationKeys.lists(),
        (oldData: Medication[] | undefined) => {
          if (!oldData) return [updatedMedication];
          return oldData.map((med) =>
            med.id === variables.id ? updatedMedication : med
          );
        }
      );

      queryClient.setQueryData(
        medicationKeys.detail(variables.id),
        updatedMedication
      );

      queryClient.setQueryData(
        medicationKeys.calendarDrugs(),
        (oldData: Drug[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((drug) =>
            drug.id === variables.id
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

      // 다른 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.calendarDrugs(),
      });

      Alert.alert(
        "수정 완료",
        `"${updatedMedication.medicineInfo.name}" 약물이 수정되었습니다.`,
        [{ text: "확인" }]
      );
    },
    onError: (error) => {
      console.error("약물 수정 실패", error);
      Alert.alert("수정 실패", "약물 수정에 실패했습니다.", [{ text: "확인" }]);
    },
  });
};

//약물 삭제
export const useDeleteMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      id: string
    ): Promise<{ success: boolean; deletedName?: string }> => {
      await mockDelay();
      console.log("약물 삭제 요청: ", id);

      const medication = await mockMedicineStore.getMedication(id);
      const success = await mockMedicineStore.deleteMedication(id);

      return {
        success,
        deletedName: medication?.medicineInfo.name,
      };
    },
    onSuccess: (result, id) => {
      if (result.success) {
        console.log("약물 삭제 성공", result.deletedName);

        // 캐시 즉시 업데이트
        queryClient.setQueryData(
          medicationKeys.lists(),
          (oldData: Medication[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((med) => med.id !== id);
          }
        );

        queryClient.removeQueries({ queryKey: medicationKeys.detail(id) });
        queryClient.setQueryData(
          medicationKeys.calendarDrugs(),
          (oldData: Drug[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((drug) => drug.id !== id);
          }
        );

        // 다른 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: medicationKeys.detail(id) });
        queryClient.invalidateQueries({
          queryKey: medicationKeys.calendarDrugs(),
        });

        // Alert는 medicineList.tsx에서 처리
      }
    },
    onError: (error) => {
      console.error("약물 삭제 실패", error);
      Alert.alert("삭제 실패", "약물 삭제에 실패했습니다.", [{ text: "확인" }]);
    },
  });
};

//약물 상세 조회
export const useMedicationDetail = (id: string) => {
  console.log("[Hook] useMedicationDetail id =", id);

  return useQuery({
    queryKey: medicationKeys.detail(id),
    queryFn: async (): Promise<Medication> => {
      const medication = await fetchPatientDrugDetail(id);

      if (!medication.result) {
        throw new Error("약물을 찾을 수 없습니다.");
      }

      console.log("약물 상세 조회 성공", medication.result.medicineInfo.name);
      return medication.result;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

//약물 그룹 목록
export const useMedicationGroupList = () => {
  return useQuery({
    queryKey: medicationKeys.groups(),
    queryFn: async (): Promise<DrugGroup[]> => {
      await mockDelay();
      const groups = await mockMedicineStore.getDrugGroups();
      console.log("약물 그룹 목록 조회 성공");
      return groups;
    },
    staleTime: 1000 * 60 * 5,
  });
};

//복용 관련
export const useCalendarDrugs = () => {
  return useQuery({
    queryKey: medicationKeys.calendarDrugs(),
    queryFn: async (): Promise<Drug[]> => {
      await mockDelay();
      const drugs = await mockMedicineStore.getCalendarDrugs();
      console.log("캘린더 약물 목록 조회 성공");
      return drugs;
    },
    staleTime: 1000 * 60 * 5,
  });
};

//ai 루트
// 인식된 약물로 등록하는 mutation 추가
export const useAddMedicationFromRecognition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recognizedMedicine,
      medicationData,
    }: {
      recognizedMedicine: RecognizedMedicineInfo;
      medicationData: Partial<Medication>;
    }): Promise<Medication> => {
      await mockDelay();
      console.log("인식된 약물 등록 요청: ", recognizedMedicine.name);

      const newMedication: Medication = {
        id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        medicineInfo: {
          id: recognizedMedicine.id,
          name: recognizedMedicine.name,
          code: recognizedMedicine.code,
          effect: recognizedMedicine.effect,
          warning: recognizedMedicine.warning,
          sideEffect: recognizedMedicine.sideEffect,
          interaction: recognizedMedicine.interaction,
          depositMethod: recognizedMedicine.depositMethod,
        },
        startAt:
          medicationData.startAt || new Date().toISOString().split("T")[0],
        endAt:
          medicationData.endAt ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        takingType: medicationData.takingType || ("EVERY_DAY" as any),
        interval: medicationData.interval,
        specificDateList: medicationData.specificDateList,
        perDay: medicationData.perDay || 2,
        amount: medicationData.amount || 1,
        isActive: true,
        isEssential: false,
        groupName: "인식된 약물",
        groupId: medicationData.groupId || "group-1",
        notifiTakingList: [],
      };

      await mockMedicineStore.addMedication(newMedication);
      return newMedication;
    },
    onSuccess: (newMedication) => {
      console.log("인식된 약물 등록 성공", newMedication.medicineInfo.name);

      // 캐시 즉시 업데이트
      queryClient.setQueryData(
        medicationKeys.lists(),
        (oldData: Medication[] | undefined) => {
          return oldData ? [...oldData, newMedication] : [newMedication];
        }
      );

      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: medicationKeys.calendarDrugs(),
      });

      queryClient.setQueryData(
        medicationKeys.calendarDrugs(),
        (oldData: Drug[] | undefined) => {
          const newCalendarDrug: Drug = {
            id: newMedication.id,
            calendarDrugId: newMedication.id,
            name: newMedication.medicineInfo.name,
            startDate: newMedication.startAt,
            endDate: newMedication.endAt,
            timeSlot: newMedication.perDay,
            takenDaysCount: 0,
            missedDaysCount: 0,
          };
          return oldData ? [...oldData, newCalendarDrug] : [newCalendarDrug];
        }
      );

      setTimeout(() => {
        Alert.alert(
          "등록 완료",
          `${newMedication.medicineInfo.name}이(가) 등록되었습니다.`,
          [{ text: "확인" }]
        );
      }, 1000);
    },
    onError: (error) => {
      console.error("인식된 약물 등록 실패", error);
      Alert.alert("등록 실패", "약물 등록에 실패했습니다.", [{ text: "확인" }]);
    },
  });
};

//개발자용 유틸 훅
export const useDemoUtils = () => {
  const queryClient = useQueryClient();

  //현재 저장 데이터 통계 보기
  const logCurrentState = async () => {
    const stats = await mockStoreUtils.logCurrentState();
    Alert.alert(
      "현재 상태",
      `💊 약물: ${stats.medications}개\n 달력: ${stats.calendarDrugs}개\n 그룹: ${stats.groups}개`,
      [{ text: "확인" }]
    );
  };

  //모든 데이터 초기화
  const resetDemo = () => {
    Alert.alert(
      "데이터 초기화",
      "정말로 모든 시연용 데이터를 초기화하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "초기화",
          style: "destructive",
          onPress: async () => {
            await mockStoreUtils.resetAll();
            queryClient.clear(); // 모든 쿼리 캐시 삭제
            Alert.alert("초기화 완료", "모든 데이터가 초기화되었습니다.");
          },
        },
      ]
    );
  };

  const addSampleMedication = async () => {
    await mockStoreUtils.addSample();
    queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    queryClient.invalidateQueries({ queryKey: medicationKeys.calendarDrugs() });

    Alert.alert("샘플 추가 완료", "랜덤 샘플 약물이 추가되었습니다.", [
      { text: "확인" },
    ]);
  };

  //ai 루트
  const addRecognitionSample = async () => {
    await mockStoreUtils.addRecognizedSample();
    queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    queryClient.invalidateQueries({ queryKey: medicationKeys.calendarDrugs() });

    Alert.alert("인식 샘플 추가 완료", "휴온스아목시크라정이 추가되었습니다.", [
      { text: "확인" },
    ]);
  };

  return {
    logCurrentState,
    resetDemo,
    addSampleMedication,
    addRecognitionSample,
  };
};

//로딩 처리
export const useMedicationStatus = () => {
  const { isLoading: medicationsLoading, error: medicationsError } =
    useMedicationList();
  const { isLoading: groupsLoading, error: groupsError } =
    useMedicationGroupList();
  const { isLoading: calendarLoading, error: calendarError } =
    useCalendarDrugs();

  return {
    loading: medicationsLoading || groupsLoading || calendarLoading,
    error: medicationsError || groupsError || calendarError,
  };
};

//useMedicine훅
export const useMedicine = () => {
  const { data: medications = [] } = useMedicationList();
  const { data: drugGroups = [] } = useMedicationGroupList();
  const { data: calendarDrugs = [] } = useCalendarDrugs();
  const { loading, error } = useMedicationStatus();

  return {
    medications,
    drugGroups,
    calendarDrugs,
    loading,
    error: error?.message || null,

    addMedication: useAddMedication(),
    updateMedication: useUpdateMedication(),
    deleteMedication: useDeleteMedication(),

    refetchMedications: async () => {
      const queryClient = useQueryClient();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: medicationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: medicationKeys.groups() }),
        queryClient.invalidateQueries({
          queryKey: medicationKeys.calendarDrugs(),
        }),
      ]);
    },
  };
};
