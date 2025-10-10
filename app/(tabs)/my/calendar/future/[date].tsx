import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function FutureCalendar() {
  const { date } = useLocalSearchParams();
  return (
    <View>
      <Text>{date}</Text>
    </View>
  );
}
