import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import AllergyItem from "./AllergyItem";
import Button from "./Button";

export default function AllergyList() {
  const { watch, setValue } = useFormContext();
  const allergyItems = watch("allergy") || [];

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelectId = (itemId: number) => {
    setSelectedId(selectedId === itemId ? null : itemId);
  };

  const addNewAllergyItem = () => {
    const newAllergyItem = {
      id: Date.now(),
      name: "",
    };
    setValue("allergy", [...allergyItems, newAllergyItem]);
  };

  // ID로 삭제
  const removeAllergyItem = (itemId: number) => {
    const updatedItems = allergyItems.filter((item: any) => item.id !== itemId);
    setValue("allergy", updatedItems);

    if (selectedId === itemId) setSelectedId(null);
  };

  const updateAllergyItem = (itemId: number, updateData: { name: string }) => {
    const updatedItems = allergyItems.map((item: any) =>
      item.id === itemId ? { ...item, ...updateData } : item
    );
    setValue("allergy", updatedItems);
  };

  return (
    <View>
      <View style={styles.allergyList}>
        <Text style={styles.allergyLabel}>알레르기 유무</Text>
        <View style={styles.allergyItem}>
          {allergyItems.map((item: any, index: number) => (
            <AllergyItem
              key={item.id}
              id={item.id}
              data={item}
              isSelected={selectedId === item.id}
              onSelect={() => handleSelectId(item.id)}
              onRemove={() => removeAllergyItem(item.id)}
              onUpdate={(updateData) => updateAllergyItem(item.id, updateData)}
            />
          ))}
        </View>
      </View>
      <View style={styles.button}>
        <Button
          size="medium"
          text="전체삭제"
          color="gray"
          onPress={() => {
            setValue("allergy", []);
            setSelectedId(null);
          }}
        />
        <Button size="medium" text="추가하기" onPress={addNewAllergyItem} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  allergyLabel: {
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

  allergyList: {},
  allergyItem: {},
});
