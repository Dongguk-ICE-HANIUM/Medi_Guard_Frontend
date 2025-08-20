import { updateEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useUpdateEmotion() {
  return useMutation({
    mutationFn: updateEmotion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.EMOTION],
      });
    },
  });
}
