import Button from "@/components/Button";
import TermsItem from "@/components/consultation/TermsItem";
import TermsModal from "@/components/consultation/TermsModal";
import { colors } from "@/constants";
import { TERMS_DATA, TermsDataType } from "@/data/termsData";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AgreementState {
  all: boolean;
  service: boolean;
  privacy: boolean;
  sensitive: boolean;
  thirdParty: boolean;
}

interface TermConfig {
  key: keyof Omit<AgreementState, "all">;
  label: string;
  required: boolean;
}

const index: React.FC = () => {
  const [agreement, setAgreement] = useState<AgreementState>({
    all: false,
    service: false,
    privacy: false,
    sensitive: false,
    thirdParty: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<TermConfig | null>(null);

  const termsConfig: TermConfig[] = [
    {
      key: "service",
      label: "서비스 이용약관 동의",
      required: true,
    },
    {
      key: "privacy",
      label: "개인정보 수집 및 이용 동의",
      required: true,
    },

    {
      key: "sensitive",
      label: "민감정보 수집·이용 동의",
      required: true,
    },

    {
      key: "thirdParty",
      label: "개인정보 제3자 제공 동의",
      required: true,
    },
  ];

  const handleAllAgree = (checked: boolean) => {
    setAgreement({
      all: checked,
      service: checked,
      privacy: checked,
      sensitive: checked,
      thirdParty: checked,
    });
  };

  const handleIndividualAgree = (
    key: keyof Omit<AgreementState, "all">,
    checked: boolean
  ): void => {
    const newAgreements = { ...agreement, [key]: checked };
    const allSelected =
      newAgreements.service &&
      newAgreements.privacy &&
      newAgreements.sensitive &&
      newAgreements.thirdParty;
    newAgreements.all = allSelected;
    setAgreement(newAgreements);
  };

  const openTermModal = (termKey: keyof TermsDataType) => {
    const termConfig = termsConfig.find((term) => term.key === termKey);
    setCurrentTerm(termConfig || null);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setCurrentTerm(null);
  };

  const agreeCurrentTerm = (): void => {
    if (currentTerm) {
      handleIndividualAgree(currentTerm.key, true);
    }
    closeModal();
  };

  const handleTermAgree = (key: keyof AgreementState, checked: boolean) => {
    setAgreement((prev) => ({ ...prev, [key]: checked }));
  };

  const canProceed = termsConfig.every(({ key }) => agreement[key]);

  const handleProceed = () => {
    router.push("/treat/consultation/code");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>오늘의 진료를 {"\n"}시작합니다!</Text>
        </View>

        <View style={styles.agreementContainer}>
          <View style={styles.allAgreementContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => handleAllAgree(!agreement.all)}>
                {agreement.all ? (
                  <AntDesign name="check" size={24} color={colors.BLACK} />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={24}
                    color={colors.TEXT_GRAY}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.allAgreementLabel}>전체 동의</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {termsConfig.map(({ key, label, required }) => (
            <TermsItem
              key={key}
              id={key}
              label={label}
              required={required}
              checked={agreement[key]}
              onChange={(checked) => handleIndividualAgree(key, checked)}
              onViewTerms={() => openTermModal(key)}
            />
          ))}
        </View>
      </ScrollView>
      <Button
        text="인증 코드 생성하기"
        color={canProceed ? "pink" : "gray"}
        onPress={handleProceed}
        disabled={!canProceed}
      />

      <TermsModal
        isOpen={showModal}
        term={currentTerm ? TERMS_DATA[currentTerm.key] : null}
        onClose={closeModal}
        onAgree={agreeCurrentTerm}
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  titleContainer: {
    marginBottom: 32,
    marginTop: 60,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    lineHeight: 40,
    marginBottom: 20,
  },
  agreementContainer: {
    gap: 16,
  },
  allAgreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  allAgreementLabel: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
  },
});
