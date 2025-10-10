import {
  CreateQuestionRequest,
  GetQuestionResponse,
  questionResponse,
  UpdateQuestionRequest,
} from "@/types/question";
import dayjs from "dayjs";
import axiosInstance from "./axios";

async function getQuestion(date: string): Promise<GetQuestionResponse> {
  const { data } = await axiosInstance.get(`/api/question?date=${date}`);

  return data;
}

async function createQuestion(
  body: CreateQuestionRequest
): Promise<questionResponse> {
  const today = dayjs().format("YYYY-MM-DD");
  const { data } = await axiosInstance.post(
    `/api/question?date=${today}`,
    body
  );

  return data;
}

async function updateQuestion({
  date,
  body,
}: {
  date: string;
  body: UpdateQuestionRequest;
}): Promise<questionResponse> {
  const { data } = await axiosInstance.patch(
    `/api/question?date=${date}`,
    body
  );

  return data;
}

export { createQuestion, getQuestion, updateQuestion };
