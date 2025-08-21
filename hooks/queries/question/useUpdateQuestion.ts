import { updateEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";

function useUpdateQuestion() {
  return useMutation({
    mutationFn: updateEmotion,
    onSuccess: () => {
      const today = dayjs().format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: [queryKey.QUESTION, today],
      });
    },
  });
}

export default useUpdateQuestion;
