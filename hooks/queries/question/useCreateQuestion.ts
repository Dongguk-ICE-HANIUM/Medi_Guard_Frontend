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
    },
  });
}

export default useCreateQuestion;
