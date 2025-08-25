// app/medicine/identification.tsx
import Button from "@/components/Button";
import { colors } from "@/constants";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function IdentificationScreen() {
  const { imageUri, recognizedData } = useLocalSearchParams<{
    imageUri: string;
    recognizedData: string;
  }>();

  const [medicineData, setMedicineData] =
    useState<RecognizedMedicineInfo | null>(null);
  const [identificationCode, setIdentificationCode] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    if (recognizedData) {
      try {
        const parsed = JSON.parse(recognizedData);
        setMedicineData(parsed);
        setIdentificationCode(parsed.code || "");
      } catch (error) {
        console.error("약물 데이터 파싱 실패:", error);
        router.back();
      }
    }
  }, [recognizedData]);

  const handleContinue = () => {
    if (!identificationCode.trim()) {
      Alert.alert("입력 필요", "식별코드를 입력해주세요.");
      return;
    }

    if (!medicineData) {
      Alert.alert("오류", "약물 정보를 불러올 수 없습니다.");
      return;
    }

    // RegisterForm으로 이동하면서 인식된 데이터 전달 (약물 이름만)
    const updatedMedicineData = {
      ...medicineData,
      code: identificationCode,
    };

    router.push({
      pathname: "/medicine/register/registerForm",
      params: {
        recognizedMedicine: JSON.stringify(updatedMedicineData),
        imageUri,
      },
    });
  };

  const handleRetake = () => {
    router.replace("/medicine/register/camera");
  };

  if (!medicineData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 인식 결과 카드 */}
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.GREEN}
              />
            </View>
            <Text style={styles.resultTitle}>약물 인식 완료</Text>
          </View>

          {/* 촬영된 이미지 */}
          <View style={styles.imageContainer}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </View>

          {/* 인식된 약물 정보 */}
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{medicineData.name}</Text>
            <Text style={styles.medicineCode}>
              식별코드: {medicineData.code}
            </Text>
          </View>
        </View>

        {/* 식별코드 확인 */}
        <View style={styles.identificationSection}>
          <Text style={styles.sectionTitle}>식별코드 확인</Text>
          <Text style={styles.sectionDescription}>
            인식된 식별코드가 정확한지 확인해주세요. 필요시 직접 수정할 수
            있습니다.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>식별코드</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={identificationCode}
                onChangeText={setIdentificationCode}
                placeholder="식별코드를 입력하세요"
                placeholderTextColor={colors.TEXT_GRAY}
                autoCapitalize="characters"
                onFocus={() => setIsManualEntry(true)}
              />
              {isManualEntry && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => setIdentificationCode("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.TEXT_GRAY}
                  />
                </Pressable>
              )}
            </View>
          </View>

          {isManualEntry && (
            <Text style={styles.manualEntryNote}>
              💡 약물 포장지나 용기에서 식별코드를 확인할 수 있습니다.
            </Text>
          )}
        </View>

        {/* 약물 기본 정보 미리보기 */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>약물 정보 미리보기</Text>

          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>효능</Text>
            <Text style={styles.previewValue} numberOfLines={2}>
              {medicineData.effect}
            </Text>
          </View>

          <View style={styles.previewItem}>
            <Text style={styles.previewLabel}>복용방법</Text>
            <Text style={styles.previewValue} numberOfLines={2}>
              {medicineData.depositMethod}
            </Text>
          </View>

          <View style={styles.previewDivider} />

          <Pressable style={styles.detailButton}>
            <Text style={styles.detailButtonText}>상세 정보 보기</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.TEXT_GRAY}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* 하단 버튼들 */}
      <View style={styles.bottomActions}>
        <Pressable style={styles.retakeButton} onPress={handleRetake}>
          <Ionicons name="camera" size={20} color={colors.TEXT_GRAY} />
          <Text style={styles.retakeButtonText}>다시 촬영</Text>
        </Pressable>

        <Button
          text="약물 등록하기"
          onPress={handleContinue}
          size="large"
          color="pink"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_COLOR,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  resultCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  successIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.BLACK,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  medicineInfo: {
    alignItems: "center",
  },
  medicineName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.BLACK,
    marginBottom: 5,
    textAlign: "center",
  },
  medicineCode: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
  },
  identificationSection: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLACK,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    lineHeight: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.BLACK,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.BLACK,
    paddingVertical: 15,
  },
  clearButton: {
    padding: 5,
  },
  manualEntryNote: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
    fontStyle: "italic",
    marginTop: 8,
  },
  previewSection: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  previewItem: {
    marginBottom: 15,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.BLACK,
    marginBottom: 5,
  },
  previewValue: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    lineHeight: 18,
  },
  previewDivider: {
    height: 1,
    backgroundColor: colors.LIGHT_GRAY,
    marginVertical: 15,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  detailButtonText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },
  bottomActions: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: colors.LIGHT_GRAY,
    gap: 12,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
  },
});
