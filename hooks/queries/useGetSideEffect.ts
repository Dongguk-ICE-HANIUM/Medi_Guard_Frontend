import { getSideEffect } from "@/api/sideEffect";
import { queryKey } from "@/constants";
import { useQuery } from "@tanstack/react-query";

function useGetSideEffect() {
  return useQuery({
    queryFn: getSideEffect,
    queryKey: [queryKey.SIDE_EFFECT, queryKey.LIST],
  });
}

export default useGetSideEffect;
