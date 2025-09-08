import { colors } from "@/constants";
import { useMedicineContext } from "@/context/MedicineContext";
import { CreateSideEffectRequest, sideEffectItem } from "@/types/sideEffect";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddIcon from "./../assets/icon/AddIcon.svg";
import Button from "./Button";
import CustomModal from "./CustomModal";
import SideEffectItem from "./SideEffectItem";
dayjs.locale("ko");

interface Medicine {
  id: number;
  name: string;
  date: string;
}

interface SideEffectListProps {
  isEditing: boolean;
  sideEffects: sideEffectItem[];
  onAdd: (newItem: CreateSideEffectRequest) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, description: string) => void;
}

export default function SideEffectList({
  isEditing,
  sideEffects,
  onAdd,
  onRemove,
  onUpdate,
}: SideEffectListProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { medicines } = useMedicineContext();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );

  function handleCreateSideEffect() {
    setIsModalVisible(true);
    setSelectedMedicine(null); // 모달을 열 때 선택초기화
  }

  function handleConfirmPress() {
    if (selectedMedicine) {
      const newSideEffect: CreateSideEffectRequest = {
        id: Date.now().toString(),
        drug_name: selectedMedicine.name,
        description: "",
      };
      onAdd(newSideEffect);
      setIsModalVisible(false);
    }
  }

  return (
    <View style={styles.sideEffectList}>
      {sideEffects.map((sideEffect) => (
        <SideEffectItem
          key={sideEffect.id}
          id={sideEffect.id}
          data={{
            medicine: sideEffect.drug_name,
            description: sideEffect.description,
          }}
          onRemove={() => onRemove(sideEffect.id)}
          onUpdate={(desc) => onUpdate(sideEffect.id, desc)}
          isEditing={isEditing}
        />
      ))}
      <View>
        <TouchableOpacity
          style={styles.addNewMedicine}
          onPress={handleCreateSideEffect}
        >
          <AddIcon width={18} height={18} />
          <Text style={styles.text}>약물 추가하기</Text>
        </TouchableOpacity>
        <CustomModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        >
          <Text style={styles.modalDate}>
            {dayjs().format("M월 DD일 dddd")}
          </Text>
          {medicines.map((medicine) => (
            <Pressable
              key={medicine.id}
              style={[
                styles.medicineItem,
                selectedMedicine?.id === medicine.id && styles.selectedMedicine,
              ]}
              onPress={() => setSelectedMedicine(medicine)}
            >
              <Text style={{ fontWeight: "800", fontSize: 17 }}>
                {medicine.name}
              </Text>
              <Text style={{ fontSize: 10, paddingTop: 3 }}>
                {medicine.date}
              </Text>
            </Pressable>
          ))}

          <View style={styles.buttonContainer}>
            <Button
              text="취소"
              size="medium"
              color="gray"
              onPress={() => setIsModalVisible(false)}
            />
            <Button text="확인" size="medium" onPress={handleConfirmPress} />
          </View>
        </CustomModal>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  sideEffectList: {},
  addNewMedicine: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
  },
  modalDate: {
    fontSize: 17,
    fontWeight: "700",
    margin: 5,
  },

  medicineItem: {
    flexDirection: "row",
    gap: 5,
    padding: 15,
  },
  selectedMedicine: {
    borderColor: colors.PINK,
    borderWidth: 1,
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
});
