import queryClient from "@/api/queryClient";
import { updateQuestion } from "@/api/question";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";

function useUpdateQuestion() {
  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      const today = dayjs().format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: [queryKey.QUESTION, today],
      });
    },
  });
}

export default useUpdateQuestion;
