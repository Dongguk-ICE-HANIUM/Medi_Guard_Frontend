import Button from "@/components/Button";
import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GroupMedicineCardProps {
  groupId: string;
  groupName: string;
  medications: Medication[];
  onPress?: () => void;
  isEditMode?: boolean;
  onDelete?: (medicationId: string) => void;
}

export default function GroupMedicineCard({
  groupId,
  groupName,
  medications,
  onPress,
  isEditMode = false,
  onDelete,
}: GroupMedicineCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/medicine/groupDetail",
        params: { groupId },
      });
    }
  };

  return (
    <View style={styles.groupCard}>
      <Text style={styles.groupCardTitle}>{groupName}</Text>
      {isEditMode ? (
        <View style={styles.editButtons}>
          {medications.map((medication) => (
            <View key={medication.id} style={styles.medicationRow}>
              <Text style={styles.medicationName}>
                {medication.medicineInfo.name || "휴온스아목시크라정"}
              </Text>
              <Button
                text="삭제"
                size="small"
                color="gray"
                onPress={() => onDelete?.(medication.id)}
                style={styles.deleteButton}
              />
            </View>
          ))}
        </View>
      ) : (
        <Button size="small" icon="right" onPress={handlePress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    marginBottom: 10,
  },
  groupCardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: colors.BLACK,
    paddingLeft: 10,
  },
  editButtons: {
    flexDirection: "column",
    gap: 5,
  },
  deleteButton: {
    width: "100%",
  },
  medicationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.BLACK,
  },
});
