import {
  CreateSideEffectRequest,
  GetSideEffectResponse,
  SideEffectID,
  SideEffectResponse,
  UpdateSideEffectRequest,
} from "@/types/sideEffect";
import { AxiosError, isAxiosError } from "axios";
import apiClient from "./apiClient";

export const sideEffectApi = {
  // 생성(POST)
  async createSideEffect(
    data: CreateSideEffectRequest
  ): Promise<SideEffectResponse> {
    try {
      const response = await apiClient.post("/side-effect", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 수정(PATCH)
  async updateSideEffect(
    sideEffectId: SideEffectID,
    data: UpdateSideEffectRequest
  ): Promise<SideEffectResponse> {
    try {
      const response = await apiClient.patch(
        `/side-effect/${sideEffectId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteSideEffect(sideEffectId: SideEffectID): Promise<void> {
    try {
      const response = await apiClient.delete(`/side-effect/${sideEffectId}`);

      // 204 code
      if (response.status === 204) {
        return;
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getSideEffect(): Promise<GetSideEffectResponse> {
    try {
      const response = await apiClient.get("side-effect");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 에러 처리 함수
function handleApiError(error: any): Error {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<SideEffectResponse>;

    if (axiosError.response?.data) {
      // 서버에서 온 에러 응답
      const errorData = axiosError.response.data;
      return new Error(
        errorData.message || "요청 처리 중 오류가 발생했습니다."
      );
    }

    if (axiosError.message === "AUTH_EXPIRED") return new Error("AUTH_EXPIRED");
  }

  return new Error("네트워크 오류가 발생했습니다.");
}
