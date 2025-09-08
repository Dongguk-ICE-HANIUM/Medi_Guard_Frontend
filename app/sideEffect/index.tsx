import Input from "@/components/Input/Input";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function SideEffectScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="add"
          size={24}
          color="black"
          style={{ marginRight: 12 }}
          onPress={() => console.log("버튼눌림")}
        />
      ),
    });
  }, [navigation]);
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Input
          placeholder="검색어를 입력해주세요"
          size="auto"
          variant="icon"
          iconName="calendar-outline"
          style={{ flex: 1 }}
        />
      </View>
      <View></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5,
    marginVertical: 10,
  },
});
