import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GroupMedicineCard from "./GroupMedicineCard";
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
  // 디버깅용 로그
  console.log("TodayAllMedicineCard - 전체 약물:", medications.length, "개");
  medications.forEach((med, index) => {
    console.log(
      `약물 ${index + 1}:`,
      med.medicineInfo.name,
      "그룹:",
      med.groupName
    );
  });

  const groupMedications = medications.reduce((groups, medication) => {
    const groupName = medication.groupName;
    const groupId = medication.groupId;
    if (
      groupName &&
      groupName.trim() !== "" &&
      groupId &&
      groupId.trim() !== ""
    ) {
      if (!groups[groupId]) {
        groups[groupId] = {
          name: groupName,
          medications: [],
        };
      }
      groups[groupId].medications.push(medication);
    }
    return groups;
  }, {} as Record<string, { name: string; medications: Medication[] }>);

  const individualMedications = medications.filter(
    (medication) => !medication.groupName || medication.groupName.trim() === ""
  );

  console.log("그룹 약물:", Object.keys(groupMedications));
  console.log(
    "개별 약물:",
    individualMedications.map((m) => m.medicineInfo.name)
  );

  const GroupedMedicationList = () => {
    return (
      <>
        {/* 그룹 약물 */}
        {Object.entries(groupMedications).map(([groupId, groupData]) => (
          <GroupMedicineCard
            key={groupId}
            groupId={groupId}
            groupName={groupData.name}
            medications={groupData.medications}
          />
        ))}

        {/* 개별 약물 */}
        {individualMedications.map((medication) => (
          <View key={medication.id} style={styles.medicationItem}>
            <SingleMedicineCard
              medication={medication}
              selectedDate={selectedDate}
              showGroupDetail={true}
            />
          </View>
        ))}
      </>
    );
  };
  const EmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>복용 약물이 없습니다</Text>
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
  medicationItem: {
    marginBottom: 10,
    maxHeight: 200,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  emptyText: {},
});
