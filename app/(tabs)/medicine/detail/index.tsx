import { fetchDrugDetail } from "@/api/medicine";
import Button from "@/components/Button";
import BasicInfo from "@/components/Detail/BasicInfo";
import MedicationInfo from "@/components/Detail/MedicationInfo";
import { colors } from "@/constants";
import { DrugDetail } from "@/types/medication";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [drugDetail, setDrugDetail] = useState<DrugDetail | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "medication">("basic");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await fetchDrugDetail(id);
          if (response.result) {
            setDrugDetail(response.result);
            setIsActive(response.result.isActive);
          }
        } catch (error) {
          console.error("약물 상세 정보 로드 실패:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    console.log("약물 활성화 상태 변경:", value);
  };

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
          <Text style={styles.name}>{drugDetail.name}</Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={handleToggleActive}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
          thumbColor={colors.WHITE}
        />
      </View>

      {/* 🔥 수정된 부분: 탭 헤더와 편집 버튼 */}
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

        {/* 🔥 수정: 복약 탭일 때만 편집 버튼 표시 */}
        {activeTab === "medication" && (
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>편집</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🔥 수정된 부분: 탭 아래 구분선 */}
      <View style={styles.tabBorder} />

      {activeTab === "basic" ? (
        <BasicInfo drugDetail={drugDetail} />
      ) : (
        <MedicationInfo drugDetail={drugDetail} />
      )}

      <Button text="다음" />
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
  // 🔥 수정된 부분: 탭 컨테이너 스타일
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // 하단 정렬로 변경
    marginBottom: 0, // marginBottom 제거
    paddingBottom: 0, // paddingBottom 제거
    position: "relative",
  },
  // 🔥 수정된 부분: 탭 그룹 스타일
  tabGroup: {
    flexDirection: "row",
    justifyContent: "flex-start", // 왼쪽 정렬로 되돌림
    flex: 1,
    marginLeft: 15, // 약물명과 같은 위치에서 시작
  },
  // 🔥 수정된 부분: 탭 스타일
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 0, // 패딩 제거
    alignItems: "flex-start", // 왼쪽 정렬
    marginRight: 20, // 탭 간 간격
  },
  // 🔥 수정된 부분: 활성 탭 스타일
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
  // 🔥 수정: 편집 버튼을 토글과 같은 라인에 맞춤
  editButton: {
    position: "absolute",
    right: 0, // 토글 버튼과 같은 오른쪽 끝 라인
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },
  // 🔥 새로 추가: 편집 텍스트 스타일
  editText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },
  // 🔥 새로 추가된 부분: 탭 아래 구분선
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
