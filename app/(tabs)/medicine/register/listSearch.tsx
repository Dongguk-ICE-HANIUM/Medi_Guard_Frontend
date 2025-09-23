import Button from '@/components/Button';
import { colors } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

//mock데이터
const MOCK_MEDICINE_LIST = [
  { id: 'c3be31b9-11c0-4fdc-85a3-227fb4eebece', name: '나스타제정', effect: '이 약은 소화불량, 식욕감퇴(식욕부진), 과식, 체함, 소화촉진, 소화불량으로 인한 위부팽만감에 사용합니다.' },
  { id: '2', name: '애드빌', effect: '소염진통제' },
  { id: '3', name: '게보린', effect: '해열진통제' },
  { id: '4', name: '낙센', effect: '소염진통제' },
  { id: '5', name: '이부프로펜', effect: '해열진통소염제' },
  { id: '6', name: '아스피린', effect: '해열진통제' },
  { id: '7', name: '펜잘', effect: '해열진통제' },
  { id: '8', name: '부루펜', effect: '소염진통제' },
  { id: '9', name: '낙센에스', effect: '소염진통제' },
  { id: '10', name: '탁센', effect: '해열진통제' },
  { id: '11', name: '베아링', effect: '소염진통제' },
  { id: '12', name: '디클로펜', effect: '소염진통제' },
];

interface MedicineList {
    id : string;
    name : string;
    effect : string;
}


const listSearch = () => {
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [selectedMedicine, setSelectedMedicine] = React.useState<MedicineList | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    //검색 필터링
    const filteredMedicines = useMemo(() => {
        if(!searchQuery.trim()) return MOCK_MEDICINE_LIST;
        
        return MOCK_MEDICINE_LIST.filter(medicine =>
            medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            medicine.effect.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    //약물 선택
    const handleMedicineSelect = (medicine: MedicineList) => {
        setSelectedMedicine(medicine);
    };

    //다음으로 이동
    const handleNext = () => {
        if(!selectedMedicine) return;

        router.push({
            pathname : '/medicine/register/registerForm',
            params : { medicineId : selectedMedicine.id, medicineName : selectedMedicine.name }
        })
    }

    //아이템 렌더링
    const renderMedicineItem = ({ item }: { item: MedicineList }) => (
        <TouchableOpacity
        style={[
            styles.medicineItem,
            selectedMedicine?.id === item.id && styles.selectedMedicineItem
        ]}
        onPress={()=> handleMedicineSelect(item)}
        >
            <View style={styles.medicineIcon}>
                <FontAwesome5 name="pills" size={20} color={selectedMedicine?.id === item.id ? colors.PINK : colors.LIGHT_GRAY} />
            </View>
            <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <Text style={styles.medicineEffect} numberOfLines={2}>{item.effect}</Text>
            </View>
        </TouchableOpacity>

    );
  return (
    <View style={styles.container}>
         <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color={colors.TEXT_GRAY} />
          <TextInput
            style={styles.searchInput}
            placeholder="약물명을 검색해주세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.TEXT_GRAY}
          />
        </View>
     <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.PINK} />
              <Text style={styles.loadingText}>약물 목록을 불러오는 중...</Text>
            </View>
          ) : filteredMedicines.length > 0 ? (
            <FlatList
              data={filteredMedicines}
              keyExtractor={(item) => item.id}
              renderItem={renderMedicineItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="search" size={48} color={colors.TEXT_GRAY} />
              <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
              <Text style={styles.emptySubText}>다른 키워드로 검색해보세요</Text>
            </View>
          )}
        </View>
        <View style={styles.button}>
            <Button text="선택" color={selectedMedicine ? "pink" : "gray"} onPress={handleNext} disabled={!selectedMedicine} /></View>
    </View>
  )
}

export default listSearch

const styles = StyleSheet.create({
    medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.LIGHT_GRAY,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMedicineItem: {
    backgroundColor: colors.PINK+'20',
    borderColor: colors.PINK,
    borderWidth: 2,
  },
    medicineIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medicineInfo: {
        flex: 1,
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.BLACK,
        marginBottom: 4,
    },
    medicineEffect : {
        fontSize: 14,
        color: colors.TEXT_GRAY,
        lineHeight: 20,
    },

    container: {
        flex: 1,
    },
     searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.LIGHT_GRAY + '70',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        marginTop: 20,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.BLACK,
    },

     listContainer: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },



  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.TEXT_GRAY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.TEXT_GRAY,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: colors.TEXT_GRAY,
    textAlign: 'center',
  },
    button: {
    marginBottom: 15,
  },
})