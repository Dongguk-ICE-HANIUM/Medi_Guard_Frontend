import queryClient from "@/api/queryClient";
import { patchSideEffect } from "@/api/sideEffect";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useUpdateSideEffect() {
  return useMutation({
    mutationFn: patchSideEffect,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.SIDE_EFFECT, queryKey.LIST],
      });
    },
  });
}

export default useUpdateSideEffect;
