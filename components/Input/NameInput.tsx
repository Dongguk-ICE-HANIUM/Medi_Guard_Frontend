import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function NameInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) return "필수 입력 항목";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          autoFocus
          label="이름"
          placeholder="이름을 입력해주세요."
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}

export default NameInput;
