import { colors } from "@/constants";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface QuestionItemProps {
  id: string;
  data: {
    question: string;
  };
  isEditing: boolean;
  onUpdate?: (data: any) => void;
  onRemove?: () => void;
}

export default function QuestionItem({
  data,
  isEditing,
  onUpdate,
  onRemove,
}: QuestionItemProps) {
  return (
    <View style={styles.questionItem}>
      <Text>Q. {data.question}</Text>
      <View style={styles.textInput}>
        <TextInput
          placeholder="입력해주세요"
          multiline={true}
          textAlignVertical="top"
          style={styles.text}
          editable={isEditing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionItem: {
    gap: 10,
    marginVertical: 10,
  },
  textInput: {
    marginTop: 10,
  },
  text: {
    padding: 10,
    fontSize: 13,
    backgroundColor: colors.BG_COLOR,
    borderRadius: 12,
    height: 40,
  },
});
