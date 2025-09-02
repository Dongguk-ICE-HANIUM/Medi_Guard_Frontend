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
      "본 앱은 회원 가입, 진료 예약, 맞춤 건강 관리 서비스를 제공하기 위해 최소한의 개인정보를 수집·이용합니다.\n" +
      "수집되는 항목에는 이름, 연락처, 생년월일, 진료 기록 등이 포함될 수 있습니다.\n" +
      "해당 정보는 서비스 운영 목적 외에는 사용되지 않으며, 관련 법령에 따라 안전하게 관리·보관됩니다.\n" +
      "사용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.",
  },
  {
    id: 2,
    title: "개인정보수집 동의",
    required: true,
    content:
      "임신 주차, 산전검사 이력, 복용 약물 정보 등 건강과 직결된 민감정보를 수집·활용할 수 있습니다.\n" +
      "이 정보는 임산부 맞춤형 건강 가이드, 복용 알림, 진료 연계 등 서비스 고도화를 위해 사용됩니다.\n" +
      "모든 민감정보는 암호화되어 보관되며, 법적 근거 또는 본인의 동의 없이 제3자에게 제공되지 않습니다.\n" +
      "민감정보 제공에 동의하지 않으시면 일부 맞춤형 서비스 이용에 제한이 있을 수 있습니다.",
  },
  {
    id: 3,
    title: "개인정보수집 동의",
    required: true,
    content:
      "본 앱에서 제공하는 건강 정보 및 콘텐츠는 참고용으로 제공되며, 전문 의료인의 진단이나 처방을 대체하지 않습니다.\n" +
      "사용자는 앱에서 제공되는 알림, 복용 기록, 건강 관리 기능이 보조적 성격임을 충분히 이해해야 합니다.\n" +
      "진료, 약물 복용, 건강 관리에 관한 최종적인 판단은 반드시 의료 전문가와의 상담을 통해 이루어져야 합니다.\n" +
      "본 서비스를 이용함으로써 사용자는 위 내용에 동의한 것으로 간주됩니다.",
  },
  {
    id: 4,
    title: "마케딩 및 정보수집 동의",
    required: false,
    content:
      "앱에서는 임산부를 위한 건강 관리 정보, 의료 관련 이벤트, 할인 혜택 등의 소식을 제공할 수 있습니다.\n" +
      "마케팅 및 알림 수신에 동의할 경우 이메일, 앱 알림, 문자 메시지를 통해 정보를 받아보실 수 있습니다.\n" +
      "동의하지 않으셔도 서비스의 핵심 기능은 모두 정상적으로 이용하실 수 있습니다.\n" +
      "단, 이벤트 참여나 특별 혜택 안내를 받지 못할 수 있습니다.",
  },
];

export default function Step3Screen() {
  // Record는 key-value
  const [agreements, setAgreements] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });
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
