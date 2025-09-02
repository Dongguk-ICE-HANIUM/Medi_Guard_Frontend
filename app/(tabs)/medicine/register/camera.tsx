// app/medicine/camera.tsx
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CameraScreen() {
  const [type, setType] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>카메라 권한 확인 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다</Text>
          <Pressable
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo?.uri) {
          // 촬영 성공 시 분석 화면으로 이동
          router.push({
            pathname: "/medicine/register/analysis",
            params: { imageUri: photo.uri },
          });
        }
      } catch (error) {
        console.error("사진 촬영 실패:", error);
        Alert.alert(
          "촬영 실패",
          "사진 촬영에 실패했습니다. 다시 시도해주세요."
        );
      }
    }
  };

  const toggleCameraType = () => {
    setType((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={type} ref={cameraRef}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.WHITE} />
          </Pressable>
        </View>

        {/* 카메라 가이드 */}
        <View style={styles.guide}>
          <View style={styles.guideFrame}>
            <View style={styles.guideCorner} />
            <View style={[styles.guideCorner, styles.topRight]} />
            <View style={[styles.guideCorner, styles.bottomLeft]} />
            <View style={[styles.guideCorner, styles.bottomRight]} />
          </View>
          <Text style={styles.guideText}>
            약물을 프레임 안에 넣고 촬영해주세요
          </Text>
        </View>

        {/* 하단 컨트롤 */}
        <View style={styles.controls}>
          <View style={styles.controlsRow}>
            <View style={styles.emptySpace} />

            {/* 촬영 버튼 */}
            <Pressable style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </Pressable>

            {/* 카메라 전환 버튼 */}
            <Pressable style={styles.flipButton} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse" size={24} color={colors.WHITE} />
            </Pressable>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BG_COLOR,
  },
  permissionText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: colors.PINK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  guide: {
    position: "absolute",
    top: "50%",
    left: width * 0.1,
    right: width * 0.1,
    alignItems: "center",
    transform: [{ translateY: -height * 0.15 }],
  },
  guideFrame: {
    width: width * 0.8,
    height: width * 0.6,
    position: "relative",
  },
  guideCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: colors.WHITE,
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    left: "auto",
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: "auto",
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: "auto",
    left: "auto",
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  guideText: {
    color: colors.WHITE,
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  controls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,

    alignItems: "center",
    paddingHorizontal: 10,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.8,
  },
  emptySpace: {
    width: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.WHITE,
  },
  flipButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
