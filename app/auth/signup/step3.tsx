import Button from "@/components/Button";
import { colors } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AgreementItem {
  id: number;
  title: string;
  required: boolean;
  content: string;
}
const items: AgreementItem[] = [
  {
    id: 1,
    title: "개인정보수집 동의",
    required: true,
    content:
      "개인정보 수집 및 이용에 대한 동의 ~개인정보 수집 및 이용에 대한 동의 ~개인정보 수집 및 이용에 대한 동의 ~개인정보 수집 및 이용에 대한 동의 ~",
  },
  {
    id: 2,
    title: "개인정보수집 동의",
    required: true,
    content: "두번째 개인정보 수집 및 이용에 대한 동의 ~",
  },
  {
    id: 3,
    title: "개인정보수집 동의",
    required: true,
    content: "세번째 개인정보 수집 및 이용에 대한 동의 ~",
  },
  {
    id: 4,
    title: "마케딩 및 정보수집 동의",
    required: false,
    content: "세번째 개인정보 수집 및 이용에 대한 동의 ~",
  },
];

export default function Step3Screen() {
  // Record는 key-value
  const [agreements, setAgreements] = useState<Record<number, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const agreeCheck = () => {
    return items
      .filter((item) => item.required)
      .every((item) => agreements[item.id] === true);
  };

  const onSubmit = () => {
    if (!agreeCheck()) {
      Alert.alert("약관 동의", "모든 약관에 동의해주세요.");
      return;
    }

    router.push("/auth/signup/step4");
  };

  const setAgreement = (id: number) => {
    setAgreements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const setDisagreement = (id: number) => {
    setAgreements((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      {items.map((item: AgreementItem, index: number) => (
        <View key={item.id} style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.header}
            onPress={() => toggleExpanded(item.id)}
          >
            <Text style={styles.itemNumber}>{index + 1}. </Text>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.expandIcon}>
              {expandedItems[item.id] ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>
          {expandedItems[item.id] && (
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>{item.content}</Text>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgreement(item.id)}
              >
                <View style={styles.checkboxInner}>
                  {agreements[item.id] && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.agreeText}>동의함</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setDisagreement(item.id)}
              >
                <View style={styles.checkboxInner}>
                  {!agreements[item.id] && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.agreeText}>동의하지 않음</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <Button text="계속하기" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 10,
    backgroundColor: colors.WHITE,
    borderRadius: 24,
  },
  itemContainer: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: colors.LIGHT_GRAY,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  itemNumber: {
    fontSize: 16,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    flex: 1,
  },
  expandIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 3,
  },
  checkmark: {
    fontSize: 10,
    fontWeight: "bold",
  },
  agreeText: {
    fontSize: 14,
  },
  contentContainer: {
    padding: 15,
    paddingTop: 0,
  },
  contentText: {
    fontSize: 14,
    marginLeft: 27,
  },
});
