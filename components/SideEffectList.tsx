import { colors } from "@/constants";
import { CreateSideEffectRequest } from "@/types/sideEffect";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddIcon from "./../assets/icon/AddIcon.svg";
import Button from "./Button";
import SideEffectItem from "./SideEffectItem";
dayjs.locale("ko");

interface Medicine {
  id: number;
  name: string;
  date: string;
}

interface SideEffectListProps {
  isEditing: boolean;
  sideEffects: CreateSideEffectRequest[];
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
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  // 약물 목록 가져오기
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      // 약물 목록 가져오는 api

      // mock 데이터
      setMedicines([
        { id: 1, name: "타이레놀", date: "2025.01.15~2025.01.20" },
        { id: 2, name: "애드빌", date: "2025.01.20~2025-01-29" },
        { id: 3, name: "게보린", date: "2025.02.20~2025-02-29" },
      ]);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }

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
          <AddIcon width={18} height={18} />;
          <Text style={styles.text}>약물 추가하기</Text>
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          presentationStyle="overFullScreen"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalDate}>
                {dayjs().format("M월 DD일 dddd")}
              </Text>
              {medicines.map((medicine) => (
                <Pressable
                  key={medicine.id}
                  style={[
                    styles.medicineItem,
                    selectedMedicine?.id === medicine.id &&
                      styles.selectedMedicine,
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
                <Button
                  text="확인"
                  size="medium"
                  onPress={handleConfirmPress}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,

    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: width * 0.95,
    height: "auto",
    gap: 10,
    padding: 10,
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
