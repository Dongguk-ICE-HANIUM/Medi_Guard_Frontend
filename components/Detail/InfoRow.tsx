import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>
      {value && value.trim() !== "" ? value : "정보 없음"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "column",
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 25,
  },
});

export default InfoRow;
