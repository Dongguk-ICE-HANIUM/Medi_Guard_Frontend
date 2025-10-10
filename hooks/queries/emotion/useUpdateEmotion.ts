import { updateEmotion } from "@/api/emotion";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { useMutation } from "@tanstack/react-query";

function useUpdateEmotion(date: string) {
  return useMutation({
    mutationFn: updateEmotion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKey.EMOTION, date],
      });
      console.log("오늘의 기분 수정 성공");
    },
    onError: (error) => {
      console.log("오늘의 기분 수정 실패", error);
    },
    onError: (error) => {
      console.error("Emotion update error", error);
    },
  });
}

export default useUpdateEmotion;
