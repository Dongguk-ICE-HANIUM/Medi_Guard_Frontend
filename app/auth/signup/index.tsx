import Button from "@/components/Button";
import EmailInput from "@/components/Input/EmailInput";
import PasswordConfirmInput from "@/components/Input/PasswordConfirmInput";
import PasswordInput from "@/components/Input/PasswordInput";
import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SignupScreen() {
  const { updateSignupData, isEmailVerified } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: "test@test.com",
      password: "12345678",
      passwordConfirm: "12345678",
      name: "",
      birthday: "",
      height: 0,
      weight: 0,
      feeding: false,
      pregnant: 0,
      dueDate: "",
      allergy: null,
      disease: null,
    },
  });

  const onSubmit = (formValues: SignupFormValues) => {
    if (!isEmailVerified) {
      Toast.show({
        type: "error",
        text1: "알림",
        text2: "이메일 중복확인을 해주세요",
      });
      return;
    }
    updateSignupData({
      email: formValues.email,
      password: formValues.password,
      passwordConfirm: formValues.passwordConfirm,
    });

    router.push("/auth/signup/step2");
  };

  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...signupForm}>
        <View>
          <EmailInput />
          <PasswordInput />
          <PasswordConfirmInput />
        </View>
        <View style={styles.Button}>
          <Button text="계속하기" onPress={signupForm.handleSubmit(onSubmit)} />
        </View>
      </FormProvider>

      <Toast />
    </View>
  );
}
const styles = StyleSheet.create({
  Button: {
    marginTop: 25,
    marginHorizontal: 15,
  },
});
