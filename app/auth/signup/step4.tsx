import { useSignupContext } from "@/context/SignupContext";
import { SignupFormValues } from "@/types/auth";
import { useForm } from "react-hook-form";

export default function Step4Screen() {
  const { updateSignupData } = useSignupContext();

  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      allergy: undefined,
      disease: undefined,
    },
  });
  return;
}
