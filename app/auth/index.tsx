import Button from "@/components/Button";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicineScreen() {
  return (
    <SafeAreaView>
      <Text>로그인 스크린</Text>
      <View style={styles.Button}>
        <Button text="로그인하기" onPress={() => router.push("/auth/login")} />
        <Button
          text="회원가입 하기"
          color="gray"
          onPress={() => router.push("/auth/signup")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Button: {
    gap: 15,
    padding: 10,
  },
});
