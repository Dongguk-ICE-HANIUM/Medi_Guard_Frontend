import { createEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useCreateEmotion() {
  return useMutation({
    mutationFn: createEmotion,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.EMOTION, variables.date],
      });
      console.log(
        "Emotion created:",
        data.result,
        data.errorCode,
        data.message
      );
    },
    onError: (error) => {
      console.error("Emotion create error", error);
    },
  });
}

export default useCreateEmotion;
