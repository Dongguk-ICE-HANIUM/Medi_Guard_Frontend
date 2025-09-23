import { mockMedicineStore } from "@/data/mockMedicineStore";
import { ApiResponse } from "@/types/api";
import {
  CreateMedicationRequest,
  CreateMedicationResponse,
  DrugDetailResponse,
  Medication,
  UpdateMedicationRequest,
  UpdateMedicationResponse,
} from "@/types/medication";
import apiClient from "./apiClient";

//  Mock 데이터 (서버 API 시뮬레이션)
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// ===== 실제 API 호출 함수들=====
//health api 불러오기
export const fetchHealthApi = async (): Promise<
  ApiResponse<{ healthApiList: { id: string; name: string }[] }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ healthApiList: { id: string; name: string }[] }>
    >("/api/healthz");
    console.log("health api 불러오기 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("health api 불러오기 실패:", error);
    throw new Error(
      error?.response?.data?.message || "health api 불러오기에 실패했습니다."
    );
  }
};

//환자 약물 등록
export const registerPatientDrug = async (
  requestData: CreateMedicationRequest
): Promise<CreateMedicationResponse> => {
  try {
    const response = await apiClient.post<CreateMedicationResponse>(
      `/api/patient-drug`,
      requestData
    );
    console.log("환자 약물 등록 성공:", requestData);
    
    return response.data;
  } catch (error: any) {
    console.error("환자 약물 등록 실패:", error);
    throw new Error(
      error?.response?.data?.message || "환자 약물 등록에 실패했습니다."
    );
  }
};


