import { colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";

interface GroupMedicineCardProps {
  drugGroup: {
    id: string;
    name: string;
  };
}

const GroupMedicineCard = ({ drugGroup }: GroupMedicineCardProps) => {
  return (
    <View style={styles.groupMediCardContainer}>
      <Text style={styles.groupCardtitle}>{drugGroup.name}</Text>
      <Button size="small" icon="right" />
    </View>
  );
};

export default GroupMedicineCard;

const styles = StyleSheet.create({
  groupMediCardContainer: {
    backgroundColor: colors.WHITE,
    width: "100%",
    height: 60,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
  },
  groupCardtitle: {
    fontWeight: "bold",
    fontSize: 19,
    paddingLeft: 10,
  },
});
