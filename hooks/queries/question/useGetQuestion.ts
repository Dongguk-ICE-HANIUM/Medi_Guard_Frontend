import { getQuestion } from "@/api/question";
import { queryKey } from "@/constants";
import { useQuery } from "@tanstack/react-query";

function useGetQuestion(date: string) {
  return useQuery({
    queryFn: () => getQuestion(date),
    queryKey: [queryKey.QUESTION, date],
  });
}

export default useGetQuestion;
