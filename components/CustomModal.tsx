import { colors } from "@/constants";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function CustomModal({
  visible,
  onClose,
  children,
  contentStyle,
}: CustomModalProps) {
  return (
    <Modal visible={visible} presentationStyle="overFullScreen" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, contentStyle]}>
          {children}
          <View style={styles.buttonContainer}></View>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,

    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: width * 0.95,
    height: "auto",
    gap: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    gap: 5,
  },
});
