import Button from "@/components/Button";
import { colors } from "@/constants";
import { useMedicationContext } from "@/context/MedicationContext";
import { Medication } from "@/types/medication";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const MedicationDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { medications, updateMedication } = useMedicationContext();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    console.log("상세 페이지 - 받은 ID:", id);
    console.log("상세 페이지 - 전체 약물:", medications);

    if (id) {
      const foundMedication = medications.find((med) => med.id === id);
      console.log("상세 페이지 - 찾은 약물:", foundMedication);

      if (foundMedication) {
        setMedication(foundMedication);
        setIsActive(foundMedication.isActive);
      }
    }
  }, [id, medications]);

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    if (medication) {
      updateMedication(medication.id, { isActive: value });
    }
  };

  if (!medication) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>약물 정보를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* 약물 기본 정보 */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{medication.medicineInfo.name}</Text>
          <Text style={styles.brand}>
            복용 기간: {medication.startAt} ~ {medication.endAt}
          </Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={handleToggleActive}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
          thumbColor={colors.WHITE}
        />
      </View>

      {/* API에서 가져온 약물 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>약물 정보</Text>
        <Text style={styles.infoText}>
          약물 코드: {medication.medicineInfo.code}
        </Text>
        <Text style={styles.infoText}>
          효능: {medication.medicineInfo.effect}
        </Text>
        <Text style={styles.infoText}>
          주의사항: {medication.medicineInfo.warning}
        </Text>
        <Text style={styles.infoText}>
          부작용: {medication.medicineInfo.sideEffect}
        </Text>
        <Text style={styles.infoText}>
          상호작용: {medication.medicineInfo.interaction}
        </Text>
        <Text style={styles.infoText}>
          복용법: {medication.medicineInfo.deposit_method}
        </Text>
      </View>

      {/* 복용 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>복용 정보</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>복용 주기:</Text>
          <Text style={styles.infoValue}>{medication.takingType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>1일 복용 횟수:</Text>
          <Text style={styles.infoValue}>{medication.perDay}회</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>복용량:</Text>
          <Text style={styles.infoValue}>{medication.amount}정</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>그룹:</Text>
          <Text style={styles.infoValue}>{medication.groupName}</Text>
        </View>
      </View>

      {/* 알림 시간 */}
      {medication.notifiTakingList &&
        medication.notifiTakingList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>알림 시간</Text>
            {medication.notifiTakingList.map((notification, index) => (
              <View key={notification.id} style={styles.notificationItem}>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            ))}
          </View>
        )}

      <Button text="다음" />
    </ScrollView>
  );
};

export default MedicationDetailPage;

const styles = StyleSheet.create({
  centered: {},
  container: {},
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  notificationItem: {
    padding: 10,
    backgroundColor: colors.BACK_GRAY,
    borderRadius: 8,
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.TEXT_GRAY,
  },
});
