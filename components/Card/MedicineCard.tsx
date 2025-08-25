import { colors } from "@/constants";
import dayjs from "dayjs";
import { StyleSheet, Text, View } from "react-native";
import SingleMedicineCard from "./SingleMedicineCard";

interface MedicineCardProps {
  date?: Date;
}

export default function MedicineCard({ date }: MedicineCardProps) {
  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.emotionCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {date ? dayjs(date).format("M월 DD일의 약물") : "오늘의 약물"}
          </Text>
        </View>
        <View style={styles.content}>
          <SingleMedicineCard
            medication={{
              id: "1",
              startAt: "2025-08-20",
              endAt: "2025-08-30",
              medicineInfo: { name: "타이레놀" },
            }}
            selectedDate={dayjs().format("YYYY-MM-DD")}
            showGroupDetail={true}
          />
          <SingleMedicineCard
            medication={{
              id: "2",
              startAt: "2025-08-20",
              endAt: "2025-08-30",
              medicineInfo: { name: "애드빌" },
            }}
            selectedDate={dayjs().format("YYYY-MM-DD")}
            showGroupDetail={true}
          />
          <SingleMedicineCard
            medication={{
              id: "3",
              startAt: "2025-08-20",
              endAt: "2025-08-30",
              medicineInfo: { name: "게보린" },
            }}
            selectedDate={dayjs().format("YYYY-MM-DD")}
            showGroupDetail={true}
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

  content: {
    gap: 15,
  },
  medicineName: {
    fontWeight: "500",
    minWidth: 50,
    fontSize: 16,
  },
});
