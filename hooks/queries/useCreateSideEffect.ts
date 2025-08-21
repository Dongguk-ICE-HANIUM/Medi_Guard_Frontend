import queryClient from "@/api/queryClient";
import { createSideEffect } from "@/api/sideEffect";
import { queryKey } from "@/constants";
import { SideEffectResponse } from "@/types/sideEffect";
import { useMutation } from "@tanstack/react-query";

function useCreateSideEffect() {
  return useMutation({
    mutationFn: createSideEffect,
    onSuccess: (data: SideEffectResponse) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.SIDE_EFFECT, queryKey.LIST],
      });
    },
  });
}

export default useCreateSideEffect;
