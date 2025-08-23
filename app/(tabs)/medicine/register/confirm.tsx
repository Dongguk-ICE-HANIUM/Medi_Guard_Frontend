import Button from "@/components/Button";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const confirm = () => {
  const router = useRouter();
  const goMedicineHome = () => {
    router.replace("/(tabs)/medicine");
  };
  return (
    <View style={styles.wrap}>
      <View style={styles.body}>
        <Text style={styles.title}>복약 정보가 등록되었어요</Text>
        <Text style={styles.content}>
          등록된 복약 정보는 {"\n"}전체 복용약 보기에서 확인하실 수 있어요
        </Text>
      </View>
      <View style={styles.button}>
        <Button text="완료" onPress={goMedicineHome} />
      </View>
    </View>
  );
};

export default confirm;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
  },
  button: {
    marginBottom: 15,
  },
});
