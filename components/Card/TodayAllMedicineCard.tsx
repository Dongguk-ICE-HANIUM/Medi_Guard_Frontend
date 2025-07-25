import { colors } from "@/constants";
import { Drug, DrugGroup } from "@/types/calendar";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import GroupMedicineCard from "./GroupMedicineCard";
import SingleMedicineCard from "./SingleMedicineCard";

interface TodayAllMedicineCardProps {
  drugGroups: DrugGroup[];
  individualDrugs: Drug[];
  selectedDate?: string;
  loading?: boolean;
}

const TodayAllMedicineCard = ({
  drugGroups,
  individualDrugs,
  selectedDate,
  loading = false,
}: TodayAllMedicineCardProps) => {
  const DrugGroupList = () => {
    return (
      <View>
        {drugGroups.map((drugGroup) => (
          <View key={drugGroup.id} style={styles.drugGroupItem}>
            <GroupMedicineCard drugGroup={drugGroup} />
          </View>
        ))}
      </View>
    );
  };
  const DrugList = () => {
    return (
      <>
        {individualDrugs.map((drugItem) => (
          <View key={drugItem.id} style={styles.drugItem}>
            <SingleMedicineCard drugItem={drugItem} />
          </View>
        ))}
      </>
    );
  };
  const EmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>복용 약물이 없습니다.</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={colors.PINK} />;
  }

  const isExisted = drugGroups.length > 0 || individualDrugs.length > 0;
  return (
    <View style={styles.todayListContainer}>
      {isExisted ? (
        <>
          <DrugGroupList />
          <DrugList />
        </>
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default TodayAllMedicineCard;

const styles = StyleSheet.create({
  todayListContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  drugGroupItem: {
    marginBottom: 10,
  },
  drugItem: {
    marginBottom: 10,
    maxHeight: 150,
  },
  emptyContainer: {},
  emptyText: {},
});
