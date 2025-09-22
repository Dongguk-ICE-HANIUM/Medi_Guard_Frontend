import CalendarModal from "@/components/CalendarModal";
import AppointmentCard from "@/components/Card/AppointmentCard";
import { colors } from "@/constants";
import { useAppointmentHistory, useCurrentScheduleStore, useNextAppointment, useStartConsultation } from "@/hooks/useAppointment";
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

  const {data: nextAppointment, isLoading: nextLoading, error: nextError} = useNextAppointment();
  const startConsultation = useStartConsultation();
  const {currentScheduleId, setCurrentScheduleId} = useCurrentScheduleStore();

  //캘린더 모달 상태 관리
  const [isModal, setIsModal] = useState(false);

  //날짜 범위 선택
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  
  //페이지네이션
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const ITEMS_PER_PAGE = 4;

  //서버 사이드 페이지네이션으로 진료 이력 조회
  const {
    data : historyResponse,
    isLoading : historyLoading,
    error : historyError,
    isFetching : historyFetching,
  } = useAppointmentHistory(currentPage);

  const appointmentHistory = historyResponse?.content || [];
  const totalPages = historyResponse?.totalPage || 1;
  const totalCount = historyResponse?.totalElements|| 0;
  const hasNext = historyResponse?.hasNext || false;

  //진료 이력 필터링 (페이지네이션 + 날짜)
  const filteredHistory = useMemo(() => {
    if (!appointmentHistory.length) return [];

    // 오늘의 진료에 표시되는 scheduleId를 제외
    const todayScheduleId = nextAppointment?.scheduleId;

    let filteredData = appointmentHistory;

    // 오늘의 진료에 표시되는 카드는 진료 이력에서 제외
    if (todayScheduleId) {
      filteredData = filteredData.filter(
        (item) => item.scheduleId !== todayScheduleId
      );
    }

    //날짜 필터링
    if(!filterStartDate || !filterEndDate){
      return filteredData;
    }

    const startDate = new Date(filterStartDate);
    const endDate = new Date(filterEndDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return filteredData.filter((item) => {
      const itemDate = new Date(item.time);
      return itemDate >= startDate && itemDate <= endDate;
    });
  },[
    appointmentHistory,
    filterStartDate,
    filterEndDate,
    nextAppointment,
  ]);

  //날짜 범위 텍스트
  const periodText = useMemo(() => {
    const startFormatted = formatDateStringKor(filterStartDate);
    const endFormatted = formatDateStringKor(filterEndDate);
    return `${startFormatted} ~ ${endFormatted}`;
  }, [filterStartDate, filterEndDate]);

  //페이지변경
  const handlePageChange = (page: number) => {
    if(page >= 1 && page <= totalPages){
      setCurrentPage(page);
    }
  };
  
  //페이지 번호 계산
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

  //날짜 변경시 첫 페이지가 보이게
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStartDate, filterEndDate]);

  //캘린더 모달 열기
  const handleCalendarPress = () => {
    setIsModal(true);
  };

  //캘린더 모달에서 날짜 선택
  const handleConfirm = (startDate: string, endDate: string) => {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setIsModal(false);
  };

  //캘린더 모달 닫기
  const handleCloseModal = () => {
    setIsModal(false);
  };

  //진료 시작 핸들러
  const handleStartPress = () => {
    if (nextAppointment) {
      startConsultation.mutate(nextAppointment.scheduleId);
      setCurrentScheduleId(nextAppointment.scheduleId);
      // 진료 시작 페이지로 이동
      router.push("/treat/consultation");
    }
  };

  //진료 상세 보기 핸들러
  const handleDetailPress = (scheduleId: string) => {
    console.log(`진료 상세 페이지로 이동 : ${scheduleId}`);

    // 현재 진행 중인 진료 ID 설정 (isToday가 false인 경우)
    setCurrentScheduleId(scheduleId);
    // 진료 결과 페이지로 이동
    router.push("/treat/consultation/result");
  };

  //진료 추가 페이지로 이동
  const handleAddAppointment = () => {
    router.push("/treat/add");
  }

  //전체 로딩 상태
  if (nextLoading && historyLoading) {
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

            {nextLoading ? (
              <View style={styles.sectionLoading}>
                <ActivityIndicator size="small" color="#FF6B6B" />
              </View>
            ) : nextError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>오류: {nextError.message}</Text>
              </View>
            ) : nextAppointment ? (
              <AppointmentCard
                dateTime={nextAppointment.time}
                hospitalName={nextAppointment.hospitalName}
                doctorName={nextAppointment.doctorName}
                type="start"
                onStartPress={handleStartPress}
                isToday={nextAppointment.isToday}
                isCompleted={
                  currentScheduleId===
                  nextAppointment.scheduleId
                }
              />
            ) : (
          <View style={styles.emptyMainContainer}>
                <FontAwesome5 name="calendar-times" size={48} color={colors.TEXT_GRAY} />
                <Text style={styles.emptyMainText}>아직 진료 이력이 없습니다</Text>
                <Text style={styles.emptySubText}>첫 번째 진료를 등록해보세요</Text>
                <TouchableOpacity 
                  style={styles.addMainButton}
                  onPress={handleAddAppointment}
                >
                  <FontAwesome5 name="plus" size={18} color={colors.WHITE} />
                  <Text style={styles.addMainButtonText}>진료 등록하기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>진료 이력</Text>
          
             {/* 데이터가 있을 때만 날짜 필터 표시 */}
            {totalCount > 0 && (
              <TouchableOpacity
                style={styles.periodContainer}
                onPress={handleCalendarPress}
              >
                <Text style={styles.periodText}>{periodText}</Text>
                <FontAwesome5 name="calendar-alt" size={23} color="black" />
              </TouchableOpacity>
            )}

            {/* 로딩 상태 표시 - 페이지 변경시에도 표시 */}
            {historyLoading || historyFetching ? (
              <View style={styles.sectionLoading}>
                <ActivityIndicator size="small" color="#FF6B6B" />
                <Text style={styles.loadingSubText}>
                  {historyFetching && !historyLoading ? "페이지 로딩 중..." : "진료 이력 로딩 중..."}
                </Text>
              </View>
            ) : historyError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>오류: {historyError.message}</Text>
              </View>
            ) : totalCount === 0 ? (
              // 진료 이력이 아예 없을 때
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>예정된 진료가 없습니다.</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddAppointment}
                >
                  <FontAwesome5 name="plus" size={16} color={colors.WHITE} />
                  <Text style={styles.addButtonText}>진료 추가</Text>
                </TouchableOpacity>
              </View>
            ) : filteredHistory.length > 0 ? (
              <View style={styles.historyList}>
                {filteredHistory.map((appointment) => (
                  <AppointmentCard
                    key={appointment.scheduleId}
                    dateTime={appointment.time} 
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
              // 필터링 결과가 없을 때
                <Text style={styles.emptyText}>해당 기간에 진료 이력이 없습니다.</Text>
            )}
          </View>

           {/* 서버 사이드 페이지네이션 컨테이너 */}
          {totalPages > 1 && totalCount > 0 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || historyFetching}
              >
                <FontAwesome5
                  name="chevron-left"
                  size={11}
                  color={currentPage === 1 ? colors.TEXT_GRAY : colors.PINK}
                />
              </TouchableOpacity>

              {getPageNumbers().map((page) => (
                <TouchableOpacity
                  key={page}
                  style={[
                    styles.pageNumberButton,
                    currentPage === page && styles.activePageButton,
                    historyFetching && styles.disabledButton,
                  ]}
                  onPress={() => handlePageChange(page)}
                  disabled={historyFetching}
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
                disabled={currentPage === totalPages || historyFetching}
              >
                <FontAwesome5
                  name="chevron-right"
                  size={11}
                  color={
                    currentPage === totalPages ? colors.TEXT_GRAY : colors.PINK
                  }
                />
              </TouchableOpacity>
            </View>
          )}

           {/* 페이지 정보 표시 */}
          {totalPages > 1 && totalCount > 0 && (
            <View style={styles.pageInfoContainer}>
              <Text style={styles.pageInfoText}>
                {currentPage} / {totalPages} 페이지
              </Text>
            </View>
          )}
        </ScrollView>
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
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
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
  // 진료 이력 헤더 (제목 + 총 개수)
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  totalCountText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },

  sectionLoading: { alignItems: "center", paddingVertical: 20 },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FEB2B2",
    marginHorizontal: 10,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 14,
    textAlign: "center",
  },
  historyList: {},
  
  // 기본 빈 상태 (필터링 결과 없음)
  emptyContainer: {
    backgroundColor: "#F7F8FA",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  emptyText: { 
    fontSize: 16, 
    color: "#999", 
    textAlign: "center",
    marginBottom: 16,
  },
  
  // 메인 빈 상태 (진료 이력이 아예 없음)
  emptyMainContainer: {
    backgroundColor: "#FAFBFC",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 20,
  },
  emptyMainText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.TEXT_GRAY,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  
  // 진료 추가 버튼 (작은 버전)
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.PINK,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  
  // 진료 등록 버튼 (메인 빈 상태용)
  addMainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.PINK,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMainButtonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: "700",
  },

  periodContainer: {
    backgroundColor: colors.WHITE,
    padding: 16,
    borderRadius: 10,
    marginBottom: 13,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  periodText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
    fontWeight: "600",
  },

  // 서버 사이드 페이지네이션
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  paginationButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
  // 페이지 정보 표시
  pageInfoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  pageInfoText: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
  },

});
