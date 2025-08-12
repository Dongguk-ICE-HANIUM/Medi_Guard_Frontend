import { colors } from "@/constants";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../Button";

// Mock 데이터 - 실제로는 API에서 가져올 데이터
const MOCK_GROUPS = [
  { id: "1", name: "감기약 모음", isSelected: true },
  { id: "2", name: "두통약 두통두통", isSelected: false },
  { id: "3", name: "소화제", isSelected: false },
];

interface GroupModalProps {
  visible: boolean;
  onClose: () => void;
  onGroupSelect: (groupName: string) => void;
}

const GroupModal = ({ visible, onClose, onGroupSelect }: GroupModalProps) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  //mock 데이터 관리
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleClose = () => {
    setSearchText("");
    setSelectedGroupId("");
    setShowCreateGroup(false);
    setNewGroupName("");
    onClose();
  };
  const handleConfirm = () => {
    const selectedGroup = groups.find((group) => group.id === selectedGroupId);
    if (selectedGroup) {
      onGroupSelect(selectedGroup.name);
    }
  };

  const handleAddNewGroup = () => {
    setShowCreateGroup(true);
    setNewGroupName("");
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now().toString(), //임의로 설정
        name: newGroupName.trim(),
        isSelected: false,
      };
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setShowCreateGroup(false);
      setNewGroupName("");
      handleBackToSearch();
    }
  };

  const handleBackToSearch = () => {
    setShowCreateGroup(false);
    setNewGroupName("");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.content}>
            {showCreateGroup ? (
              <>
                <View style={styles.newHeader}>
                  <TouchableOpacity
                    onPress={handleBackToSearch}
                    style={{ width: 40 }}
                  >
                    <Ionicons name="chevron-back" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.newTitle}>새 그룹 만들기</Text>
                </View>
                <View style={styles.newContainer}>
                  <Text style={styles.newName}>그룹 이름</Text>
                  <TextInput
                    style={styles.newInput}
                    placeholder="그룹 이름을 입력해주세요"
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                    autoFocus
                  />
                </View>
              </>
            ) : (
              <View style={styles.listContainer}>
                <View style={styles.header}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="그룹 이름을 입력해주세요"
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                  <Fontisto
                    name="search"
                    size={25}
                    color={colors.BLACK}
                    style={styles.searchIcon}
                  />
                </View>
                <FlatList
                  data={filteredGroups}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => setSelectedGroupId(item.id)}
                    >
                      <View style={styles.itemContainer}>
                        <Ionicons
                          name={
                            selectedGroupId === item.id
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={30}
                          color={
                            selectedGroupId === item.id
                              ? colors.PINK
                              : colors.TEXT_GRAY
                          }
                        />
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                  }
                />
                <View style={styles.footer}>
                  <View></View>
                  <TouchableOpacity
                    style={styles.makeGroup}
                    onPress={handleAddNewGroup}
                  >
                    <Text style={styles.makeGroupText}>
                      + 새로운 그룹 만들기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {showCreateGroup ? (
              <Button
                text="새 그룹 추가"
                onPress={handleCreateGroup}
                disabled={!newGroupName.trim()}
                color={!newGroupName.trim() ? "gray" : "pink"}
              />
            ) : (
              <Button
                text="선택한 그룹에 추가"
                onPress={handleConfirm}
                disabled={!selectedGroupId}
                color={!selectedGroupId ? "gray" : "pink"}
              />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default GroupModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    height: "50%",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.TEXT_GRAY,
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  searchIcon: {},
  list: {
    marginTop: 10,
    marginBottom: 20,
    maxHeight: "60%",
  },
  item: {
    paddingVertical: 5,
  },
  itemContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    alignItems: "center",
    textAlign: "center",
    marginVertical: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 25,
  },
  makeGroup: { justifyContent: "flex-end" },
  makeGroupText: {
    borderBottomWidth: 0.5,
    fontSize: 15,
  },
  addContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  newHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  newTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    marginRight: 40,
  },
  newContainer: {
    marginTop: 10,
  },
  newName: {
    fontSize: 16,
    fontWeight: "600",
  },
  newInput: {
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    borderColor: colors.TEXT_GRAY,
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 10,
  },
  newFooter: {
    marginTop: 15,
    marginBottom: 25,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 8,
  },
});
