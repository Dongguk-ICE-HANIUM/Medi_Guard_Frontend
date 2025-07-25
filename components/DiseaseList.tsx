import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import DiseaseItem from "./DiseaseItem";

export default function DiseaseList() {
  const { watch, setValue } = useFormContext();
  const diseaseItems = watch("disease") || [];

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelectId = (itemId: number) => {
    setSelectedId(selectedId === itemId ? null : itemId);
  };

  const addNewDiseaseItem = () => {
    const newDiseaseItem = {
      id: Date.now(),
      name: "",
    };
    setValue("disease", [...diseaseItems, newDiseaseItem]);
  };

  // ID로 삭제
  const removeDiseaseItem = (itemId: number) => {
    const updatedItems = diseaseItems.filter((item: any) => item.id !== itemId);
    setValue("disease", updatedItems);

    if (selectedId === itemId) setSelectedId(null);
  };

  const updateDiseaseItem = (itemId: number, updateData: any) => {
    const updatedItems = diseaseItems.map((item: any) =>
      item.id === itemId ? { ...item, ...updateData } : item
    );
    setValue("disease", updatedItems);
  };

  return (
    <View>
      <View>
        <Text style={styles.diseaseLabel}>질병이력</Text>
        <View>
          {diseaseItems.map((item: any, index: number) => (
            <DiseaseItem
              key={item.id}
              id={item.id}
              data={item}
              isSelected={selectedId === item.id}
              onSelect={() => handleSelectId(item.id)}
              onRemove={() => removeDiseaseItem(item.id)}
              onUpdate={(updateData) => updateDiseaseItem(item.id, updateData)}
            />
          ))}
        </View>
      </View>
      <View style={styles.button}>
        <Button
          size="medium"
          text="전체삭제"
          color="gray"
          onPress={() => setValue("allergy", [])}
        />
        <Button size="medium" text="추가하기" onPress={addNewDiseaseItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diseaseLabel: {
    fontSize: 15,
    marginLeft: 18,
    margin: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
});
