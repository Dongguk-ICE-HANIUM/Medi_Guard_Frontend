import queryClient from "@/api/queryClient";
import { colors, queryKey } from "@/constants";
import useCreateQuestion from "@/hooks/queries/question/useCreateQuestion";
import useGetQuestion from "@/hooks/queries/question/useGetQuestion";
import useUpdateQuestion from "@/hooks/queries/question/useUpdateQuestion";
import {
  Answer,
  CreateQuestionRequest,
  QuestionTemplate,
  randomQuestion,
  UpdateQuestionRequest,
} from "@/types/question";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import QuestionList from "../QuestionList";

export default function QuestionCard() {
  const [isEditing, setIsEditing] = useState(false);

  //질문과 답변 분리관리
  const [questions, setQuestions] = useState<QuestionTemplate[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const today = dayjs().format("YYYY-MM-DD");
  const { data: todayQuestions, refetch } = useGetQuestion(today);
  const createQuestion = useCreateQuestion(today);
  const updateQuestion = useUpdateQuestion();

  function getDailyQuestions() {
    const shuffledQuestions = [...randomQuestion].sort(
      () => Math.random() - 0.5
    );
    return shuffledQuestions.slice(0, 3);
  }

  useEffect(() => {
    if ((todayQuestions?.result?.questionList ?? []).length > 0) {
      const serverAnswers = todayQuestions!.result!.questionList;
      setQuestions(getDailyQuestions());
      setAnswers(serverAnswers);
    } else {
      const initialQuestions = getDailyQuestions();
      setQuestions(initialQuestions);
      setAnswers(initialQuestions.map((q) => ({ type: q.type, answer: "" })));
    }
  }, [todayQuestions]);

  // 수정 및 저장 버튼 함수
  function handleEditButton() {
    setIsEditing(true);
  }

  function handleSaveButton() {
    setIsEditing(false);

    if ((todayQuestions?.result?.questionList?.length ?? 0) === 0) {
      const newQuestions: CreateQuestionRequest = { questionList: answers };

      // 삭제
      console.log("질문 생성 data:", newQuestions);

      createQuestion.mutate(newQuestions, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: [queryKey.QUESTION, today],
          });
          await refetch(); // 바로 최신 질문 불러오기
          Alert.alert("알림", "저장되었습니다.");
        },
      });
    } else {
      const updatedQuestions: UpdateQuestionRequest = {
        questionList: answers.map(({ type, answer }) => ({ type, answer })),
      };

      // 삭제
      console.log("질문 수정 data:", updatedQuestions);

      updateQuestion.mutate(
        { date: today, body: updatedQuestions },
        {
          onSuccess: () => {
            setIsEditing(false);
            Alert.alert("알림", "수정되었습니다.");
          },
        }
      );
    }
  }

  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.questionCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 질문</Text>
          <View style={styles.headerButton}>
            <Button
              text="수정"
              color="gray"
              size="small"
              onPress={handleEditButton}
            />
            <Button
              text="저장"
              color="pink"
              size="small"
              onPress={handleSaveButton}
            />
          </View>
        </View>
        <View>
          <QuestionList
            isEditing={isEditing}
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
    width: "100%",
    height: "auto",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  headerButton: {
    flexDirection: "row",
    gap: 5,
  },
});
