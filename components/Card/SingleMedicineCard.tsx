import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import { formatDateStringDot } from "@/utils/dateUtils";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import ProgressBar from "./ProgressBar";
import Toggle from "./Toggle";

export interface SingleMedicineCardProps {
  medication: Medication;
  selectedDate?: string;
}

const SingleMedicineCard = ({
  medication,
  selectedDate,
}: SingleMedicineCardProps) => {
  const handleToDetail = () => {
    console.log(
      "약물 상세 페이지로 이동:",
      medication.id,
      medication.medicineInfo.name
    );
    router.push({
      pathname: "/medicine/detail",
      params: { id: medication.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.name}>{medication.medicineInfo.name}</Text>
          <Text style={styles.date}>
            {formatDateStringDot(medication.startAt)}~
            {formatDateStringDot(medication.endAt)}
          </Text>
        </View>
        <Button size="small" icon="right" onPress={handleToDetail} />
      </View>
      <View style={styles.progressBar}>
        <ProgressBar medication={medication} selectedDate={selectedDate} />
      </View>
      <View style={styles.toggle}>
        <Toggle medication={medication} />
      </View>
    </View>
  );
};

export default SingleMedicineCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    flexDirection: "column",
    gap: 5,
    paddingLeft: 10,
  },
  name: { fontWeight: "bold", fontSize: 19 },
  date: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
  },
  progressBar: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 15,
  },
  checkboxContainer: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 10,
  },
  toggle: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 10,
  },
});
