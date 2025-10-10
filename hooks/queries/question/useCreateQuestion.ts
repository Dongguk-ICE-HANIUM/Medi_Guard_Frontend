import queryClient from "@/api/queryClient";
import { createQuestion } from "@/api/question";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useCreateQuestion(date: string) {
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.QUESTION, date],
      });
      console.log("질문 생성 성공");
    },
    onError: (error) => {
      console.error("질문 생성 실패:", error);
    },
  });
}

export default useCreateQuestion;
