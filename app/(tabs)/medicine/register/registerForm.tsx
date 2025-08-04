import RegisterInfo from "@/components/register/RegisterInfo";
import { Medication } from "@/types/medication";
import React from "react";
import { View } from "react-native";

const registerForm = () => {
  const selectedMedicine = { id: "123", name: "우루사정" };

  //테스트
  const handleSubmit = (medication: Medication) => {
    console.log("제출된 약물 정보: ", medication);
  };

  return (
    <View style={{ flex: 1 }}>
      <RegisterInfo selected={selectedMedicine} onSubmit={handleSubmit} />
    </View>
  );
};

export default registerForm;
