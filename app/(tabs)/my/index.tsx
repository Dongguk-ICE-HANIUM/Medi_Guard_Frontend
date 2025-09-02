import CalendarCard from "@/components/Card/CalendarCard";
import EmotionCard from "@/components/Card/EmotionCard";
import QuestionCard from "@/components/Card/QuestionCard";
import SideEffectCard from "@/components/Card/SideEffectCard";
import { MedicineProvider } from "@/context/MedicineContext";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
      <MedicineProvider>
        <SafeAreaView>
          <CalendarCard />
          <EmotionCard />
          <SideEffectCard />
          <QuestionCard />
        </SafeAreaView>
      </MedicineProvider>
    </ScrollView>
  );
}
