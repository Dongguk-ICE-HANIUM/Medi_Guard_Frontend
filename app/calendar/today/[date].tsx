import EmotionCard from "@/components/Card/EmotionCard";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function TodayCalendar() {
  const { date } = useLocalSearchParams();
  return (
    <View>
      <Text>{date}</Text>
      <EmotionCard />
    </View>
  );
}
