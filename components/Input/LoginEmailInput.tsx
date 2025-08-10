import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function LoginEmailInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="email"
      control={control}
      rules={{
        required: "이메일을 입력해주세요.",
        pattern: {
          value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          message: "올바른 이메일 형식이 아닙니다.",
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="이메일"
          placeholder="이메일을 입력해주세요."
          inputMode="email"
          value={value}
          onChangeText={onChange}
          error={error?.message}
        />
      )}
    />
  );
}

export default LoginEmailInput;
