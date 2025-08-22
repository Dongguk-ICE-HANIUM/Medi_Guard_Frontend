import { colors } from "@/constants";
import Feather from "@expo/vector-icons/Feather";
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
  onRemoveFromGroup?: () => void;
  showRemoveButton?: boolean;
}

const Group = ({
  groupName,
  onGroupChange,
  onRemoveFromGroup,
  showRemoveButton = false,
}: GroupProps) => {
  const [isGroupEnabled, setIsGroupEnabled] = useState(true);
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>그룹</Text>
          {/* 현재 속한 그룹 태그 */}
          {groupName && (
            <View style={styles.groupTag}>
              <Text style={styles.groupTagText}>{groupName}</Text>
              <TouchableOpacity onPress={onRemoveFromGroup}>
                <Feather name="x-circle" size={17} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Switch
          value={isGroupEnabled}
          onValueChange={toggleGroup}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
        />
      </View>

      {isGroupEnabled && (
        <View style={styles.content}>
          <TextInput
            style={[
              styles.inputContainer,
              groupName ? { color: colors.BLACK } : { color: colors.TEXT_GRAY },
            ]}
            placeholder="그룹을 찾아보세요"
            value={groupName}
            editable={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={openModal}>
              <Text style={{ color: colors.BLACK }}>찾아보기</Text>
            </TouchableOpacity>
          </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  groupTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.PINK + "40",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  groupTagText: {
    fontSize: 14,
    color: colors.BLACK,
    fontWeight: "500",
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
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
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
