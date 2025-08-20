import Calendar from "@/components/Calendar/Calendar";
import EmotionCard from "@/components/Card/EmotionCard";
import QuestionCard from "@/components/Card/QuestionCard";
import SideEffectCard from "@/components/Card/SideEffectCard";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
      <SafeAreaView>
        <Calendar />
        <EmotionCard />
        <SideEffectCard />
        <QuestionCard />
      </SafeAreaView>
    </ScrollView>
  );
}
