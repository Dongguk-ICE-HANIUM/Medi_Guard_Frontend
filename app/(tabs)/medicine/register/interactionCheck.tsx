// app/medicine/interactionWarning.tsx
import Button from "@/components/Button";
import { colors } from "@/constants";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function InteractionWarningScreen() {
  const { recognizedMedicine, imageUri, formData } = useLocalSearchParams<{
    recognizedMedicine: string;
    imageUri: string;
    formData: string;
  }>();

  const [medicineData, setMedicineData] =
    useState<RecognizedMedicineInfo | null>(null);
  const [parsedFormData, setParsedFormData] = useState<any>(null);

  useEffect(() => {
    if (recognizedMedicine) {
      try {
        const parsed = JSON.parse(recognizedMedicine);
        setMedicineData(parsed);
      } catch (error) {
        console.error("약물 데이터 파싱 실패:", error);
        router.back();
      }
    }

    if (formData) {
      try {
        const parsed = JSON.parse(formData);
        setParsedFormData(parsed);
      } catch (error) {
        console.error("폼 데이터 파싱 실패:", error);
      }
    }
  }, [recognizedMedicine, formData]);

  const handleContinue = () => {
    router.push({
      pathname: "/medicine/register/precautions",
      params: {
        recognizedMedicine,
        imageUri,
        formData,
      },
    });
  };

  const handleCancel = () => {
    Alert.alert("등록 취소", "약물 등록을 취소하시겠습니까?", [
      { text: "계속 등록", style: "cancel" },
      {
        text: "등록 취소",
        style: "destructive",
        onPress: () => router.navigate("/medicine"),
      },
    ]);
  };

  if (!medicineData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 경고 헤더 */}
        <View style={styles.warningHeader}>
          <View style={styles.warningIconContainer}>
            <Ionicons name="warning" size={32} color={colors.RED} />
          </View>
          <Text style={styles.warningTitle}>약물 상호작용 위험 알림</Text>
        </View>

        {/* 약물 정보 */}
        <View style={styles.medicineCard}>
          <Text style={styles.medicineName}>{medicineData.name}</Text>
          <Text style={styles.medicineCode}>식별코드: N050734</Text>
        </View>

        {/* 상호작용 정보 */}
        <View style={styles.interactionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="alert-circle" size={20} color={colors.RED} />
            <Text style={styles.sectionTitle}>주요 상호작용</Text>
          </View>

          <View style={styles.interactionItem}>
            <View style={styles.drugInfo}>
              <Text style={styles.drugName}>와파린 (Warfarin)</Text>
              <View style={styles.riskBadge}>
                <Text style={styles.riskText}>높음</Text>
              </View>
            </View>
            <Text style={styles.interactionDescription}>
              혈액응고 방지제로, 국제표준화비율(INR) 수치 변화가 보고되어
              혈액응고 시간을 정기적으로 모니터링해야 합니다.
            </Text>
            <View style={styles.monitoringInfo}>
              <Ionicons name="time" size={16} color={colors.BLUE} />
              <Text style={styles.monitoringText}>
                정기 혈액 검사로 응고시간 확인 필요
              </Text>
            </View>
          </View>

          <View style={styles.interactionItem}>
            <View style={styles.drugInfo}>
              <Text style={styles.drugName}>로라타딘 (Loratadine)</Text>
              <View style={[styles.riskBadge, styles.moderateRisk]}>
                <Text style={styles.riskText}>보통</Text>
              </View>
            </View>
            <Text style={styles.interactionDescription}>
              항히스타민제로, 졸음이나 어지러움 등의 부작용이 증가할 수 있어
              운전이나 기계 조작 시 주의가 필요합니다.
            </Text>
            <View style={styles.monitoringInfo}>
              <Ionicons name="car" size={16} color={colors.YELLOW} />
              <Text style={styles.monitoringText}>
                운전 및 기계 조작 시 주의
              </Text>
            </View>
          </View>
        </View>

        {/* 일반적인 상호작용 주의사항 */}
        <View style={styles.generalWarningSection}>
          <Text style={styles.sectionTitle}>일반 주의사항</Text>
          <View style={styles.warningItem}>
            <Ionicons name="ellipse" size={6} color={colors.TEXT_GRAY} />
            <Text style={styles.warningText}>
              경구용 항응고제와 함께 복용할 경우 혈액응고 시간을 정기적으로
              모니터링
            </Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="ellipse" size={6} color={colors.TEXT_GRAY} />
            <Text style={styles.warningText}>
              알코올과 함께 복용 시 위장장애나 간 손상 위험 증가
            </Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="ellipse" size={6} color={colors.TEXT_GRAY} />
            <Text style={styles.warningText}>
              다른 항생제와 동시 복용 시 의사와 상담 필요
            </Text>
          </View>
        </View>

        {/* 의사 상담 권고 */}
        <View style={styles.consultationSection}>
          <View style={styles.consultationHeader}>
            <Ionicons name="medical" size={20} color={colors.BLUE} />
            <Text style={styles.consultationTitle}>의사 상담 권고</Text>
          </View>
          <Text style={styles.consultationText}>
            현재 복용 중인 다른 약물이 있거나, 기존 질병이 있는 경우 의사나
            약사와 상담 후 복용하시기 바랍니다.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼들 */}
      <View style={styles.bottomActions}>
        <Button
          text="등록 취소"
          onPress={handleCancel}
          size="large"
          color="gray"
        />
        <Button
          text="확인"
          onPress={handleContinue}
          size="large"
          color="pink"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_COLOR,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  warningHeader: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  warningIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.RED,
    textAlign: "center",
  },
  medicineCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.BLACK,
    marginBottom: 5,
  },
  medicineCode: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },
  interactionSection: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLACK,
  },
  interactionItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  drugInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  drugName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLACK,
  },
  riskBadge: {
    backgroundColor: colors.RED,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moderateRisk: {
    backgroundColor: colors.YELLOW,
  },
  riskText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.WHITE,
  },
  interactionDescription: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    lineHeight: 20,
    marginBottom: 10,
  },
  monitoringInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monitoringText: {
    fontSize: 13,
    color: colors.BLUE,
    fontWeight: "500",
  },
  generalWarningSection: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 5,
    gap: 10,
  },
  warningText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    lineHeight: 18,
    flex: 1,
  },
  consultationSection: {
    backgroundColor: "#F0F8FF",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.BLUE,
  },
  consultationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  consultationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLUE,
  },
  consultationText: {
    fontSize: 14,
    color: colors.BLACK,
    lineHeight: 20,
  },
  bottomActions: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: colors.LIGHT_GRAY,
    gap: 12,
  },
});
