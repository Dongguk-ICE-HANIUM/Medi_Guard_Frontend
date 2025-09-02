import { colors } from "@/constants";
import dayjs from "dayjs";
import { StyleSheet, Text, View } from "react-native";
import AppointmentCard from "./AppointmentCard";

interface TreatmentCardProps {
  date?: Date;
}

export default function TreatmentCard({ date }: TreatmentCardProps) {
  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.emotionCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {date ? dayjs(date).format("M월 DD일의 진료") : "오늘의 진료"}
          </Text>
        </View>
        <View>
          <AppointmentCard
            dateTime={
              date
                ? dayjs(date).format("YYYY-MM-DDTHH:mm:ss")
                : dayjs().format("YYYY-MM-DDTHH:mm:ss")
            }
            hospitalName="서울대병원"
            doctorName="김철수 교수"
            type="detail"
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
});
