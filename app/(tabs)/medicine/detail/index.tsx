import BasicInfo from "@/components/Detail/BasicInfo";
import MedicationInfo from "@/components/Detail/MedicationInfo";
import { colors } from "@/constants";
import { mockMedicineStore } from "@/data/mockMedicineStore";
import { useMedicationDetail } from "@/hooks/medication/useMedicationQuery";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MedicationDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    data: drugDetail,
    isLoading: loading,
    refetch,
  } = useMedicationDetail(id || "");
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "medication">("basic");

  useEffect(() => {
    if (drugDetail) {
      setIsActive(drugDetail.isActive);
    }
  }, [drugDetail]);

  const handleToggleActive = async (value: boolean) => {
    if (drugDetail) {
      try {
        await mockMedicineStore.updateMedication(drugDetail.id, {
          isActive: value,
        });
        setIsActive(value);

        // React Query 캐시 즉시 업데이트
        queryClient.setQueryData(["medications", "detail", drugDetail.id], {
          ...drugDetail,
          isActive: value,
        });

        // 다른 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: ["medications", "list"] });
        queryClient.invalidateQueries({ queryKey: ["calendarDrugs"] });

        console.log("약물 활성화 상태 변경 완료:", value);
      } catch (error) {
        console.error("활성화 상태 변경 중 오류:", error);
      }
    }
  };

  const handleEdit = () => {
    if (drugDetail) {
      router.push({
        pathname: "/medicine/register/registerForm",
        params: {
          mode: "edit",
          drugId: drugDetail.id,
          drugName: drugDetail.medicineInfo.name,
          startAt: drugDetail.startAt,
          endAt: drugDetail.endAt,
          takingType: drugDetail.takingType,
          perDay: drugDetail.perDay.toString(),
          amount: drugDetail.amount.toString(),
          groupName: drugDetail.groupName || "",
          isActive: drugDetail.isActive.toString(),
        },
      });
    }
  };

  // 편집 후 돌아왔을 때 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (id) {
        refetch();
      }
    }, [id, refetch])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!drugDetail) {
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
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{drugDetail.medicineInfo.name}</Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={handleToggleActive}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
          thumbColor={colors.WHITE}
        />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabGroup}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "basic" && styles.activeTab]}
            onPress={() => setActiveTab("basic")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "basic" && styles.activeTabText,
              ]}
            >
              기본
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "medication" && styles.activeTab]}
            onPress={() => setActiveTab("medication")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "medication" && styles.activeTabText,
              ]}
            >
              복약
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "medication" && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editText}>편집</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabBorder} />

      {activeTab === "basic" ? (
        <BasicInfo drugDetail={drugDetail} />
      ) : (
        <MedicationInfo drugDetail={drugDetail} />
      )}
    </ScrollView>
  );
};
export default MedicationDetailPage;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.BACK_GRAY,
  },
  content: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingLeft: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 0,
    paddingBottom: 0,
    position: "relative",
  },

  tabGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
    marginLeft: 15,
  },

  tab: {
    paddingVertical: 15,
    paddingHorizontal: 0,
    alignItems: "flex-start",
    marginRight: 20,
  },

  activeTab: {
    borderBottomWidth: 2.5,
    borderBottomColor: colors.BLACK,
  },
  tabText: {
    fontSize: 17,
    color: colors.TEXT_GRAY,
  },
  activeTabText: {
    color: colors.BLACK,
    fontWeight: "bold",
  },

  editButton: {
    position: "absolute",
    right: 0,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },

  editText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },

  tabBorder: {
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
    marginBottom: 20,
    marginTop: 0,
  },
  editIcon: {
    fontSize: 20,
  },
});
