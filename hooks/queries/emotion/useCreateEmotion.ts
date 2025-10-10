import { createEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useCreateEmotion(date: string) {
  return useMutation({
    mutationFn: createEmotion,
    onSuccess: (data) => {
      if (data?.result)
        queryClient.invalidateQueries({
          queryKey: [queryKey.EMOTION, date],
        });
      console.log("오늘의 기분 생성 성공");
    },
    onError: (error) => {
      console.error("오늘의 기분 생성 실패", error);
    },
  });
}

export default useCreateEmotion;
