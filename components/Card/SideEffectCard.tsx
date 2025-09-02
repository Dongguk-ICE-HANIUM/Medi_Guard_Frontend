import { colors } from "@/constants";
import useCreateSideEffect from "@/hooks/queries/useCreateSideEffect";
import useDeleteSideEffect from "@/hooks/queries/useDeleteSideEffect";
import useGetSideEffect from "@/hooks/queries/useGetSideEffect";
import usePatchSideEffect from "@/hooks/queries/useUpdateSideEffect";
import { CreateSideEffectRequest } from "@/types/sideEffect";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import SideEffectList from "../SideEffectList";

export default function SideEffectCard() {
  const [isEditing, setIsEditing] = useState(false);
  const { refetch, data } = useGetSideEffect();
  // 서버구현 전까지 로컬에서 관리, 그후에 useGetSideEffect에서 data 받아와서 useState에 복사해서 관리
  const [sideEffects, setSideEffects] = useState<CreateSideEffectRequest[]>([]);

  const createSideEffect = useCreateSideEffect();
  const deleteSideEffect = useDeleteSideEffect();
  const updateSideEffect = usePatchSideEffect();

  // SideEffectList에 props로 넘겨줄 함수들
  function handleAdd(newItem: CreateSideEffectRequest) {
    setSideEffects((prev) => [...prev, newItem]);
    createSideEffect.mutate(newItem);
  }
  function handleRemove(id: string) {
    setSideEffects((prev) => prev.filter((item) => item.id !== id));
    deleteSideEffect.mutate(id);
  }
  function handleUpdate(id: string, description: string) {
    updateSideEffect.mutate({
      sideEffectId: id,
      description: description,
    });
  }

  // 수정 및 저장 버튼 함수
  function handleSaveButton() {
    setIsEditing(false);
    Alert.alert("알림", "저장되었습니다.");
    refetch();
  }

  return (
    <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
      <View style={styles.sideEffectCard}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTextSideEffect}>부작용 관리</Text>
            <Pressable onPress={() => router.replace("/sideEffect")}>
              <Text style={styles.headerTextEntire}>전체보기</Text>
            </Pressable>
          </View>
          <View style={styles.headerButton}>
            <Button
              text="수정"
              color="gray"
              size="small"
              onPress={() => setIsEditing(true)}
            />
            <Button
              text="저장"
              color="pink"
              size="small"
              onPress={handleSaveButton}
            />
          </View>
        </View>
        <View>
          <SideEffectList
            isEditing={isEditing}
            sideEffects={sideEffects}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sideEffectCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 15,
    width: "100%",
    height: "auto",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTextEntire: {
    color: colors.TEXT_GRAY,
    fontSize: 12,
  },
  headerTextSideEffect: {
    fontWeight: "bold",
    fontSize: 16,
  },
  headerButton: {
    flexDirection: "row",
    gap: 5,
  },
});
