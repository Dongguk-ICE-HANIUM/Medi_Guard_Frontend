import { colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TermData } from "../../data/termsData";
import Button from "../Button";

interface TermsModalProps {
  isOpen: boolean;
  term: TermData | null;
  onClose: () => void;
  onAgree: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  term,
  onClose,
  onAgree,
}) => {
  if (!term) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{term.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.contentText}>{term.content}</Text>
        </ScrollView>

        <View style={styles.footer}>
          <Button text="취소" onPress={onClose} size="medium" color="gray" />
          <Button text="동의" onPress={onAgree} size="medium" color="pink" />
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 0,
  },
  contentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 10,
    gap: 8,
  },
});
