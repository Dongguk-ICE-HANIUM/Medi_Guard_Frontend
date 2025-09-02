import CalendarCard from "@/components/Card/CalendarCard";
import NextTreatCard from "@/components/Card/NextTreatCard";
import UserInfoCard from "@/components/Card/UserInfoCard";
import { MedicineProvider } from "@/context/MedicineContext";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const signupSuccess = searchParams.get("signup");
    if (signupSuccess === "success") {
      Toast.show({
        type: "success",
        text1: "알림",
        text2: "회원가입이 완료되었습니다.",
      });

      router.replace("/auth");
    }
  }, [searchParams, router]);

  return (
    <ScrollView bounces={true}>
      <MedicineProvider>
        <View style={{ flex: 1 }}>
          <SafeAreaView>
            <UserInfoCard />
            <NextTreatCard />
            <CalendarCard />
          </SafeAreaView>
          <Toast />
        </View>
      </MedicineProvider>
    </ScrollView>
  );
}
