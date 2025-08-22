import { colors } from "@/constants";
import useCreateQuestion from "@/hooks/queries/question/useCreateQuestion";
import useGetQuestion from "@/hooks/queries/question/useGetQuestion";
import useUpdateQuestion from "@/hooks/queries/question/useUpdateQuestion";
import { QuestionType } from "@/types/questioin";
import dayjs from "dayjs";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import QuestionList from "../QuestionList";

export default function QuestionCard() {
  const [isEditing, setIsEditing] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");
  const { refetch, data } = useGetQuestion(today);
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();

  interface RandomQuestionProps {
    id: number;
    type: QuestionType;
    question: string;
  }

  const randomQuestion: RandomQuestionProps[] = [
    {
      id: 1,
      type: QuestionType.DAILY_LIFE,
      question: "일상생활을 하는데 불편함이 있나요?",
    },
    {
      id: 2,
      type: QuestionType.PATIENT_CONCERNS,
      question: "걱정되는 부분이나 추가적으로 알고 싶은 정보가 있나요?",
    },
    {
      id: 3,
      type: QuestionType.PATIENT_CONCERNS,
      question: "진료시 담당의사에게 하고 싶은 질문은 무엇일까요?",
    },
    {
      id: 4,
      type: QuestionType.PHYSICAL_SYMPTOMS,
      question: "몸에 불편한 증상이 있나요?",
    },
    {
      id: 5,
      type: QuestionType.MOOD_STATUS,
      question: "요즘 기분은 어떠신가요?",
    },
    {
      id: 6,
      type: QuestionType.FETAL_MOVEMENT,
      question: "태아의 움직임은 어떤가요?",
    },
  ];

  function getDailyQuestions() {
    const shuffled = [...randomQuestion].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }

  const dailyQuestions = getDailyQuestions();

  // 수정 및 저장 버튼 함수
  function handleEditButton() {
    setIsEditing(true);
  }
  function handleSaveButton() {
    setIsEditing(false);
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
          <QuestionList isEditing={isEditing} todayQuestions={dailyQuestions} />
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
