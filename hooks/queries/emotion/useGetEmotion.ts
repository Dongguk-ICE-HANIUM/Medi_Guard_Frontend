import { getEmotion } from "@/api/emotion";
import { queryKey } from "@/constants";
import { GetEmotionRequest } from "@/types/emotion";
import { useQuery } from "@tanstack/react-query";

function useGetEmotion(variable: GetEmotionRequest) {
  return useQuery({
    queryFn: () => getEmotion(variable),
    queryKey: [queryKey.EMOTION, variable.date],
  });
}

export default useGetEmotion;
