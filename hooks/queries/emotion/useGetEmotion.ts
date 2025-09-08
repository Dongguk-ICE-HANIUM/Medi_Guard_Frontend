import { getEmotion } from "@/api/emotion";
import { queryKey } from "@/constants";
import { useQuery } from "@tanstack/react-query";

function useGetEmotion(date: string) {
  return useQuery({
    queryFn: () => getEmotion(date),
    queryKey: [queryKey.EMOTION, date],
  });
}

export default useGetEmotion;
