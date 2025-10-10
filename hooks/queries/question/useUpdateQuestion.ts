import queryClient from "@/api/queryClient";
import { updateQuestion } from "@/api/question";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useUpdateQuestion() {
  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.QUESTION, variables.date],
      });
      console.log("질문 수정 성공");
    },
    onError: (error) => {
      console.error("질문 수정 실패:", error);
    },
  });
}

export default useUpdateQuestion;
