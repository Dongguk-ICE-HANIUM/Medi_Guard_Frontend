import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet } from "react-native";

const AllergyItem = () => {
  const [isEditing, setIsEditiing] = useState(false);
  const [text, setText] = useState("눌러서 수정해주세요.");
  const { control } = useFormContext();
};

const styles = StyleSheet.create({
  allergyItem: {},
});

export default AllergyItem;
