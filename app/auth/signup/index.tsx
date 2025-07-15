import Button from "@/components/Button";
import EmailInput from "@/components/Input/EmailInput";
import PasswordConfirmInput from "@/components/Input/PasswordConfirmInput";
import PasswordInput from "@/components/Input/PasswordInput";
import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function SignupScreen() {
  const { updateSignupData } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: "test@test.com",
      password: "12345678",
      passwordConfirm: "12345678",
    },
  });

  const onSubmit = (formValues: SignupFormValues) => {
    updateSignupData({
      email: formValues.email,
      password: formValues.password,
      passwordConfirm: formValues.passwordConfirm,
    });

    router.push("/auth/signup/step2");
  };

  return (
    <FormProvider {...signupForm}>
      <View>
        <EmailInput />
        <PasswordInput />
        <PasswordConfirmInput />
      </View>
      <View style={styles.Button}>
        <Button text="계속" onPress={signupForm.handleSubmit(onSubmit)} />
      </View>
    </FormProvider>
  );
}
const styles = StyleSheet.create({
  Button: {
    marginTop: 25,
    marginHorizontal: 15,
  },
});
