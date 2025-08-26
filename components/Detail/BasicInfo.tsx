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
    <InfoRow
      label="식별코드"
      value={drugDetail.medicineInfo.code || "M01AA02"}
    />
    <InfoRow
      label="효능"
      value={
        drugDetail.medicineInfo.effect ||
        "각종 세균 감염(중이염, 기관지염, 폐렴, 부비동염, 요로감염 등) 치료."
      }
    />
    <InfoRow
      label="복용 방법"
      value={
        drugDetail.medicineInfo.depositMethod ||
        "성인: 1회 1정(아목시실린/클라불란산 기준) 1일 2~3회, 식사 초기에 복용. \n처방 기간/용량은 의사 지시에 따름."
      }
    />
    <InfoRow
      label="주의사항"
      value={
        drugDetail.medicineInfo.warning ||
        "페니실린 알레르기, 간·신장질환, 임신·수유부 복용 전 전문의 상담. \n복용 중 발진, 설사, 호흡곤란 등 나타나면 복용 중지."
      }
    />
    <InfoRow
      label="부작용"
      value={
        drugDetail.medicineInfo.sideEffect ||
        "설사, 구역, 복통, 발진 등. \n간혹 심한 알레르기 반응, 간·신장 이상 발생 가능."
      }
    />
    <InfoRow
      label="상호 작용"
      value={
        drugDetail.medicineInfo.interaction ||
        "다른 항생제, 경구피임약, 항응고제 등과 병용 시 전문의 상담. \n알코올 복용 주의."
      }
    />
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
