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
    if (id) {
      const foundMedication = medications.find((med) => med.id === id);
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
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.brand}>제조사</Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={handleToggleActive}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
          thumbColor={colors.WHITE}
        />
      </View>
      <Button text="다음" />
    </ScrollView>
  );
};

export default MedicationDetailPage;

const styles = StyleSheet.create({
  centered: {},
  container: {},
  content: {},
  header: {},
  headerInfo: {},
  name: {},
  brand: {},
});
