import { colors } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

export const ResultSection: React.FC<{
  title: string;
  items: string[];
}> = ({ title, items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {items.map((item, index) => (
        <Text key={index} style={styles.sectionItem}>
          {item}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.BLACK,
    marginRight: 16,
    minWidth: 80,
    lineHeight: 22,
    paddingTop: 12,
  },
  sectionContent: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionItem: {
    fontSize: 15,
    color: colors.BLACK,
    lineHeight: 22,
    flexWrap: "wrap",
  },
});
