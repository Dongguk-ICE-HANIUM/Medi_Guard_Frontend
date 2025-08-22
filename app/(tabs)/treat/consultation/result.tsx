import Button from "@/components/Button";
import { ResultSection } from "@/components/consultation/ResultSection";
import { colors } from "@/constants";
import {
  useAppointmentDetail,
  useCurrentSchedule,
} from "@/hooks/useAppointment";
import { formatAppointmentDate, formatDateStringKor } from "@/utils/dateUtils";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const result = () => {
  const { currentScheduleId } = useCurrentSchedule();
  const { appointmentDetail, loading, error, fetchAppointmentDetail } =
    useAppointmentDetail();

  useEffect(() => {
    console.log("currentScheduleId:", currentScheduleId);
    if (currentScheduleId) {
      fetchAppointmentDetail(currentScheduleId);
    }
  }, [currentScheduleId, fetchAppointmentDetail]);

  const goTreatHome = () => {
    router.replace("/treat");
  };

  const parseSymptoms = (symptomString: string) => {
    return symptomString.split(",").map((s) => s.trim());
  };

  const parseDiagnosis = (diagnosisString: string) => {
    return diagnosisString.split(",").map((d) => d.trim());
  };

  const parseGuidance = (guidanceString: string) => {
    return guidanceString.split(",").map((g) => g.trim());
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>진료 결과를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !appointmentDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {error || "진료 결과를 찾을 수 없습니다."}
          </Text>
          <Text style={styles.debugText}>
            currentScheduleId: {currentScheduleId}, loading:{" "}
            {loading.toString()}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.date}>
            {formatDateStringKor(appointmentDetail.datetime)}
            {!appointmentDetail.isToday &&
              ` ${formatAppointmentDate(appointmentDetail.datetime).time}`}
          </Text>
          <Text style={styles.title}>
            {appointmentDetail.isToday
              ? "오늘의 진료 내용이에요"
              : appointmentDetail.hospitalName +
                " " +
                appointmentDetail.doctorName}
          </Text>
        </View>
        <ResultSection
          title="증상"
          items={parseSymptoms(appointmentDetail.symptom)}
        />
        <ResultSection
          title="진단"
          items={parseDiagnosis(appointmentDetail.diagnosis)}
        />
        <ResultSection
          title="복약 지도"
          items={parseGuidance(appointmentDetail.guidance)}
        />
        <ResultSection
          title="주의 사항"
          items={parseGuidance(appointmentDetail.warning)}
        />
      </View>

      {appointmentDetail.isToday && (
        <View style={styles.buttonContainer}>
          <Button text="종료" color="pink" onPress={goTreatHome} />
        </View>
      )}
    </ScrollView>
  );
};

export default result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 30,
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  date: {
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    color: colors.TEXT_GRAY,
  },

  detailHeader: {},
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
  },
  debugText: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
    marginTop: 8,
  },
});
