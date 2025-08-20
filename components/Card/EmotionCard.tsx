import { colors } from "@/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../Button";

export default function EmotionCard() {
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);

  interface Emotion {
    id: number;
    name: keyof typeof MaterialIcons.glyphMap;
  }
  const emotions: Emotion[] = [
    { id: 1, name: "sentiment-very-satisfied" },
    { id: 2, name: "sentiment-satisfied-alt" },
    { id: 3, name: "sentiment-neutral" },
    { id: 4, name: "sentiment-dissatisfied" },
    { id: 5, name: "sentiment-very-dissatisfied" },
  ];

  function onPress(emotionId: number) {
    setSelectedEmotion(emotionId);
  }

  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.emotionCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 기분</Text>
          <View style={styles.headerButton}>
            <Button text="수정" color="gray" size="small" />
            <Button text="저장" color="pink" size="small" />
          </View>
        </View>
        <View style={styles.emotion}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              onPress={() => onPress(emotion.id)}
            >
              <MaterialIcons
                name={emotion.name}
                size={29}
                color={selectedEmotion === emotion.id ? colors.PINK : "black"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.textInput}>
          <TextInput
            placeholder="감정을 기록해주세요"
            textAlignVertical="top"
            multiline={true}
            style={styles.text}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emotionCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
    width: "100%",
    height: "auto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  headerButton: {
    flexDirection: "row",
    gap: 5,
  },
  emotion: {
    flexDirection: "row",
    gap: 10,
  },
  textInput: {
    marginTop: 10,
  },
  text: {
    padding: 10,
    fontSize: 13,
    backgroundColor: colors.BG_COLOR,
    borderRadius: 12,
    height: 80,
  },
});
