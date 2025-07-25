import { signup } from "@/api/auth";
import AllergyList from "@/components/AllergyList";
import Button from "@/components/Button";
import DiseaseList from "@/components/DiseaseList";
import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { router } from "expo-router";
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

  const onSubmit = async (formValues: SignupFormValues) => {
    try {
      updateSignupData({
        allergy: formValues.allergy,
        disease: formValues.disease,
      });
      const completeSignupData = {
        ...signupData, // Step 1~3 데이터
        allergy: formValues.allergy, // Step 4 알레르기 데이터
        disease: formValues.disease, // Step 4 질병 데이터
      } as SignupFormValues;
      console.log(completeSignupData);

      // 회원가입 API호출
      const response = await signup(completeSignupData);
      console.log("회원가입 성공:", response);

      // 토큰저장

      // 홈 이동
      alert("회원가입이 완료되었습니다!");
      router.push("/?signup=success");
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
