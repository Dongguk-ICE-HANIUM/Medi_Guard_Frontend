import { colors } from "@/constants";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import XIcon from "../assets/icon/XIcon.svg";

interface SideEffectItemProps {
  id: string;
  data: {
    medicine: string;
    description: string;
  };
  isEditing: boolean;
  onUpdate?: (data: any) => void;
  onRemove?: () => void;
}

export default function SideEffectItem({
  id,
  data,
  isEditing,
  onUpdate,
  onRemove,
}: SideEffectItemProps) {
  const [description, setDescription] = useState(data.description);

  useEffect(() => {
    if (description?.trim() === "") return;
  });

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (isEditing) onUpdate?.({ description: text });
  };

  return (
    <View style={styles.sideEffectItem}>
      <View style={styles.sideEffectItemContainer}>
        <Text style={styles.sideEffectItemName}>{data.medicine}</Text>
        <TextInput
          editable={isEditing}
          placeholder="증상을 입력해주세요"
          value={description}
          onChangeText={handleDescriptionChange}
          multiline={true}
          style={styles.sideEffectItemInput}
          textAlignVertical="top"
        />
      </View>
      <TouchableOpacity>
        <XIcon width={20} height={20} onPress={onRemove} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sideEffectItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    margin: 5,
  },
  sideEffectItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  sideEffectItemName: {
    backgroundSize: "20",
    paddingBottom: 7,
    fontSize: 13,
    fontWeight: "700",
    minWidth: 60,
  },
  sideEffectItemInput: {
    backgroundColor: colors.BG_COLOR,
    borderRadius: 12,
    width: 250,
    height: 30,
    padding: 7,
    fontSize: 11,
  },
  cancle: {
    backgroundColor: colors.PINK,
    borderRadius: 30,
  },
});
