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

const Group = () => {
  const [isGroupEnabled, setIsGroupEnabled] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleGroupToggle = (value: boolean) => {
    setIsGroupEnabled(value);
    if (!value) {
      setSearchText("");
    }
  };
  const handleSearchPress = () => {
    console.log("찾아보기 버튼 클릭");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>그룹</Text>
        <Switch
          value={isGroupEnabled}
          onValueChange={handleGroupToggle}
          trackColor={{ false: colors.TEXT_GRAY, true: colors.PINK }}
        />
      </View>

      {isGroupEnabled && (
        <View style={styles.content}>
          <TextInput
            style={styles.inputContainer}
            placeholder="그룹을 찾아보세요"
            value={searchText}
            onChangeText={setSearchText}
            editable={false}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
          >
            <Text style={{ color: colors.BLACK }}>찾아보기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Group;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
