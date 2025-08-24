import Button from "@/components/Button";
import { mockMedicineStore } from "@/data/mockMedicineStore";
import { Medication } from "@/types/medication";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const confirm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    medicationData?: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 약물 데이터가 있으면 mockMedicineStore에 저장
    if (params.medicationData) {
      const saveMedication = async () => {
        try {
          setIsLoading(true);
          const medication: Medication = JSON.parse(params.medicationData!);
          await mockMedicineStore.addMedication(medication);
          console.log("새로운 약물 등록 완료:", medication.medicineInfo.name);
        } catch (error) {
          console.error("약물 등록 중 오류 발생:", error);
        } finally {
          setIsLoading(false);
        }
      };

      saveMedication();
    }
  }, [params.medicationData]);

  const goMedicineHome = () => {
    router.replace("/(tabs)/medicine");
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.body}>
        <Text style={styles.title}>복약 정보가 등록되었어요</Text>
        <Text style={styles.content}>
          등록된 복약 정보는 {"\n"}전체 복용약 보기에서 확인하실 수 있어요
        </Text>
        {isLoading && (
          <Text style={styles.loadingText}>
            약물 정보를 저장하고 있습니다...
          </Text>
        )}
      </View>
      <View style={styles.button}>
        <Button text="완료" onPress={goMedicineHome} disabled={isLoading} />
      </View>
    </View>
  );
};

export default confirm;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
  },
  button: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
