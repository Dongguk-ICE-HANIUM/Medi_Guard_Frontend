import { createEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useCreateEmotion() {
  return useMutation({
    mutationFn: createEmotion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.EMOTION, variables.date],
      });
    },
  });
}

export default useCreateEmotion;
