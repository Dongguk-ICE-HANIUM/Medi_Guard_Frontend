import { colors } from "@/constants";
import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GroupModal from "./GroupModal";

interface GroupProps {
  groupName: string;
  onGroupChange: (groupName: string) => void;
}

const Group = ({ groupName, onGroupChange }: GroupProps) => {
  const [isGroupEnabled, setIsGroupEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleGroupSelect = (selectedGroup: string) => {
    onGroupChange(selectedGroup);
    setShowModal(false);
  };

  const toggleGroup = () => {
    setIsGroupEnabled((prev) => !prev);
    if (!isGroupEnabled) {
      onGroupChange("");
      setShowModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>그룹</Text>
        <Switch
          value={isGroupEnabled}
          onValueChange={toggleGroup}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
        />
      </View>

      {isGroupEnabled && (
        <View style={styles.content}>
          <TextInput
            style={styles.inputContainer}
            placeholder="그룹을 찾아보세요"
            value={groupName}
            editable={false}
          />
          <TouchableOpacity style={styles.searchButton} onPress={openModal}>
            <Text style={{ color: colors.BLACK }}>찾아보기</Text>
          </TouchableOpacity>
        </View>
      )}

      <GroupModal
        visible={showModal}
        onClose={closeModal}
        onGroupSelect={handleGroupSelect}
      />
    </View>
  );
};

export default Group;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  inputContainer: {
    height: 40,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: colors.TEXT_GRAY,
    paddingHorizontal: 10,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
    width: "78%",
    fontSize: 16,
  },
  searchButton: {
    height: 40,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: colors.TEXT_GRAY,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