//환자 약물 상세 조회
export const fetchPatientDrugDetail = async (
  patientDrugId: string
): Promise<DrugDetailResponse> => {
  try {
    const response = await apiClient.get<DrugDetailResponse>(
      `api/patient-drug/${patientDrugId}`
    );
    console.log("환자 약물 상세 조회 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("환자 약물 상세 조회 실패:", error);
    throw new Error(
      error?.response?.data?.message || "환자 약물 상세 조회에 실패했습니다."
    );
  }
};

//환자 약물 삭제
export const deletePatientDrug = async (patientDrugId: string) => {
  try {
    const response = await apiClient.delete(
      `/api/patient-drug/${patientDrugId}`
    );
    console.log("환자 약물 삭제 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("환자 약물 삭제 실패:", error);
    throw new Error(
      error?.response?.data?.message || "환자 약물 삭제에 실패했습니다."
    );
  }
};

//환자 약물 활성화 상태 변경
export const togglePatientDrugActive = async (
  patientDrugId: string,
  statusData: UpdateMedicationRequest
): Promise<UpdateMedicationResponse> => {
  try {
    const response = await apiClient.patch(
      `/api/patient-drug/${patientDrugId}`,
      statusData
    );
    console.log("환자 약물 활성화 상태 변경 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("환자 약물 활성화 상태 변경 실패:", error);
    throw new Error(
      error?.response?.data?.message ||
        "환자 약물 활성화 상태 변경에 실패했습니다."
    );
  }
};

//환자 약물에서 약물 그룹 연결 해제
export const releasePatientDrugFromGroup = async (patientDrugId: string) => {
  try {
    const response = await apiClient.patch(
      `/api/patient-drug/${patientDrugId}/release`
    );
    console.log("환자 약물에서 약물 그룹 연결 해제 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("환자 약물에서 약물 그룹 연결 해제 실패:", error);
    throw new Error(
      error?.response?.data?.message ||
        "환자 약물에서 약물 그룹 연결 해제에 실패했습니다."
    );
  }
};

//약물 그룹 조회
export const fetchDrugGroupsReal = async (): Promise<
  ApiResponse<{ drugGroupList: { id: string; name: string }[] }>
> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ drugGroupList: { id: string; name: string }[] }>
    >("/api/drug-group");
    console.log("약물 그룹 조회 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("약물 그룹 조회 실패:", error);
    throw new Error(
      error?.response?.data?.message || "약물 그룹 조회에 실패했습니다."
    );
  }
};

//
//API 연동
//

// 기존 Mock 함수들...

// 약물 정보 업데이트
export const updateDrugDetail = async (
  id: string,
  updatedData: Partial<Medication>
): Promise<{ errorCode: string | null; message: string }> => {
  await mockDelay();
  console.log(`약물 정보 업데이트 요청: ${id}`, updatedData);

  // Mock 데이터에서 업데이트
  const result = await mockMedicineStore.updateMedication(id, updatedData);
  if (result) {
    console.log("약물 정보 업데이트 완료:", result);
  }

  return {
    errorCode: null,
    message: "OK",
  };
};

// 그룹에서 약물 해제
export const removeDrugFromGroup = async (
  drugId: string
): Promise<{ errorCode: string | null; message: string; result: {} }> => {
  await mockDelay();
  console.log(`그룹에서 약물 해제 요청: ${drugId}`);

  // Mock 데이터에서 해당 약물 찾아서 그룹명 제거
  const drugDetail = await mockMedicineStore.getMedication(drugId);
  if (drugDetail) {
    await mockMedicineStore.updateMedication(drugId, {
      groupName: undefined,
      groupId: undefined,
    });
    console.log("그룹에서 약물 해제 완료:", drugDetail);
  }

  return {
    errorCode: null,
    message: "OK",
    result: {},
  };
};

// 그룹 삭제
export const deleteGroup = async (
  groupId: string
): Promise<{ errorCode: string | null; message: string }> => {
  await mockDelay();
  console.log(`그룹 삭제 요청: ${groupId}`);

  // Mock 데이터에서 해당 그룹의 약물들 그룹 정보 제거
  const medications = await mockMedicineStore.getMedicationsList();
  for (const medication of medications) {
    if (medication.groupId === groupId) {
      await mockMedicineStore.updateMedication(medication.id, {
        groupName: undefined,
        groupId: undefined,
      });
    }
  }

  console.log("그룹 삭제 완료:", groupId);
  return {
    errorCode: null,
    message: "OK",
  };
};

// 복용 완료 API
export const completeMedication = async (
  drugId: string,
  timeSlot: number
): Promise<{
  errorCode: string | null;
  message: string;
  result: { timeSlot: number };
}> => {
  await mockDelay();
  console.log(`복용 완료 요청: ${drugId}, timeSlot: ${timeSlot}`);

  // Mock 데이터에서 복용 상태 업데이트
  const drugDetail = await mockMedicineStore.getMedication(drugId);
  if (drugDetail) {
    // timeSlot을 이진수로 변환하여 복용 상태 업데이트
    const currentTimeSlot = drugDetail.perDay || 0;
    const newTimeSlot = currentTimeSlot | timeSlot;

    await mockMedicineStore.updateMedication(drugId, {
      perDay: newTimeSlot,
    });

    console.log("복용 완료 상태 업데이트:", newTimeSlot);
  }

  return {
    errorCode: null,
    message: "OK",
    result: { timeSlot },
  };
};

// 특정 날짜 복용 상태 조회
export const getMedicationStatusByDate = async (
  drugId: string,
  date: string
): Promise<{
  errorCode: string | null;
  message: string;
  result: { timeSlot: number };
}> => {
  await mockDelay();
  console.log(`복용 상태 조회 요청: ${drugId}, 날짜: ${date}`);

  // Mock 데이터에서 해당 날짜의 복용 상태 반환
  const drugDetail = await mockMedicineStore.getMedication(drugId);
  if (drugDetail) {
    // 임시로 랜덤한 timeSlot 반환 (서버에서 해당 날짜 데이터 조회하는 걸로 변경해야 함)
    const randomTimeSlot = Math.floor(Math.random() * 8); // 0-7 사이의 랜덤 값

    console.log("복용 상태 조회 완료:", randomTimeSlot);
    return {
      errorCode: null,
      message: "OK",
      result: { timeSlot: randomTimeSlot },
    };
  }

  return {
    errorCode: "NOT_FOUND",
    message: "약물을 찾을 수 없습니다.",
    result: { timeSlot: 0 },
  };
};
