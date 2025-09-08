import { getEmotion } from "@/api/emotion";
import { colors } from "@/constants";
import useCreateEmotion from "@/hooks/queries/emotion/useCreateEmotion";
import useGetEmotion from "@/hooks/queries/emotion/useGetEmotion";
import useUpdateEmotion from "@/hooks/queries/emotion/useUpdateEmotion";
import {
  CreateEmotionRequest,
  emotionType,
  GetEmotionResult,
  UpdateEmotionRequest,
} from "@/types/emotion";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../Button";

interface EmotionCardProps {
  date: string;
}

export default function EmotionCard({ date }: EmotionCardProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [todayEmotion, setTodayEmotion] = useState<GetEmotionResult | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const createEmotion = useCreateEmotion();
  const updateEmotion = useUpdateEmotion();
  const { data: emotionData } = useGetEmotion(date);

  useEffect(() => {
    if (emotionData?.result) {
      setTodayEmotion(emotionData.result);
      setDescription(emotionData.result.description);
    }
  }, [emotionData]);

  interface Emotion {
    id: number;
    name: keyof typeof MaterialIcons.glyphMap;
    emotion: emotionType;
  }
  const emotions: Emotion[] = [
    {
      id: 1,
      name: "sentiment-very-satisfied",
      emotion: emotionType.VERY_HAPPY,
    },
    { id: 2, name: "sentiment-satisfied-alt", emotion: emotionType.HAPPY },
    { id: 3, name: "sentiment-neutral", emotion: emotionType.NEUTRAL },
    { id: 4, name: "sentiment-dissatisfied", emotion: emotionType.SAD },
    { id: 5, name: "sentiment-very-dissatisfied", emotion: emotionType.ANGRY },
  ];

  function handleEmotion(emotion: Emotion) {
    setSelectedEmotion(emotion);
  }
  const handleSaveButton = async () => {
    const today = dayjs().format("YYYY-MM-DD");
    setIsEditable(false);
    Alert.alert("알림", "저장되었습니다");

    if (!todayEmotion) {
      const newEmotion: CreateEmotionRequest = {
        date: today,
        description: description,
        emotion: selectedEmotion!.emotion,
      };
      createEmotion.mutate(newEmotion);

      const created = await getEmotion(today);
      setTodayEmotion(created.result);
    } else {
      const updatedEmotion: UpdateEmotionRequest = {
        ...todayEmotion,
        description: description,
        emotion: selectedEmotion!.emotion,
      };
      updateEmotion.mutate(updatedEmotion);
      setTodayEmotion(updatedEmotion);
    }
  };

  function handleEditButton() {
    setIsEditable(true);
    Alert.alert("알림", "수정되었습니다");
  }

  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.emotionCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>오늘의 기분</Text>
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
        <View style={styles.emotion}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              onPress={() => handleEmotion(emotion)}
              disabled={!isEditable}
            >
              <MaterialIcons
                name={emotion.name}
                size={29}
                color={
                  selectedEmotion?.id === emotion.id ? colors.PINK : "black"
                }
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
            value={description}
            onChangeText={setDescription}
            editable={isEditable}
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
