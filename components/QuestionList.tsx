import { question, QuestionType } from "@/types/question";
import { View } from "react-native";
import QuestionItem from "./QuestionItem";

interface RandomQuestionProps {
  id: number;
  type: QuestionType;
  question: string;
}

interface QuestionListProps {
  isEditing: boolean;
  todayQuestions?: question[];
}

export default function QuestionList({
  isEditing,
  todayQuestions,
}: QuestionListProps) {
  return (
    <View>
      {todayQuestions?.map((questionData) => (
        <QuestionItem
          key={questionData.id}
          id={questionData.id}
          data={{ question: questionData.answer }}
          isEditing={isEditing}
        />
      ))}
    </View>
  );
}
