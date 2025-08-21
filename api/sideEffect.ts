import {
  CreateSideEffectRequest,
  GetSideEffectResponse,
  SideEffectResponse,
  UpdateSideEffectRequest,
} from "@/types/sideEffect";
import axiosInstance from "./axios";

async function getSideEffect(): Promise<GetSideEffectResponse> {
  const { data } = await axiosInstance.get("/api/side-effect");

  return data;
}

async function createSideEffect(
  body: CreateSideEffectRequest
): Promise<SideEffectResponse> {
  const { data } = await axiosInstance.post("/api/side-effect", body);

  return data;
}

async function deleteSideEffect(
  sideEffectId: string
): Promise<SideEffectResponse> {
  const { data } = await axiosInstance.delete(
    `/api/side-effect/${sideEffectId}`
  );

  return data;
}

async function patchSideEffect({
  sideEffectId,
  description,
}: UpdateSideEffectRequest): Promise<SideEffectResponse> {
  const { data } = await axiosInstance.patch(
    `/api/side-effect/${sideEffectId}`,
    { description }
  );

  return data;
}

export { createSideEffect, deleteSideEffect, getSideEffect, patchSideEffect };
