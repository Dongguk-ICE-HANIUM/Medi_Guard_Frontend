import React from "react";
import { StyleSheet, View } from "react-native";
import NumberInput from "./NumberInput";

interface PerAOnceProps {
  perDay: number;
  amount: number;
  onPerDayChange: (value: number) => void;
  onAmountChange: (value: number) => void;
}

const PerAOnce = ({
  perDay,
  amount,
  onPerDayChange,
  onAmountChange,
}: PerAOnceProps) => {
  return (
    <View style={styles.container}>
      <NumberInput
        title="1일 복약 횟수"
        description="하루에 복용할 횟수를 선택해주세요"
        value={perDay}
        unit="회"
        min={1}
        max={10}
        step={1}
        onValueChange={onPerDayChange}
      />
      <NumberInput
        title="1회 복용량"
        description="한번에 복용할 양을 선택해주세요"
        value={amount}
        unit="정"
        min={0.25}
        max={10}
        step={0.25}
        onValueChange={onAmountChange}
      />
    </View>
  );
};

export default PerAOnce;

const styles = StyleSheet.create({
  container: {},
});
