import { QuestionType } from "@/types/questioin";
import { View } from "react-native";
import QuestionItem from "./QuestionItem";

interface RandomQuestionProps {
  id: number;
  type: QuestionType;
  question: string;
}

interface QuestionListProps {
  isEditing: boolean;
  todayQuestions: RandomQuestionProps[];
}

export default function QuestionList({
  isEditing,
  todayQuestions,
}: QuestionListProps) {
  return (
    <View>
      {todayQuestions.map((questionData) => (
        <QuestionItem
          key={questionData.id}
          id={questionData.id}
          data={{ question: questionData.question }}
          isEditing={isEditing}
        />
      ))}
    </View>
  );
}
