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

  const filteredGroups = MOCK_GROUPS.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleClose = () => {
    setSearchText("");
    setSelectedGroupId("");
    onClose();
  };
  const handleConfirm = () => {
    const selectedGroup = MOCK_GROUPS.find(
      (group) => group.id === selectedGroupId
    );
    if (selectedGroup) {
      onGroupSelect(selectedGroup.name);
    }
  };

  const handleAddNewGroup = () => {
    console.log("새로운 그룹 만들기 클릭");
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
        ></TouchableOpacity>
      </TouchableOpacity>{" "}
      <View style={styles.container}>
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
                    selectedGroupId === item.id ? colors.PINK : colors.TEXT_GRAY
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
            <Text style={styles.makeGroupText}>+ 새로운 그룹 만들기</Text>
          </TouchableOpacity>
        </View>
        <Button text="선택한 그룹에 추가" onPress={handleConfirm} />{" "}
      </View>
    </Modal>
  );
};

export default GroupModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
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
});
