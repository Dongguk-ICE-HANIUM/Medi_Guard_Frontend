import { checkEmailDuplicate } from "@/api/auth";
import { colors } from "@/constants";
import { useSignupContext } from "@/context/SignupContext";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Input from "./Input";

function EmailInput() {
  const { control, getValues, setError, clearErrors } = useFormContext();
  const [isSuccess, setIsSuccess] = useState(false);
  //
  const { setEmailVerified } = useSignupContext();

  const duplicationCheck = async () => {
    const email = getValues("email");
    if (!email) {
      setError("email", { message: "이메일을 입력해주세요." });
      return;
    }

    try {
      setIsSuccess(false);
      const response = await checkEmailDuplicate(email);

      if (response.errorCode === null) {
        setIsSuccess(true);
        setEmailVerified(true);
        clearErrors("email");
      } else {
        setIsSuccess(false);
        setEmailVerified(false);

        // 에러 타입별 구체적 메시지
        let errorMessage = response.message;
        if (response.errorCode === "NETWORK_ERROR") {
          errorMessage = "네트워크 연결을 확인해주세요";
        } else if (response.errorCode === "SERVER_ERROR") {
          errorMessage = "서버 오류입니다. 잠시 후 다시 시도해주세요";
        }

        setError("email", {
          type: "duplicate",
          message: errorMessage,
        });
      }
    } catch (error: any) {
      // 최후의 안전장치
      console.error("예상치 못한 에러:", error);
      setIsSuccess(false);
      setEmailVerified(false);
      setError("email", {
        type: "unknown",
        message: "이메일 확인 중 오류가 발생했습니다",
      });
    }
  };
  return (
    <View>
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
            variant="icon"
            iconName={isSuccess ? "checkmark" : error ? "close" : "checkmark"}
            iconColor={isSuccess ? "green" : error ? "red" : undefined}
            label="이메일"
            placeholder="이메일을 입력해주세요."
            returnKeyType="next"
            inputMode="email"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              setIsSuccess(false);
              setEmailVerified(false);
            }}
            onIconPress={duplicationCheck}
            error={error?.message}
          />
        )}
      />
      {isSuccess && (
        <Text style={styles.successText}>사용 가능한 이메일입니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  successText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 25,
    color: colors.GREEN,
  },
});
export default EmailInput;
