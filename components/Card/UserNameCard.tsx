import { colors } from "@/constants";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { StyleSheet, Text, View } from "react-native";

interface userNameCardProps {
  name: string;
}

export default function UserNameCard({ name }: userNameCardProps) {
  return (
    <View style={styles.userNameCard}>
      <EvilIcons
        name="heart"
        size={20}
        color={colors.PINK}
        style={styles.Icon}
      />
      <Text style={styles.textTitle}>
        <Text style={styles.textDate}>{dayjs().format("M월 DD일")}</Text>
        <Text style={styles.textUserName}> {name}</Text>님의 건강현황
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userNameCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.WHITE,
    padding: 15,
    alignItems: "center",
  },
  Icon: {},
  textTitle: {
    fontWeight: "500",
    fontSize: 16,
    marginTop: 1,
  },
  textDate: {
    fontSize: 16,
  },
  textUserName: {
    padding: 3,
    fontSize: 16,
    fontWeight: "800",
  },
});
