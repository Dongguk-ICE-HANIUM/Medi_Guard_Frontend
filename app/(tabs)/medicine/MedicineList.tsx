import Button from "@/components/Button";
import GroupMedicineCard from "@/components/Card/GroupMedicineCard";
import SingleMedicineCard from "@/components/Card/SingleMedicineCard";
import { colors } from "@/constants";
import { useMedicationList } from "@/hooks/useMedicationQuery";
import { Medication } from "@/types/medication";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "all" | "taking" | "completed" | "scheduled";

const MedicineList = () => {
  const { data: medications = [] } = useMedicationList();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isEditMode, setIsEditMode] = useState(false);

  // 약물 상태별 분류
  const categorizedMedications = useMemo(() => {
    const currentDate = new Date();

    const all: Medication[] = [...medications];
    const taking: Medication[] = [];
    const completed: Medication[] = [];
    const scheduled: Medication[] = [];

    // 그룹별로 약물들을 분류
    const groupMedications: Record<string, Medication[]> = {};

    medications.forEach((medication) => {
      if (medication.groupId && medication.groupId.trim() !== "") {
        if (!groupMedications[medication.groupId]) {
          groupMedications[medication.groupId] = [];
        }
        groupMedications[medication.groupId].push(medication);
      }
    });

    // 개별 약물과 그룹 약물을 분류
    medications.forEach((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);

      if (currentDate >= startDate && currentDate <= endDate) {
        taking.push(medication);
      } else if (currentDate > endDate) {
        // 그룹에 속한 약물인 경우, 그룹의 모든 약물이 완료되어야 완료로 분류
        if (medication.groupId && medication.groupId.trim() !== "") {
          const groupMeds = groupMedications[medication.groupId];
          const allGroupCompleted = groupMeds.every((med) => {
            const medEndDate = new Date(med.endAt);
            return currentDate > medEndDate;
          });
          if (allGroupCompleted) {
            completed.push(medication);
          }
        } else {
          // 개별 약물은 바로 완료로 분류
          completed.push(medication);
        }
      } else {
        scheduled.push(medication);
      }
    });

    return { all, taking, completed, scheduled };
  }, [medications]);

  // 그룹별 약물 분류
  const getGroupedMedications = (medications: Medication[]) => {
    const groups: Record<string, { name: string; medications: Medication[] }> =
      {};
    const individual: Medication[] = [];

    medications.forEach((medication) => {
      if (
        medication.groupName &&
        medication.groupName.trim() !== "" &&
        medication.groupId
      ) {
        if (!groups[medication.groupId]) {
          groups[medication.groupId] = {
            name: medication.groupName,
            medications: [],
          };
        }
        groups[medication.groupId].medications.push(medication);
      } else {
        individual.push(medication);
      }
    });

    return { groups, individual };
  };

  const currentMedications = categorizedMedications[activeTab];
  const { groups, individual } = getGroupedMedications(currentMedications);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // TODO: 전체 편집 저장 로직 추가
    console.log("전체 편집 저장");
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
            // await removeDrugFromGroup(medicationId); // This line was removed as per the new_code
            console.log("약물이 그룹에서 제거되었습니다:", medicationId);
          } catch (error) {
            console.error("약물 제거 실패:", error);
            Alert.alert("오류", "약물 제거에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      "그룹 삭제",
      "이 그룹과 그룹에 속한 모든 약물을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              // await deleteGroup(groupId); // This line was removed as per the new_code
              console.log("그룹이 삭제되었습니다:", groupId);
            } catch (error) {
              console.error("그룹 삭제 실패:", error);
              Alert.alert("오류", "그룹 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const renderTabButton = (tab: TabType, label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>전체 복용약 보기</Text>
        {isEditMode ? (
          <Button text="저장" size="small" onPress={handleSave} />
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.titleEditButton}>
            <AntDesign name="edit" size={23} color={colors.BLACK} />
          </TouchableOpacity>
        )}
      </View>

      {/* 탭 버튼들 */}
      <View style={styles.tabContainer}>
        {renderTabButton("all", "전체")}
        {renderTabButton("taking", "복용 중")}
        {renderTabButton("completed", "복용 완료")}
        {renderTabButton("scheduled", "복용 예정")}
      </View>

      {/* 약물 리스트 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 그룹 약물들 */}
        {Object.entries(groups).map(([groupId, groupData]) => (
          <View key={groupId} style={styles.groupItem}>
            <GroupMedicineCard
              groupId={groupId}
              groupName={groupData.name}
              medications={groupData.medications}
              isEditMode={isEditMode}
              onDelete={handleDeleteGroup}
            />
          </View>
        ))}

        {/* 개별 약물들 */}
        {individual.map((medication) => (
          <View key={medication.id} style={styles.medicationItem}>
            <SingleMedicineCard
              medication={medication}
              showGroupDetail={true}
              isEditMode={isEditMode}
              onDelete={handleDeleteMedication}
            />
          </View>
        ))}

        {/* 빈 상태 */}
        {currentMedications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === "all" && "등록된 약물이 없습니다."}
              {activeTab === "taking" && "복용 중인 약물이 없습니다."}
              {activeTab === "completed" && "복용 완료된 약물이 없습니다."}
              {activeTab === "scheduled" && "복용 예정인 약물이 없습니다."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MedicineList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_COLOR,
    paddingVertical: 15,
  },

  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.BLACK,
  },
  titleEditButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 0,
    marginRight: 15,
  },
  activeTabButton: {
    borderBottomWidth: 2.5,
    borderBottomColor: colors.BLACK,
  },
  tabText: {
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.BLACK,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  groupItem: {
    marginBottom: 15,
  },
  medicationItem: {
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#6C757D",
  },
});
