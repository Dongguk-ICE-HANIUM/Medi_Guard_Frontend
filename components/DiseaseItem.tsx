import { colors } from "@/constants";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DiseaseItemProps {
  id: number;
  data: {
    name: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: any) => void;
  onRemove?: () => void;
}

export default function DiseaseItem({
  id,
  data,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
}: DiseaseItemProps) {
  const handleFieldUpdate = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };
  return (
    <View style={[styles.diseaseItem, isSelected && styles.selectedItem]}>
      <TextInput
        onPress={onSelect}
        style={styles.input}
        value={data.name}
        onChangeText={(value) => handleFieldUpdate("name", value)}
        placeholder="질병을 입력해주세요"
      />
      <TouchableOpacity onPress={onRemove}>
        <Text style={styles.deleteText}>x</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  diseaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "transparent",
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: colors.BLACK,
    borderRadius: 10,
    margin: 5,
    padding: 0,
  },
  input: {
    fontSize: 17,
    fontWeight: "bold",
    padding: 10,
    margin: 10,
  },
  deleteText: {
    fontSize: 17,
    margin: 10,
    padding: 10,
  },
});
