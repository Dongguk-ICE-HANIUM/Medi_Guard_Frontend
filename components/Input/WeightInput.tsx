import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function WeightInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="weight"
      control={control}
      rules={{
        validate: (weight: number) => {
          if (weight < 30 || weight > 200) return "다시 입력해주세요";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="몸무게"
          placeholder="몸무게"
          inputMode="numeric"
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            if (value) onChange(value);
          }}
          error={error?.message}
          size="small"
        />
      )}
    />
  );
}

export default WeightInput;
