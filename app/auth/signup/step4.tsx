import { signup } from "@/api/signup";
import { submitSocialLogin } from "@/api/socialLogin";
import AllergyList from "@/components/AllergyList";
import Button from "@/components/Button";
import DiseaseList from "@/components/DiseaseList";
import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { SocialLoginRequest } from "@/types/social";
import { saveSecureStore } from "@/utils/secureStore";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Step4Screen() {
  const { updateSignupData, signupData } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: signupData.email,
      password: signupData.password,
      name: signupData.name,
      birthday: signupData.birthday,
      height: signupData.height,
      weight: signupData.weight,
      feeding: signupData.feeding,
      pregnant: signupData.pregnant,
      dueDate: signupData.dueDate,
      allergy: signupData.allergy,
      disease: signupData.disease,
    },
  });

  const { isSocialSignup, bearerToken, userId } = useLocalSearchParams();
  const onSubmit = async (formValues: SignupFormValues) => {
    try {
      updateSignupData({
        allergy: formValues.allergy,
        disease: formValues.disease,
      });

      const completeSignupData = {
        ...signupData,
        allergy: formValues.allergy,
        disease: formValues.disease,
      } as SignupFormValues;

      if (isSocialSignup === "true") {
        const socialData: SocialLoginRequest = {
          name: completeSignupData.name,
          birthday: completeSignupData.birthday,
          height: completeSignupData.height,
          weight: completeSignupData.weight,
          feeding: completeSignupData.feeding,
          pregnant: completeSignupData.pregnant,
          dueDate: completeSignupData.dueDate,
          allergy: completeSignupData.allergy,
          disease: completeSignupData.disease,
        };

        const response = await submitSocialLogin(
          userId as string,
          socialData,
          bearerToken as string
        );

        if (response.errorCode === null) {
          await saveSecureStore("accessToken", response.result!.accessToken);
          await saveSecureStore("refreshToken", response.result!.refreshToken);
          alert("가입이 완료되었습니다!");
          router.replace("/");
        }
      } else {
        // 회원가입 API호출
        const response = await signup(completeSignupData);
        console.log("회원가입 성공:", response);

        // 홈 이동
        alert("회원가입이 완료되었습니다!");
        router.push("/?signup=success");
      }
    } catch (error: any) {
      console.error("회원가입 실패: ", error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...signupForm}>
        <AllergyList />
        <DiseaseList />
        <View style={styles.button}>
          <Button
            text="회원가입 하기"
            onPress={signupForm.handleSubmit(onSubmit)}
          />
        </View>
      </FormProvider>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 25,
    marginHorizontal: 15,
  },
});
