import { Answer, QuestionTemplate } from "@/types/question";
import React from "react";
import { View } from "react-native";
import QuestionItem from "./QuestionItem";

interface QuestionListProps {
  isEditing: boolean;
  questions: QuestionTemplate[];
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

export default function QuestionList({
  isEditing,
  questions,
  answers,
  setAnswers,
}: QuestionListProps) {
  const handleAnswerChange = (index: number, newAnswer: string) => {
    const updated = [...answers];
    updated[index] = { ...updated[index], answer: newAnswer };
    setAnswers(updated);
  };
  return (
    <View>
      {questions.map((q, idx) => (
        <QuestionItem
          key={q.id}
          id={q.id}
          question={q.text}
          answer={answers[idx]?.answer ?? ""}
          isEditing={isEditing}
          onAnswerChange={(val) => handleAnswerChange(idx, val)}
        />
      ))}
    </View>
  );
}
