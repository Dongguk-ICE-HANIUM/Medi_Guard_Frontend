import { colors } from "@/constants";
import { TakingType } from "@/types/medication";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NumberInput from "../NumberInput";
import SpecificDate from "./SpecificDate";

interface TakingCycleDetailsProps {
  takingType: TakingType;
  interval?: number;
  particularDate?: string[];
  selectedDays?: string[];
  onIntervalChange?: (interval: number) => void;
  onParticularDateChange?: (dates: string[]) => void;
  onSelectedDaysChange?: (days: string[]) => void;
  errors?: string[];
  showError?: boolean;
  startAt?: string;
  endAt?: string;
}

const TakingCycleDetails: React.FC<TakingCycleDetailsProps> = ({
  takingType,
  interval = 1,
  particularDate = [],
  selectedDays = [],
  onIntervalChange,
  onParticularDateChange,
  onSelectedDaysChange,
  errors = [],
  showError = false,
  startAt,
  endAt,
}) => {
  const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
  const hasError = showError && errors.length > 0;

  // TakingCycleDetails 디버깅 코드
  console.log("TakingCycleDetails - errors:", errors);
  console.log("TakingCycleDetails - showError:", showError);
  console.log("TakingCycleDetails - hasError:", hasError);

  const renderSpecificInterval = () => (
    <View>
      <View style={styles.detailContainer}>
        <View style={styles.intervalContainer}>
          <Text style={styles.detailTitle}>첫 복용일부터</Text>
          <NumberInput
            title=""
            description=""
            value={interval}
            unit="일"
            min={1}
            max={365}
            step={1}
            onValueChange={(value) => onIntervalChange?.(value)}
            compact={true}
          />
          <Text style={styles.detailTitle}>간격으로 복용</Text>
        </View>
      </View>
      {hasError && (
        <Text
          style={{
            color: colors.RED,
            textAlign: "center",
            padding: 2,
          }}
        >
          {errors.join(", ")}
        </Text>
      )}
    </View>
  );

  const renderSpecificDay = () => (
    <View style={styles.detailContainer}>
      <View style={styles.weekdayContainer}>
        {WEEKDAYS.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.weekdayButton,
                isSelected && styles.selectedWeekday,
              ]}
              onPress={() => {
                const newDays = isSelected
                  ? selectedDays.filter((d) => d !== day)
                  : [...selectedDays, day];
                onSelectedDaysChange?.(newDays);
              }}
            >
              <Text
                style={[
                  styles.weekdayText,
                  isSelected && styles.selectedWeekdayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {hasError && (
        <Text
          style={{
            color: colors.RED,
            marginTop: 15,
          }}
        >
          {errors.join(", ")}
        </Text>
      )}
    </View>
  );

  const renderSpecificDate = () => (
    <View style={styles.dateContainer}>
      {hasError && (
        <Text
          style={{
            color: colors.RED,
            textAlign: "center",
            paddingTop: 10,
            paddingBottom: 5,
          }}
        >
          {errors.join(", ")}
        </Text>
      )}
      <SpecificDate
        dates={particularDate}
        onChange={(dates) => onParticularDateChange?.(dates)}
        startAt={startAt}
        endAt={endAt}
      />
    </View>
  );

  const renderDetails = () => {
    switch (takingType) {
      case TakingType.SPECIFIC_INTERVAL:
        return renderSpecificInterval();
      case TakingType.SPECIFIC_DAY:
        return renderSpecificDay();
      case TakingType.SPECIFIC_DATE:
        return renderSpecificDate();
      case TakingType.NEED:
        return null;
      default:
        return null;
    }
  };

  return <>{renderDetails()}</>;
};

export default TakingCycleDetails;

const styles = StyleSheet.create({
  detailContainer: {
    padding: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.BLACK,
  },
  intervalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  intervalButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },
  intervalButtonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  intervalText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.BLACK,
    minWidth: 60,
    textAlign: "center",
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  weekdayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  weekdayButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY,
  },
  selectedWeekday: {
    backgroundColor: colors.PINK + "60",
    borderColor: colors.PINK,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.BLACK,
  },
  selectedWeekdayText: {},
  dateContainer: {},
});
