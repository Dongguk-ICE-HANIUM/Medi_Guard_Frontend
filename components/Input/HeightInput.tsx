import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function HeightInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name="height"
      control={control}
      rules={{
        validate: (height: number) => {
          if (height > 250 || height < 100) return "다시 입력해주세요";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="키"
          placeholder="키"
          inputMode="numeric"
          value={value}
          onChangeText={onChange}
          onBlur={() => {
            if (value) onChange(value);
          }}
          onFocus={() => {
            onChange("");
          }}
          error={error?.message}
          size="small"
        />
      )}
    />
  );
}

export default HeightInput;
