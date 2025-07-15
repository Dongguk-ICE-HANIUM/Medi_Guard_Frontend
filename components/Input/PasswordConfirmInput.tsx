import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function PasswordConfirmInput() {
  const { control, watch } = useFormContext();
  const [isConfirmPwVisible, setIsConfrimPwVisible] = useState(false);

  return (
    <Controller
      name="passwordConfirm"
      control={control}
      rules={{
        validate: (data: string) => {
          const password = watch("password");
          return password === data || "비밀번호가 일치하지 않습니다.";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요."
          value={value}
          variant="icon"
          iconName={isConfirmPwVisible ? "eye-outline" : "eye-off-outline"}
          secureTextEntry={!isConfirmPwVisible}
          onChangeText={onChange}
          onIconPress={() => {
            setIsConfrimPwVisible(!isConfirmPwVisible);
          }}
          error={error?.message}
        />
      )}
    />
  );
}

export default PasswordConfirmInput;
