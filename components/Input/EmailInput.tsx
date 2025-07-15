import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function EmailInput() {
  const { control } = useFormContext();
  return (
    <Controller
      name="email"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) return "이메일을 입력해주세요.";
          if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data))
            return "올바른 이메일 형식이 아닙니다";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          autoFocus
          label="이메일"
          placeholder="이메일을 입력해주세요."
          returnKeyType="next"
          inputMode="email"
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}

export default EmailInput;
