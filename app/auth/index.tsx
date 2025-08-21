import { kakaoSocialLogin } from "@/api/socialLogin";
import Button from "@/components/Button";
import { colors } from "@/constants";
import { saveSecureStore } from "@/utils/secureStore";
import { getProfile, login } from "@react-native-seoul/kakao-login";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainLoginScreen() {
  const onKakaoLogin = async () => {
    try {
      // 1. 카카오 SDK 로그인
      const kakaoToken = await login();

      // 2. 카카오 사용자 정보 가져오기
      const kakaoUser = await getProfile();
      console.log("카카오사용자: ", kakaoUser);

      //3. 백엔드에 카카오 토큰 전송
      const loginResponse = await kakaoSocialLogin(kakaoToken.accessToken);

      if (
        loginResponse.errorCode === null &&
        loginResponse.result &&
        loginResponse.result.accessToken &&
        loginResponse.result.refreshToken
      ) {
        // 4. 최초로그인은 추가 정보 입력 화면으로 이동
        if (loginResponse.result!.isNewUser) {
          router.push({
            pathname: "/auth/signup/step2",
            params: {
              isSocialSignup: "true",
              bearerToken: loginResponse.result!.accessToken,
              userId: kakaoUser.id.toString(),
            },
          });
        } else {
          // 4. 기존사용자는 토큰 저장하고 홈으로
          await saveSecureStore(
            "accessToken",
            loginResponse.result.accessToken
          );
          await saveSecureStore(
            "refreshToken",
            loginResponse.result.refreshToken
          );
          router.replace("/");
          alert("로그인이 완료되었습니다!");
        }
      }
    } catch (error) {
      console.log("카카오 로그인 에러:", error);
    }
  };
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
      <View style={styles.socialLoginButton}>
        <TouchableOpacity style={styles.kakaoButton} onPress={onKakaoLogin}>
          <Image
            source={require("../../assets/images/kakao_icon.png")}
            style={{ width: 18, height: 18 }}
            resizeMode="contain"
          />
          <Text style={styles.kakaoButtonText}>카카오로 로그인하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>구글로 로그인하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Button: {
    gap: 15,
    padding: 10,
  },
  socialLoginButton: {
    paddingHorizontal: 10,
    marginTop: 150,
    gap: 15,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
    borderRadius: 16,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  kakaoButtonText: {
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: colors.BLACK,
    borderRadius: 16,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  googleButtonText: {
    textAlign: "center",
    color: colors.WHITE,
  },
});
