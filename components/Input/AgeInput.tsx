import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function AgeInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name="age"
      control={control}
      rules={{
        validate: (data: number) => {
          if (data === undefined || 0) return "필수 입력 항목";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="나이"
          placeholder="나이"
          inputMode="numeric"
          value={value?.toString() || ""}
          onChangeText={onChange}
          onFocus={() => {
            onChange(undefined);
          }}
          onBlur={() => {
            if (value) onChange(value + "세");
          }}
          error={error?.message}
          size="small"
        />
      )}
    />
  );
}

export default AgeInput;
