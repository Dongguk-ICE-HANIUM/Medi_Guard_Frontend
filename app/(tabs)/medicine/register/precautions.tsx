// app/medicine/precautions.tsx
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

export default function PrecautionsScreen() {
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
    if (!medicineData || !parsedFormData) {
      Alert.alert("오류", "약물 정보를 불러올 수 없습니다.");
      return;
    }

    // confirm 화면으로 이동하면서 완전한 약물 데이터 전달
    const completeMedicationData = {
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      medicineInfo: {
        id: medicineData.id,
        name: medicineData.name, // 하드코딩 제거, 실제 약물 이름 사용
        code: medicineData.code,
        effect: medicineData.effect,
        warning: medicineData.warning,
        sideEffect: medicineData.sideEffect,
        interaction: medicineData.interaction,
        depositMethod: medicineData.depositMethod,
      },
      startAt: parsedFormData.startDate || "", // 빈 값이면 빈 문자열
      endAt: parsedFormData.endDate || "", // 빈 값이면 빈 문자열
      takingType: parsedFormData.selectedTakingType,
      interval: parsedFormData.interval,
      specificDateList: parsedFormData.specificDates,
      perDay: parsedFormData.perDay,
      amount: parsedFormData.amount,
      isActive: true,
      isEssential: false,
      groupName: "", // AI 등록도 개별 약품으로 표시
      groupId: "", // AI 등록도 개별 약품으로 표시
      notifiTakingList: [],
    };

    router.push({
      pathname: "/medicine/register/confirm",
      params: {
        medicationData: JSON.stringify(completeMedicationData),
      },
    });
  };

  const handleBack = () => {
    router.back();
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
        {/* 주의사항 헤더 */}
        <View style={styles.warningHeader}>
          <View style={styles.warningIconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={colors.BLUE} />
          </View>
          <Text style={styles.warningTitle}>복용 시 주의 사항</Text>
          <Text style={styles.warningSubtitle}>
            안전한 복용을 위해 다음 사항을 확인해주세요
          </Text>
        </View>

        {/* 약물 정보 */}
        <View style={styles.medicineCard}>
          <Text style={styles.medicineName}>{medicineData.name}</Text>
          <Text style={styles.medicineCode}>식별코드: N050734</Text>
        </View>

        {/* 임산부/수유부 주의사항 */}
        <View style={styles.cautionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color={colors.PURPLE} />
            <Text style={styles.sectionTitle}>임산부 및 수유부</Text>
          </View>
          <Text style={styles.cautionText}>
            임산부는 이 약의 혈액 중에 들어간 양이 보고되어 있어 분만 시 용량을
            제한해야 합니다. 수유 중인 여성은 복용 전 의사와 반드시 상담하세요.
          </Text>
        </View>

        {/* 신장기능 장애 주의사항 */}
        <View style={styles.cautionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={20} color={colors.RED} />
            <Text style={styles.sectionTitle}>신장기능 장애</Text>
          </View>
          <Text style={styles.cautionText}>
            신장기능이 저하된 환자들은 사용하지 말아야 합니다. 신장 질환 병력이
            있는 경우 복용 전 의사와 상담이 필요합니다.
          </Text>
        </View>

        {/* 알레르기 및 과민반응 */}
        <View style={styles.cautionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={20} color={colors.YELLOW} />
            <Text style={styles.sectionTitle}>알레르기 반응</Text>
          </View>
          <Text style={styles.cautionText}>
            페니실린계 항생제에 알레르기가 있는 경우 사용을 피해야 합니다. 과거
            항생제 알레르기 병력이 있다면 의사에게 미리 알려주세요.
          </Text>

          <View style={styles.symptomsList}>
            <Text style={styles.symptomsTitle}>즉시 중단해야 할 증상:</Text>
            <View style={styles.symptomItem}>
              <Ionicons name="ellipse" size={4} color={colors.RED} />
              <Text style={styles.symptomText}>발진, 두드러기, 가려움</Text>
            </View>
            <View style={styles.symptomItem}>
              <Ionicons name="ellipse" size={4} color={colors.RED} />
              <Text style={styles.symptomText}>호흡곤란, 천명음</Text>
            </View>
            <View style={styles.symptomItem}>
              <Ionicons name="ellipse" size={4} color={colors.RED} />
              <Text style={styles.symptomText}>얼굴, 입술, 혀의 부종</Text>
            </View>
          </View>
        </View>

        {/* 복용 중 주의사항 */}
        <View style={styles.cautionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={colors.GREEN} />
            <Text style={styles.sectionTitle}>복용 중 주의사항</Text>
          </View>

          <View style={styles.precautionsList}>
            <View style={styles.precautionItem}>
              <View style={styles.precautionIcon}>
                <Ionicons name="restaurant" size={16} color={colors.BLUE} />
              </View>
              <View style={styles.precautionContent}>
                <Text style={styles.precautionTitle}>식사와 함께 복용</Text>
                <Text style={styles.precautionDesc}>
                  위장장애를 줄이기 위해 식사 중이나 식후에 복용하세요
                </Text>
              </View>
            </View>

            <View style={styles.precautionItem}>
              <View style={styles.precautionIcon}>
                <Ionicons name="water" size={16} color={colors.BLUE} />
              </View>
              <View style={styles.precautionContent}>
                <Text style={styles.precautionTitle}>충분한 수분 섭취</Text>
                <Text style={styles.precautionDesc}>
                  약물 복용 시 충분한 물과 함께 드세요
                </Text>
              </View>
            </View>

            <View style={styles.precautionItem}>
              <View style={styles.precautionIcon}>
                <Ionicons name="ban" size={16} color={colors.RED} />
              </View>
              <View style={styles.precautionContent}>
                <Text style={styles.precautionTitle}>음주 금지</Text>
                <Text style={styles.precautionDesc}>
                  복용 중에는 알코올 섭취를 피해주세요
                </Text>
              </View>
            </View>

            <View style={styles.precautionItem}>
              <View style={styles.precautionIcon}>
                <Ionicons name="calendar" size={16} color={colors.GREEN} />
              </View>
              <View style={styles.precautionContent}>
                <Text style={styles.precautionTitle}>처방 기간 준수</Text>
                <Text style={styles.precautionDesc}>
                  증상이 호전되어도 처방받은 기간 동안 복용하세요
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 응급상황 안내 */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="call" size={20} color={colors.RED} />
            <Text style={styles.emergencyTitle}>응급상황 시</Text>
          </View>
          <Text style={styles.emergencyText}>
            심각한 알레르기 반응이나 부작용이 나타나면 즉시 복용을 중단하고
            가까운 병원 응급실을 방문하거나 119에 신고하세요.
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼들 */}
      <View style={styles.bottomActions}>
        <Button
          text="돌아가기"
          onPress={handleBack}
          size="large"
          color="gray"
        />
        <Button
          text="동의하고 등록"
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
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.BLACK,
    marginBottom: 8,
    textAlign: "center",
  },
  warningSubtitle: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
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
  cautionSection: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLACK,
  },
  cautionText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    lineHeight: 20,
  },
  symptomsList: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.LIGHT_GRAY,
  },
  symptomsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.RED,
    marginBottom: 10,
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 10,
    gap: 8,
  },
  symptomText: {
    fontSize: 13,
    color: colors.TEXT_GRAY,
  },
  precautionsList: {
    gap: 15,
  },
  precautionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  precautionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  precautionContent: {
    flex: 1,
  },
  precautionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.BLACK,
    marginBottom: 4,
  },
  precautionDesc: {
    fontSize: 13,
    color: colors.TEXT_GRAY,
    lineHeight: 18,
  },
  emergencySection: {
    backgroundColor: "#FFF5F5",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFE6E6",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.RED,
  },
  emergencyText: {
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
