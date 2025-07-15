import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import { router, useFocusEffect } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  // 일단 무조건 로그인화면으로
  useFocusEffect(() => {
    router.replace("/auth");
  });
  return (
    <SafeAreaView>
      <Text>내페이지 스크린</Text>
      <Button text={"버튼이애요"} color={"pink"} size={"small"} />
      <Input label={"민교"} placeholder="민교애요" error="에러애요" />
    </SafeAreaView>
  );
}
