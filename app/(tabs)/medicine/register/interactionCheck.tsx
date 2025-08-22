import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const interactionCheck = () => {
  const router = useRouter();

  const handeleConfirm = () => {
    router.push("/(tabs)/medicine/register/confirm");
  };
  return (
    <View>
      <Text>약물 상호작용 위험 알림</Text>
      <Button text="다음" onPress={handeleConfirm} />
    </View>
  );
};

export default interactionCheck;
