import Button from "@/components/Button";
import BirthdayInput from "@/components/Input/BirthdayInput";
import DueDateInput from "@/components/Input/DueDateInput";
import FeedingInput from "@/components/Input/FeedingInput";
import HeightInput from "@/components/Input/HeightInput";
import NameInput from "@/components/Input/NameInput";
import PregnantInput from "@/components/Input/PregnantInput";
import WeightInput from "@/components/Input/WeightInput";
import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function Step2Screen() {
  const { updateSignupData, signupData } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      email: signupData.email,
      password: signupData.password,
      name: "송민교", //"",
      birthday: "2004-12-16", //"",
      height: signupData.height,
      weight: signupData.weight,
      feeding: signupData.feeding,
      pregnant: 7, //undefined,
      dueDate: "2025-08-29", //"",
      allergy: signupData.allergy,
      disease: signupData.disease,
    },
  });

  const onSubmit = (formValues: SignupFormValues) => {
    updateSignupData(formValues);

    router.push("/auth/signup/step3");
  };
  return (
    <FormProvider {...signupForm}>
      <View>
        <NameInput />
        <View style={styles.input1}>
          <BirthdayInput />
          <DueDateInput />
        </View>
        <View style={styles.input2}>
          <HeightInput />
          <WeightInput />
        </View>
        <View style={styles.input3}>
          <PregnantInput />
          <FeedingInput />
        </View>
      </View>
      <View style={styles.button}>
        <Button
          text="계속하기"
          color="pink"
          onPress={signupForm.handleSubmit(onSubmit)}
        />
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  input1: {
    flexDirection: "row",
  },
  input2: {
    flexDirection: "row",
  },
  input3: {
    flexDirection: "row",
  },
  button: {
    marginTop: 55,
    marginHorizontal: 15,
  },
});
