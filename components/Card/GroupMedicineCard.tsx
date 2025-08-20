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
}

export default function GroupMedicineCard({
  groupId,
  groupName,
  medications,
  onPress,
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
      <Button size="small" icon="right" onPress={handlePress} />
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
});
