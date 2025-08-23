import { removeDrugFromGroup } from "@/api/medicine";
import Button from "@/components/Button";
import SingleMedicineCard from "@/components/Card/SingleMedicineCard";
import { colors } from "@/constants";
import { useMedicationContext } from "@/context/MedicationContext";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GroupDetailPage() {
  const params = useLocalSearchParams<{ groupId?: string }>();
  const { medications } = useMedicationContext();
  const groupId = params.groupId || "";
  const [isEditMode, setIsEditMode] = useState(false);

  const groupMedications = useMemo(() => {
    return medications.filter((medication) => medication.groupId === groupId);
  }, [medications, groupId]);

  const groupName = useMemo(() => {
    if (groupMedications.length > 0) {
      return groupMedications[0].groupName;
    }
    return "";
  }, [groupMedications]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // TODO: 그룹 정보 저장 로직 추가
    console.log("그룹 정보 저장");
  };

  const handleDeleteMedication = async (medicationId: string) => {
    Alert.alert("약물 제거", "이 약물을 그룹에서 제거하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "제거",
        style: "destructive",
        onPress: async () => {
          try {
            await removeDrugFromGroup(medicationId);
            // 성공적으로 제거됨
            console.log("약물이 그룹에서 제거되었습니다:", medicationId);
          } catch (error) {
            console.error("약물 제거 실패:", error);
            Alert.alert("오류", "약물 제거에 실패했습니다.");
          }
        },
      },
    ]);
  };

  if (!groupId || !groupName) {
    return (
      <View style={styles.centered}>
        <Text>그룹 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{groupName}</Text>
        {isEditMode ? (
          <Button text="저장" size="small" onPress={handleSave} />
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <AntDesign name="edit" size={23} color={colors.BLACK} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.medicationsContainer}>
        {groupMedications.map((medication) => (
          <View key={medication.id} style={styles.medicationItem}>
            <SingleMedicineCard
              medication={medication}
              showGroupDetail={true}
              isEditMode={isEditMode}
              onDelete={handleDeleteMedication}
            />
          </View>
        ))}
      </View>

      {groupMedications.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>이 그룹에 속한 약물이 없습니다.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,

    borderRadius: 15,
    borderBottomWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: colors.PINK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  medicationsContainer: {
    gap: 15,
    paddingHorizontal: 10,
  },
  medicationItem: {
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
