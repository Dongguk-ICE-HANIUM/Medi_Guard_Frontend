import { colors } from "@/constants";
import { question, randomQuestion } from "@/types/question";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import QuestionList from "../QuestionList";

export default function QuestionCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [localQuestions, setLocalQuestions] = useState<question[]>([]);

  // const today = dayjs().format("YYYY-MM-DD");
  // const { refetch, data: todayQuestions } = useGetQuestion(today);
  // const createQuestion = useCreateQuestion();
  // const updateQuestion = useUpdateQuestion();

  function getDailyQuestions() {
    const shuffled = [...randomQuestion].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }

  useEffect(() => {
    // if (todayQuestions?.result?.questionList)
    //   setLocalQuestions(todayQuestions?.result?.questionList);
    const initalQuestions = getDailyQuestions();
    setLocalQuestions(initalQuestions);
  }, []);

  // 수정 및 저장 버튼 함수
  function handleEditButton() {
    setIsEditing(true);
  }

  function handleSaveButton() {
    setIsEditing(false);
    Alert.alert("알림", "저장되었습니다.");

    // const updatedQuestions: UpdateQuestionRequest = {
    //   questionList: localQuestions,
    // };

    // updateQuestion.mutate(updatedQuestions, {
    //   onSuccess: () => {
    //     setIsEditing(false);
    //     refetch(); // 저장 후 다시 불러오기
    //   },
    // });
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
          <QuestionList isEditing={isEditing} todayQuestions={localQuestions} />
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
