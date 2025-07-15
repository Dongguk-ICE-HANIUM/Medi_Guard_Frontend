import { SignupFormValues } from "@/types/auth";
import React, { createContext, ReactNode, useContext, useState } from "react";
type SignupContextType = {
  signupData: Partial<SignupFormValues>;
  updateSignupData: (data: Partial<SignupFormValues>) => void;
  resetSignupData: () => void;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [signupData, setSignupData] = useState<Partial<SignupFormValues>>({});

  const updateSignupData = (data: Partial<SignupFormValues>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
  };

  const resetSignupData = () => {
    setSignupData({});
  };

  return (
    <SignupContext.Provider
      value={{ signupData, updateSignupData, resetSignupData }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignupContext() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignupContext must be used within SignupProvider");
  }
  return context;
}

export default SignupContext;
