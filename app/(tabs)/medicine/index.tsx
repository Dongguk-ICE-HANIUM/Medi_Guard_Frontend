import Calendar from "@/components/Calendar";
import GroupMedicineCard from "@/components/Card/GroupMedicineCard";
import NavigationCard from "@/components/Card/NavigationCard";
import SingleMedicineCard from "@/components/Card/SingleMedicineCard";
import { useCalendar } from "@/hooks/useCalendar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MedicineScreen() {
  const { currentDate } = useCalendar();

  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDay();

  //dummydata
  const drugGroupList = [
    {
      id: "UUID",
      name: "봄 진료 처방약",
    },
    {
      id: "UGID",
      name: "겨울 진료 처방약",
    },
  ];

  const drugList = [
    {
      id: "UUID",
      calendarDrugId: "UUID",
      name: "우루사정",
      startDate: new Date("2025-03-10"),
      endDate: new Date("2025-03-30"),
      timeSlot: 12,
      takenDaysCount: 8,
      missedDaysCount: 5,
    },
    {
      id: "UGID",
      calendarDrugId: "UGID",
      name: "타이레놀",
      startDate: new Date("2025-03-3"),
      endDate: new Date("2025-03-18"),
      timeSlot: 12,
      takenDaysCount: 7,
      missedDaysCount: 2,
    },
  ];

  const DrugGroupList = () => {
    return (
      <View>
        {drugGroupList.map((drugGroup) => (
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
        {drugList.map((drugItem) => (
          <View key={drugItem.id} style={styles.drugItem}>
            <SingleMedicineCard drugItem={drugItem} />
          </View>
        ))}
      </>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <View style={styles.navCardContainer}>
          <NavigationCard
            text="전체 복용약 보기"
            icon="next"
            onPress={() => {
              router.push("/medicine/MedicineList");
            }}
          />
          <NavigationCard
            text="약물 등록하기"
            icon="plus"
            onPress={() => {
              router.push("/medicine/Register");
            }}
          />
        </View>
        <View style={styles.calendarConatainer}>
          <View style={styles.calendarTitleTextContainer}>
            <Text style={styles.calendarTitleText}>
              {currentMonth}월 {currentDay}일
            </Text>
            <AntDesign name="downcircleo" size={17} color="black" />
          </View>
          <Calendar />
        </View>
        <View style={styles.todayContainer}>
          {DrugGroupList()}
          {DrugList()}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  calendarConatainer: {
    marginVertical: 15,
  },
  calendarTitleTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  calendarTitleText: {
    fontSize: 17,
  },
  todayContainer: {},
  drugGroupItem: {
    marginVertical: 5,
  },
  drugItem: {
    marginVertical: 5,
  },
});
