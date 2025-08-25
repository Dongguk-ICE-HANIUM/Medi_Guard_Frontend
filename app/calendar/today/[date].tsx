import CalendarCard from "@/components/Card/CalendarCard";
import EmotionCard from "@/components/Card/EmotionCard";
import MedicineCard from "@/components/Card/MedicineCard";
import TreatmentCard from "@/components/Card/TreatmentCard";
import UserNameCard from "@/components/Card/UserNameCard";
import { MedicineProvider } from "@/context/MedicineContext";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function TodayCalendar() {
  const { date } = useLocalSearchParams();
  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        <MedicineProvider>
          <View style={styles.header}>
            <UserNameCard name="송민교" />
          </View>
          <CalendarCard />
          <TreatmentCard />
          <EmotionCard />
          <MedicineCard />
        </MedicineProvider>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 10,
  },
});
