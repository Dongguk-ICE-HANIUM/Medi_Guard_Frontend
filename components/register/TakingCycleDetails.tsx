import { colors } from "@/constants";
import { TakingType } from "@/types/medication";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NumberInput from "./NumberInput";

interface TakingCycleDetailsProps {
  takingType: TakingType;
  interval?: number;
  particularDate?: string[];
  onIntervalChange?: (interval: number) => void;
  onParticularDateChange?: (dates: string[]) => void;
}

const TakingCycleDetails: React.FC<TakingCycleDetailsProps> = ({
  takingType,
  interval = 1,
  particularDate = [],
  onIntervalChange,
  onParticularDateChange,
}) => {
  const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

  const renderSpecificInterval = () => (
    <View style={styles.detailContainer}>
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
  );

  const renderSpecificDay = () => (
    <View style={styles.detailContainer}>
      <View style={styles.weekdayContainer}>
        {WEEKDAYS.map((day) => {
          const isSelected = particularDate.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.weekdayButton,
                isSelected && styles.selectedWeekday,
              ]}
              onPress={() => {
                const newDates = isSelected
                  ? particularDate.filter((d) => d !== day)
                  : [...particularDate, day];
                onParticularDateChange?.(newDates);
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
    </View>
  );

  const renderSpecificDate = () => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>
        특정 날짜 선택 기능은 캘린더에서 설정할 수 있습니다.
      </Text>
    </View>
  );

  const renderNeed = () => (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>필요할 때마다 복용하시면 됩니다.</Text>
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
        return renderNeed();
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
    flexDirection: "row",
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
    borderColor: colors.BLACK,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.BLACK,
  },
  selectedWeekdayText: {},
});
