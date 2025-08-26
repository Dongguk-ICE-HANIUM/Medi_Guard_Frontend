import { colors } from "@/constants";
import { Medication, TakingType } from "@/types/medication";
import { formatDateStringDot } from "@/utils/dateUtils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import InfoRow from "./InfoRow";

interface MedicationInfoProps {
  drugDetail: Medication;
}

const MedicationInfo = ({ drugDetail }: MedicationInfoProps) => (
  <View style={styles.section}>
    <InfoRow
      label="복용 기간"
      value={`${formatDateStringDot(
        drugDetail.startAt
      )} ~ ${formatDateStringDot(drugDetail.endAt)}`}
    />
    <InfoRow
      label="복약 주기"
      value={getTakingTypeText(drugDetail.takingType)}
    />
    <InfoRow label="1일 복약 횟수" value={`${drugDetail.perDay}회`} />
    <InfoRow label="1회 복용량" value={`${drugDetail.amount}정`} />
    <NotificationList notifications={drugDetail.notifiTakingList} />
    <InfoRow label="포함된 그룹" value={drugDetail.groupName || "x"} />
  </View>
);

// 알림 목록 컴포넌트
const NotificationList = ({
  notifications,
}: {
  notifications: { id: string; time: string; isActive?: boolean }[];
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>알림</Text>
    <View style={styles.notificationList}>
      {notifications.map((notification) => (
        <Text key={notification.id} style={styles.notificationTime}>
          {notification.time} {notification.isActive ? "(활성)" : "(비활성)"}
        </Text>
      ))}
    </View>
  </View>
);

// 복용 주기 텍스트 변환 함수
const getTakingTypeText = (takingType: TakingType) => {
  switch (takingType) {
    case TakingType.EVERY_DAY:
      return "매일";
    case TakingType.PARTICULAR_INTERVAL:
      return "특정일 간격";
    case TakingType.PARTICULAR_DAY:
      return "특정 요일";
    case TakingType.SPECIFIC_DATE:
      return "특정 날짜";
    case TakingType.NEED:
      return "필요시 복용";
    default:
      return takingType;
  }
};

const styles = StyleSheet.create({
  section: {
    padding: 15,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    flex: 1,
  },
  notificationList: {},
  notificationTime: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "column",
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default MedicationInfo;
