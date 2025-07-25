import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function PregnantInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name="pregnant"
      control={control}
      rules={{
        required: "필수 입력 항목",
        validate: (data: number) => {
          const num = Number(data);
          if (isNaN(num) || num <= 0) return "잘못된 임신주차";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="임신주차"
          placeholder="임신주차"
          inputMode="numeric"
          value={value?.toString() || ""}
          onChangeText={onChange}
          onFocus={() => {
            onChange(""); // 포커스 시 입력 필드 지우기
          }}
          // onBlur={() => {
          //   if (value) onChange(value + "주차");
          // }}
          error={error?.message}
          size="small"
        />
      )}
    />
  );
}

export default PregnantInput;
