import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function BirthdayInput() {
  const { control } = useFormContext();

  const formatBirthday = (text: string) => {
    if (text.length === 4) return text + "-";
    else if (text.length === 7) return text + "-";
    else return text;
  };

  return (
    <Controller
      name="birthday"
      control={control}
      rules={{
        validate: (data: number) => {
          if (String(data).length === 0) return "필수 입력 항목";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="생년월일"
          placeholder="년도 - 월 - 일"
          inputMode="numeric"
          value={value}
          onChangeText={(text) => {
            const formatted = formatBirthday(text);
            onChange(formatted);
          }}
          onFocus={() => {
            onChange("");
          }}
          error={error?.message}
          maxLength={10}
          size="small"
        />
      )}
    />
  );
}

export default BirthdayInput;
