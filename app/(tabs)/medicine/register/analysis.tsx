// app/medicine/analysis.tsx
import { colors } from "@/constants";
import {
  analysisSteps,
  mockRecognizedMedicine,
} from "@/data/mockMedicineRecongition";
import { AnalysisProgress } from "@/types/medicationReconition";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AnalysisScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [progress, setProgress] = useState<AnalysisProgress>({
    step: 0,
    totalSteps: analysisSteps.length,
    message: "분석을 시작합니다...",
    percentage: 0,
  });

  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    if (!imageUri) {
      router.back();
      return;
    }

    const runAnalysis = async () => {
      // 각 단계별로 순차 실행
      for (let i = 0; i < analysisSteps.length; i++) {
        const currentStep = analysisSteps[i];
        const percentage = ((i + 1) / analysisSteps.length) * 100;

        setProgress({
          step: i + 1,
          totalSteps: analysisSteps.length,
          message: currentStep.message,
          percentage,
        });

        // 프로그레스 바 애니메이션
        Animated.timing(progressAnim, {
          toValue: percentage,
          duration: currentStep.duration,
          useNativeDriver: false,
        }).start();

        // 각 단계별 딜레이
        await new Promise((resolve) =>
          setTimeout(resolve, currentStep.duration)
        );
      }

      // 분석 완료 후 식별 코드 입력 화면으로 이동
      setTimeout(() => {
        router.replace({
          pathname: "/medicine/register/identification",
          params: {
            imageUri,
            recognizedData: JSON.stringify(mockRecognizedMedicine),
          },
        });
      }, 500);
    };

    runAnalysis();
  }, [imageUri]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 촬영된 이미지 */}
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
          <View style={styles.overlay}>
            <View style={styles.scanLine} />
          </View>
        </View>

        {/* AI 분석 중 표시 */}
        <View style={styles.analysisContainer}>
          <Text style={styles.title}>AI가 약물을 분석하고 있습니다</Text>

          {/* 진행 상태 */}
          <View style={styles.progressContainer}>
            <Text style={styles.stepText}>
              {progress.step}/{progress.totalSteps}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.percentageText}>
              {Math.round(progress.percentage)}%
            </Text>
          </View>

          {/* 현재 분석 단계 메시지 */}
          <View style={styles.messageContainer}>
            <ActivityIndicator size="small" color={colors.PINK} />
            <Text style={styles.message}>{progress.message}</Text>
          </View>
        </View>

        {/* 분석 과정 설명 */}
        <View style={styles.stepsContainer}>
          {analysisSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  progress.step > index && styles.stepDotCompleted,
                  progress.step === index + 1 && styles.stepDotActive,
                ]}
              >
                {progress.step > index && (
                  <Text style={styles.stepDotText}>✓</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  progress.step > index && styles.stepTextCompleted,
                  progress.step === index + 1 && styles.stepTextActive,
                ]}
              >
                {step.message}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_COLOR,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    width: "90%", // 100%에서 90%로 줄임
    height: 180, // 200에서 180으로 줄임
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
    alignSelf: "center", // 가운데 정렬
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    // resizeMode: "contain", // cover에서 contain으로 변경하여 이미지가 잘리지 않도록
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 182, 185, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanLine: {
    width: "80%",
    height: 2,
    backgroundColor: colors.PINK,
    opacity: 0.8,
  },
  analysisContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.BLACK,
    marginBottom: 20,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  stepText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.PINK,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.PINK,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  message: {
    fontSize: 14,
    color: colors.BLACK,
    fontWeight: "500",
  },
  stepsContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.LIGHT_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotCompleted: {
    backgroundColor: colors.PINK,
  },
  stepDotActive: {
    backgroundColor: colors.PINK,
    borderWidth: 2,
    borderColor: colors.WHITE,
    shadowColor: colors.PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepDotText: {
    color: colors.WHITE,
    fontSize: 10,
    fontWeight: "bold",
  },
  stepTextCompleted: {
    color: colors.BLACK,
    fontWeight: "500",
  },
  stepTextActive: {
    color: colors.PINK,
    fontWeight: "600",
  },
});
