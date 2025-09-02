import { StyleSheet, View } from "react-native";
import DueDateCard from "./DueDateCard";
import PregnancyCard from "./PregnancyCard";
import UserNameCard from "./UserNameCard";

export default function UserInfoCard() {
  return (
    <View style={styles.userInfoCard}>
      <UserNameCard name="송민교" />
      <DueDateCard />
      <PregnancyCard />
    </View>
  );
}

const styles = StyleSheet.create({
  userInfoCard: {
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
