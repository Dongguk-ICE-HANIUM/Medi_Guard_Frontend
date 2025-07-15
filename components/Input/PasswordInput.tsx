import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";
function PasswordInput() {
  const { control } = useFormContext();
  const [isPwVisible, setIsPwVisible] = useState(false);

  return (
    <Controller
      name="password"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length < 8) return "비밀번호는 8자 이상 입력해주세요";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={value}
          variant="icon"
          iconName={isPwVisible ? "eye-outline" : "eye-off-outline"}
          onChangeText={onChange}
          secureTextEntry={!isPwVisible}
          onIconPress={() => {
            setIsPwVisible(!isPwVisible);
          }}
          error={error?.message}
        />
      )}
    />
  );
}

export default PasswordInput;
