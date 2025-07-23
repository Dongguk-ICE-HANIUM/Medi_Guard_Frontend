import { colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import ProgressBar from "./ProgressBar";
import Toggle from "./Toggle";

export interface SingleMedicineCardProps {
  drugItem: {
    id: string;
    calendarDrugId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    timeSlot: number;
    takenDaysCount: number;
    missedDaysCount: number;
  };
}

const SingleMedicineCard = ({ drugItem }: SingleMedicineCardProps) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Text style={styles.name}>{drugItem.name}</Text>
          <Text style={styles.date}>
            {formatDate(drugItem.startDate)}~{formatDate(drugItem.endDate)}
          </Text>
        </View>
        <Button size="small" icon="right" />
      </View>
      <View style={styles.progressBar}>
        <ProgressBar drugItem={drugItem} />
      </View>
      <View style={styles.toggle}>
        <Toggle />
      </View>
    </View>
  );
};

export default SingleMedicineCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    width: "100%",
    height: 130,
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
    gap: 7,
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
  toggle: { width: "100%", paddingLeft: 10 },
});
