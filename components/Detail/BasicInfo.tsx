import { colors } from "@/constants";
import { DrugDetail } from "@/types/medication";
import React from "react";
import { StyleSheet, View } from "react-native";
import InfoRow from "./InfoRow";

interface BasicInfoProps {
  drugDetail: DrugDetail;
}

const BasicInfo = ({ drugDetail }: BasicInfoProps) => (
  <View style={styles.section}>
    <InfoRow label="식별코드" value={drugDetail.code} />
    <InfoRow label="효능" value={drugDetail.effect} />
    <InfoRow label="복용 방법" value={drugDetail.deposit_method} />
    <InfoRow label="주의사항" value={drugDetail.warning} />
    <InfoRow label="부작용" value={drugDetail.sideEffect} />
    <InfoRow label="상호 작용" value={drugDetail.interaction} />
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
