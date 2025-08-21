import AllergyList from "@/components/AllergyList";
import Button from "@/components/Button";
import DiseaseList from "@/components/DiseaseList";
import { useSignupContext } from "@/context/SignupContext";
import useAuth from "@/hooks/queries/useAuth";
import { SignupRequest } from "@/types/api";
import { SignupFormValues } from "@/types/auth";
import { SocialLoginRequest } from "@/types/social";
import { useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Step4Screen() {
  const { updateSignupData, signupData } = useSignupContext();
  const { signupMutation, socialLoginMutation } = useAuth();

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
      allergyList: signupData.allergyList,
      diseaseList: signupData.diseaseList,
    },
  });

  const { isSocialSignup, bearerToken, userId } = useLocalSearchParams();
  const onSubmit = async (formValues: SignupFormValues) => {
    updateSignupData({
      allergyList: formValues.allergyList,
      diseaseList: formValues.diseaseList,
    });

    const completeSignupData = {
      ...signupData,
      allergyList: formValues.allergyList,
      diseaseList: formValues.diseaseList,
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
        allergyList: completeSignupData.allergyList,
        diseaseList: completeSignupData.diseaseList,
      };

      socialLoginMutation.mutate(socialData);
    } else {
      // 회원가입요청
      const nomarlSignupData: SignupRequest = {
        email: completeSignupData.email,
        password: completeSignupData.password,
        name: completeSignupData.name,
        birthday: completeSignupData.birthday,
        height: completeSignupData.height,
        weight: completeSignupData.weight,
        dueDate: completeSignupData.dueDate,
        pregnancyWeek: completeSignupData.pregnant,
        feeding: completeSignupData.feeding,
      };
      signupMutation.mutate(nomarlSignupData);
      console.log("회원가입 요청 body:", nomarlSignupData);
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
