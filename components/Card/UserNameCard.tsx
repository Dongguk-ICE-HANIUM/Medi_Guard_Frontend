import { colors } from "@/constants";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { StyleSheet, Text, View } from "react-native";

interface userNameCardProps {
  name: string;
  date?: Date;
}

export default function UserNameCard({ name, date }: userNameCardProps) {
  return (
    <View style={styles.userNameCard}>
      <View style={styles.content}>
        <EvilIcons
          name="heart"
          size={20}
          color={colors.PINK}
          style={styles.Icon}
        />
        <Text style={styles.textTitle}>
          <Text style={styles.textDate}>
            {date ? dayjs(date).format("M월 DD일") : dayjs().format("M월 DD일")}
          </Text>
          <Text style={styles.textUserName}> {name}</Text>님의 건강현황
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userNameCard: {
    justifyContent: "space-between",
    width: "95%",
    backgroundColor: colors.WHITE,
    padding: 15,
    borderRadius: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
