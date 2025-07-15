import Button from "@/components/Button";
import AgeInput from "@/components/Input/AgeInput";
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
  const { updateSignupData } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      name: "송민교", //"",
      age: 22,
      birthday: "2004-12-16", //"",
      height: undefined,
      weight: undefined,
      feeding: undefined,
      pregnant: 7, //undefined,
      dueDate: "2025-08-29", //"",
    },
  });

  const onSubmit = (formValues: SignupFormValues) => {
    updateSignupData({
      name: formValues.name,
      age: formValues.age,
      birthday: formValues.birthday,
      height: formValues.height,
      weight: formValues.weight,
      feeding: formValues.feeding,
      dueDate: formValues.dueDate,
    });

    router.push("/auth/signup/step3");
  };
  return (
    <FormProvider {...signupForm}>
      <View>
        <NameInput />
        <View style={styles.input1}>
          <AgeInput />
          <BirthdayInput />
        </View>
        <View style={styles.input2}>
          <HeightInput />
          <WeightInput />
        </View>
        <View style={styles.input3}>
          <PregnantInput />
          <FeedingInput />
        </View>
        <DueDateInput />
      </View>
      <View style={styles.button}>
        <Button
          text="계속하기"
          color="gray"
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
    marginTop: 25,
    marginHorizontal: 15,
  },
});
