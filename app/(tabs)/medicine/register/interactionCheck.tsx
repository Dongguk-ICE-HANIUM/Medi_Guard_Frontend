import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const interactionCheck = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    medicationData?: string;
  }>();

  const handeleConfirm = () => {
    if (params.medicationData) {
      // 약물 데이터를 confirm.tsx로 전달
      router.push({
        pathname: "/medicine/register/confirm",
        params: { medicationData: params.medicationData },
      });
    } else {
      // 약물 데이터가 없으면 기본 confirm 화면으로
      router.push("/medicine/register/confirm");
    }
  };

  return (
    <View>
      <Text>약물 상호작용 위험 알림</Text>
      <Button text="다음" onPress={handeleConfirm} />
    </View>
  );
};

export default interactionCheck;
