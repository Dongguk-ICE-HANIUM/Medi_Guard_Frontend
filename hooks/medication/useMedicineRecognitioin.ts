// hooks/useMedicineRecognition.ts
import { mockRecognizedMedicine } from "@/data/mockMedicineRecongition";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";
import { useMutation } from "@tanstack/react-query";

// 시연용 약물 인식 훅
export const useMedicineRecognition = () => {
  return useMutation({
    mutationFn: async (imageUri: string): Promise<RecognizedMedicineInfo> => {
      // 시연용 딜레이
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock 데이터 반환
      return {
        ...mockRecognizedMedicine,
        imageUri,
      };
    },
    onSuccess: (data) => {
      console.log("약물 인식 성공:", data.name);
    },
    onError: (error) => {
      console.error("약물 인식 실패:", error);
    },
  });
};

// 인식된 약물 정보를 CreateMedicationRequest 형태로 변환하는 유틸리티
export const convertRecognizedToMedicationRequest = (
  recognizedMedicine: RecognizedMedicineInfo,
  formData: {
    startAt: string;
    endAt: string;
    takingType: any;
    perDay: number;
    amount: number;
    groupId?: string;
    interval?: number;
    specificDateList?: string[];
  }
) => {
  return {
    drugId: recognizedMedicine.id,
    name: recognizedMedicine.name,
    startAt: formData.startAt,
    endAt: formData.endAt,
    takingType: formData.takingType,
    perDay: formData.perDay,
    amount: formData.amount,
    groupId: formData.groupId || "group-1",
    interval: formData.interval,
    specificDateList: formData.specificDateList,
  };
};
