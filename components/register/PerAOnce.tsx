import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import NumberInput from "./NumberInput";

const PerAOnce = () => {
  const [perDay, setPerDay] = useState(1);
  const [amount, setAmount] = useState(1.0);

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
        onValueChange={setPerDay}
      />
      <NumberInput
        title="1회 복용량"
        description="한번에 복용할 양을 선택해주세요"
        value={amount}
        unit="정"
        min={0.25}
        max={10}
        step={0.25}
        onValueChange={setAmount}
      />
    </View>
  );
};

export default PerAOnce;

const styles = StyleSheet.create({
  container: {},
});
