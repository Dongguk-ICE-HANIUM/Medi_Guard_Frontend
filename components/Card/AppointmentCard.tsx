import { colors } from "@/constants";
import {
  formatAppointmentDisplay,
  getTimeUntilAppointment,
} from "@/utils/dateUtils";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppointmentCardProps {
  dateTime: string;
  hospitalName: string;
  doctorName: string;
  type: "detail" | "start" | "time";

  onDetailPress?: () => void;
  onStartPress?: () => void;

  isToday?: boolean;
}

const AppointmentCard = ({
  dateTime,
  hospitalName,
  doctorName,
  type,
  onDetailPress,
  onStartPress,
  isToday = false,
}: AppointmentCardProps) => {
  const formatDateTime = formatAppointmentDisplay(dateTime);
  const timeUntil = getTimeUntilAppointment(dateTime);

  const renderRightContent = () => {
    switch (type) {
      case "detail":
        return (
          <TouchableOpacity
            style={styles.rightContent}
            onPress={onDetailPress}
            activeOpacity={0.8}
          >
            <AntDesign name="right" size={18} color={colors.TEXT_GRAY} />
          </TouchableOpacity>
        );
      case "start":
        return (
          <TouchableOpacity
            style={styles.rightContent}
            onPress={onStartPress}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.rightContentText, isToday && styles.todayText]}
            >
              진료 시작
            </Text>
            <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
        );
      case "time":
        return (
          <View style={styles.rightContent}>
            <Text>{timeUntil}</Text>
          </View>
        );
      default:
        return null;
    }
  };
  return (
    <View style={[styles.container, isToday && styles.todayContainer]}>
      <View style={styles.leftContent}>
        <FontAwesome5
          name="calendar-alt"
          size={23}
          style={styles.calendarIcon}
          color="black"
        />
        <View style={styles.content}>
          <Text style={styles.date}>{formatDateTime}</Text>
          <Text style={styles.hospitaInfo}>
            {hospitalName} {doctorName}
          </Text>
        </View>
      </View>
      <View>{renderRightContent()}</View>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 13,
    shadowColor: colors.TEXT_GRAY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.34,
    borderLeftWidth: 5,
    borderLeftColor: colors.PINK + "80",
  },
  todayContainer: {
    borderLeftWidth: 5,
    borderLeftColor: colors.PINK,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  calendarIcon: {
    marginRight: 20,
  },
  content: {
    marginRight: 20,
    gap: 6,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  hospitaInfo: {
    fontSize: 14,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  rightContentText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.TEXT_GRAY,
  },
  todayText: {
    fontWeight: "600",
    color: colors.BLACK,
  },
});
