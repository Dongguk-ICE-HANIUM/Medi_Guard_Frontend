import { StyleSheet, View } from "react-native";
import DueDateCard from "./DueDateCard";
import PregnancyCard from "./PregnancyCard";
import UserNameCard from "./UserNameCard";

export default function UserInfoCard() {
  return (
    <View style={styles.userInfoCard}>
      <UserNameCard name="송민교" />
      <View style={styles.body}>
        <DueDateCard />
        <PregnancyCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfoCard: {
    gap: 10,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
