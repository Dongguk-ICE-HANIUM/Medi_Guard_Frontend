import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import SingleMedicineCard from "./SingleMedicineCard";

interface TodayAllMedicineCardProps {
  medications: Medication[];
  selectedDate?: string;
  loading?: boolean;
}

const TodayAllMedicineCard = ({
  medications,
  selectedDate,
  loading = false,
}: TodayAllMedicineCardProps) => {
  // 그룹별로 약물 분류
  const groupMedications = medications.reduce((groups, medication) => {
    const groupName = medication.groupName;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(medication);
    return groups;
  }, {} as Record<string, Medication[]>);

  const GroupedMedicationList = () => {
    return (
      <>
        {Object.entries(groupMedications).map(([groupName, groupMeds]) => (
          <View key={groupName} style={styles.groupContainer}>
            {/* 그룹 카드 */}
            <View style={styles.groupCard}>
              <Text style={styles.groupCardTitle}>{groupName}</Text>
              <Button size="small" icon="right" />
            </View>
            {/* 개별 약물 카드들 */}
            {groupMeds.map((medication) => (
              <View key={medication.id} style={styles.medicationItem}>
                <SingleMedicineCard medication={medication} />
              </View>
            ))}
          </View>
        ))}
      </>
    );
  };
  const EmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>복용 약물이 없습니다.</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={colors.PINK} />;
  }

  const isExisted = medications.length > 0;
  return (
    <View style={styles.todayListContainer}>
      {isExisted ? <GroupedMedicationList /> : <EmptyState />}
    </View>
  );
};

export default TodayAllMedicineCard;

const styles = StyleSheet.create({
  todayListContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupCard: {
    backgroundColor: colors.WHITE,
    width: "100%",
    height: 60,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  groupCardTitle: {
    fontWeight: "bold",
    fontSize: 19,
    paddingLeft: 10,
  },
  medicationItem: {
    marginBottom: 10,
    maxHeight: 200,
  },
  emptyContainer: {},
  emptyText: {},
});
