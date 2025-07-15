import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function WeightInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="weight"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="몸무게"
          placeholder="몸무게"
          inputMode="numeric"
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            if (value) onChange(value + "kg");
          }}
          error={error?.message}
          size="small"
        />
      )}
    />
  );
}

export default WeightInput;
