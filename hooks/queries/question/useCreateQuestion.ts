import queryClient from "@/api/queryClient";
import { createQuestion } from "@/api/question";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";

function useCreateQuestion() {
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      const today = dayjs().format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: [queryKey.QUESTION, today],
      });
    },
  });
}

export default useCreateQuestion;
