import CalendarModal from "@/components/CalendarModal";
import AppointmentCard from "@/components/Card/AppointmentCard";
import { colors } from "@/constants";
import { useAppointment } from "@/hooks/useAppointment";
import { formatDateStringKor } from "@/utils/dateUtils";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TreatScreen() {
  const { todayNext, history, consultation } = useAppointment();
  const [isModal, setIsModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");

  useEffect(() => {
    todayNext.fetchNextAppointment();
    history.fetchAppointmentHistory();
  }, [todayNext.fetchNextAppointment, history.fetchAppointmentHistory]);

  const filteredHistory = useMemo(() => {
    if (!history.appointmentHistory.length) return [];

    const startDate = new Date(filterStartDate);
    const endDate = new Date(filterEndDate);

    return history.appointmentHistory.filter((item) => {
      const itemDate = new Date(item.datetime);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [history.appointmentHistory, filterStartDate, filterEndDate]);

  const periodText = useMemo(() => {
    const startFormatted = formatDateStringKor(filterStartDate);
    const endFormatted = formatDateStringKor(filterEndDate);
    return `${startFormatted} ~ ${endFormatted}`;
  }, [filterStartDate, filterEndDate]);

  const handleCalendarPress = () => {
    setIsModal(true);
  };

  const handleConfirm = (startDate: string, endDate: string) => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setIsModal(false);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleStartPress = () => {
    if (todayNext.nextAppointment) {
      consultation.startConsultation(todayNext.nextAppointment.scheduleId);
    }
  };

  const handleDetailPress = (scheduleId: number) => {
    console.log(`진료 상세 페이지로 이동 : ${scheduleId}`);
    router.push({
      pathname: "/treat/detail",
      params: {
        scheduleId: scheduleId,
      },
    });
  };

  if (todayNext.loading && history.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PINK} />
          <Text style={styles.loadingText}>진료 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 진료</Text>

          {todayNext.loading ? (
            <View style={styles.sectionLoading}>
              <ActivityIndicator size="small" color="#FF6B6B" />
            </View>
          ) : todayNext.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>오류: {todayNext.error}</Text>
            </View>
          ) : todayNext.nextAppointment ? (
            <AppointmentCard
              dateTime={todayNext.nextAppointment.time}
              hospitalName={todayNext.nextAppointment.hospitalName}
              doctorName={todayNext.nextAppointment.doctorName}
              type="start"
              onStartPress={handleStartPress}
              isToday={todayNext.nextAppointment.isToday}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>예정된 진료가 없습니다.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진료 이력</Text>

          <View style={styles.periodContainer}>
            <Text style={styles.periodText}>{periodText}</Text>
            <FontAwesome5
              name="calendar-alt"
              size={23}
              color="black"
              onPress={handleCalendarPress}
            />
          </View>

          {history.loading ? (
            <View style={styles.sectionLoading}>
              <ActivityIndicator size="small" color="#FF6B6B" />
            </View>
          ) : history.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>오류: {history.error}</Text>
            </View>
          ) : history.appointmentHistory.length > 0 ? (
            <View style={styles.historyList}>
              {history.appointmentHistory.map((appointment) => (
                <AppointmentCard
                  key={appointment.scheduleId}
                  dateTime={appointment.datetime}
                  hospitalName={appointment.hospitalName}
                  doctorName={appointment.doctorName}
                  type="detail"
                  onDetailPress={() =>
                    handleDetailPress(appointment.scheduleId)
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>진료 이력이 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CalendarModal
        visible={isModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        initialStartDate={filterStartDate}
        initialEndDate={filterEndDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  container: { flex: 1 },
  scrollView: { flex: 1, marginVertical: 20 },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 10,
  },

  sectionLoading: { alignItems: "center", paddingVertical: 20 },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 14,
    textAlign: "center",
  },
  historyList: {},
  emptyContainer: {
    backgroundColor: "#F7F8FA",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },

  periodContainer: {
    backgroundColor: colors.WHITE,
    padding: 16,
    borderRadius: 10,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  periodText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
    fontWeight: "600",
  },
});
