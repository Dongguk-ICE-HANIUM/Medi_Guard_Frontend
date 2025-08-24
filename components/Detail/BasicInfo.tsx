import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import React from "react";
import { StyleSheet, View } from "react-native";
import InfoRow from "./InfoRow";

interface BasicInfoProps {
  drugDetail: Medication;
}

const BasicInfo = ({ drugDetail }: BasicInfoProps) => (
  <View style={styles.section}>
    <InfoRow label="식별코드" value={drugDetail.medicineInfo.code} />
    <InfoRow label="효능" value={drugDetail.medicineInfo.effect} />
    <InfoRow label="복용 방법" value={drugDetail.medicineInfo.depositMethod} />
    <InfoRow label="주의사항" value={drugDetail.medicineInfo.warning} />
    <InfoRow label="부작용" value={drugDetail.medicineInfo.sideEffect} />
    <InfoRow label="상호 작용" value={drugDetail.medicineInfo.interaction} />
  </View>
);

const styles = StyleSheet.create({
  section: {
    padding: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    flex: 1,
  },
});

export default BasicInfo;
