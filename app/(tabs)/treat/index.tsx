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
  TouchableOpacity,
  View,
} from "react-native";

export default function TreatScreen() {
  const { todayNext, history, consultation } = useAppointment();
  const [isModal, setIsModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    todayNext.fetchNextAppointment();
    history.fetchAppointmentHistory();
  }, [todayNext.fetchNextAppointment, history.fetchAppointmentHistory]);

  //진료 이력 필터링
  useEffect(() => {
    if (
      history.appointmentHistory.length > 0 &&
      !filterStartDate &&
      !filterEndDate
    ) {
      const sortedHistory = [...history.appointmentHistory].sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
      const firstAppointment = sortedHistory[0].datetime.split("T")[0];
      const today = new Date().toISOString().split("T")[0];

      setFilterStartDate(firstAppointment);
      setFilterEndDate(today);
    }
  }, [history.appointmentHistory, filterStartDate, filterEndDate]);

  const filteredHistory = useMemo(() => {
    if (!history.appointmentHistory.length) return [];

    if (!filterStartDate || !filterEndDate) {
      return history.appointmentHistory;
    }

    const startDate = new Date(filterStartDate);
    const endDate = new Date(filterEndDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

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

  //페이지네이션
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  useEffect(() => {
    setCurrentPage(1);
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
      <View style={styles.contentContainer}>
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

            <TouchableOpacity
              style={styles.periodContainer}
              onPress={handleCalendarPress}
            >
              <Text style={styles.periodText}>{periodText}</Text>
              <FontAwesome5 name="calendar-alt" size={23} color="black" />
            </TouchableOpacity>

            {history.loading ? (
              <View style={styles.sectionLoading}>
                <ActivityIndicator size="small" color="#FF6B6B" />
              </View>
            ) : history.error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>오류: {history.error}</Text>
              </View>
            ) : currentPageData.length > 0 ? (
              <View style={styles.historyList}>
                {currentPageData.map((appointment) => (
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

        {totalPages > 1 && (
          <View style={styles.fixedPaginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.disabledButton,
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesome5
                name="chevron-left"
                size={14}
                color={currentPage === 1 ? colors.TEXT_GRAY : colors.PINK}
              />
            </TouchableOpacity>

            {getPageNumbers().map((page) => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageNumberButton,
                  currentPage === page && styles.activePageButton,
                ]}
                onPress={() => handlePageChange(page)}
              >
                <Text
                  style={[
                    styles.pageNumberText,
                    currentPage === page && styles.activePageText,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.disabledButton,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesome5
                name="chevron-right"
                size={14}
                color={
                  currentPage === totalPages ? colors.TEXT_GRAY : colors.PINK
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

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
  contentContainer: { flex: 1 },
  scrollView: { flex: 1, marginTop: 20, paddingBottom: 5 },
  section: { marginBottom: 7, flex: 1 },
  sectionTitle: {
    fontSize: 18,
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

  //페이지네이션
  fixedPaginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 15,
    gap: 8,
  },
  paginationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.PINK + "30",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: colors.TEXT_GRAY + "20",
    borderColor: colors.TEXT_GRAY + "30",
  },
  pageNumberButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.PINK + "30",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePageButton: {
    backgroundColor: colors.PINK,
    borderColor: colors.PINK,
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.PINK,
  },
  activePageText: {
    color: colors.WHITE,
  },
});
