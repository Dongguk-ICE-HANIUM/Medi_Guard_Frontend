import queryClient from "@/api/queryClient";
import { deleteSideEffect } from "@/api/sideEffect";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useDeleteSideEffect() {
  return useMutation({
    mutationFn: deleteSideEffect,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.SIDE_EFFECT, queryKey.LIST],
      });
    },
  });
}

export default useDeleteSideEffect;
