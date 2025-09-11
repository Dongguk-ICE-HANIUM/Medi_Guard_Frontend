import CalendarCard from "@/components/Card/CalendarCard";
import EmotionCard from "@/components/Card/EmotionCard";
import QuestionCard from "@/components/Card/QuestionCard";
import SideEffectCard from "@/components/Card/SideEffectCard";
import { MedicineProvider } from "@/context/MedicineContext";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  const { date } = useLocalSearchParams();
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
      <MedicineProvider>
        <SafeAreaView>
          <CalendarCard />
          <EmotionCard date={date as string} />
          <SideEffectCard />
          <QuestionCard />
        </SafeAreaView>
      </MedicineProvider>
    </ScrollView>
  );
}
