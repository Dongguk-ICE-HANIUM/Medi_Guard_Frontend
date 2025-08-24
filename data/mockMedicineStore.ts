import { Drug, DrugGroup, Medication } from "@/types/medication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  MEDICATIONS: "@local_medications",
  DRUG_GROUPS: "@local_drug_groups",
  CALENDAR_DRUGS: "@local_calendar_drugs",
  DRUG_DETAILS: "@local_drug_details",
  INIT_GROUPS: "@local_init_groups",
};

class MedicineMockStore {
  constructor() {
    this.initialGroups();
  }

  //기본적으로 3개의 그룹 자동 생성
  private async initialGroups(): Promise<void> {
    try {
      const isInitialized = await AsyncStorage.getItem(
        STORAGE_KEYS.INIT_GROUPS
      );

      if (!isInitialized) {
        const basicGroups: DrugGroup[] = [
          { id: "group-1", name: "봄 진료 처방약" },
          { id: "group-2", name: "겨울 진료 처방약" },
          { id: "group-3", name: "만성질환 처방약" },
        ];
        await this.saveToStorage(STORAGE_KEYS.DRUG_GROUPS, basicGroups);
        await AsyncStorage.setItem(STORAGE_KEYS.INIT_GROUPS, "true");
        console.log("기본 그룹 생성");
      }
    } catch (error) {
      console.error("기본 그룹 생성 실패", error);
    }
  }

  //데이터 읽어오기
  private async getFromStorage<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("데이터 읽어오기 실패", error);
      return defaultValue;
    }
  }

  //데이터 저장하기
  private async saveToStorage<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("데이터 저장 실패", error);
    }
  }

  //
  //약물 관련 메서드
  //
  //전체 약물 가져오기
  async getMedicationsList(): Promise<Medication[]> {
    return await this.getFromStorage(STORAGE_KEYS.MEDICATIONS, []);
  }

  //전체 약물 저장
  async saveMedications(medications: Medication[]): Promise<void> {
    await this.saveToStorage(STORAGE_KEYS.MEDICATIONS, medications);
    await this.syncCalendarDrugs(medications);
  }

  //단건 추가
  async addMedication(medication: Medication): Promise<void> {
    const medications = await this.getMedicationsList();
    const updated = [...medications, medication];
    await this.saveMedications(updated);

    console.log("약물 등록 완료", medication.medicineInfo.name);
  }

  //단건 수정 (후 전체 배열 다시 저장)
  async updateMedication(
    id: string,
    updateData: Partial<Medication>
  ): Promise<Medication | null> {
    const medications = await this.getMedicationsList();
    const index = medications.findIndex((m) => m.id === id);

    if (index === -1) {
      console.log("수정할 약물을 찾을 수 없습니다.");
      return null;
    }

    const updated = { ...medications[index], ...updateData };
    medications[index] = updated;
    await this.saveMedications(medications);

    console.log("약물 수정 완료", updated.medicineInfo.name);
    return updated;
  }

  //단건 삭제
  async deleteMedication(id: string): Promise<boolean> {
    const medications = await this.getMedicationsList();
    const medication = medications.find((m) => m.id === id);
    if (!medication) {
      console.log("삭제할 약물을 찾을 수 없습니다.");
      return false;
    }
    const filtered = medications.filter((m) => m.id !== id);
    await this.saveMedications(filtered);

    console.log("약물 수정 완료", medication.medicineInfo.name);
    return true;
  }

  //단건 조회
  async getMedication(id: string): Promise<Medication | undefined> {
    const medications = await this.getMedicationsList();
    return medications.find((m) => m.id === id);
  }

  //달력 데이터 동기화
  private async syncCalendarDrugs(medications: Medication[]): Promise<void> {
    const calendarDrugs: Drug[] = medications.map((m) => ({
      id: m.id,
      calendarDrugId: m.id,
      name: m.medicineInfo.name,
      startDate: m.startAt,
      endDate: m.endAt,
      timeSlot: m.perDay,
      takenDaysCount: 0,
      missedDaysCount: 0,
    }));

    await this.saveToStorage(STORAGE_KEYS.CALENDAR_DRUGS, calendarDrugs);
  }

  //약물 정보 조회
  async getCalendarDrugs(): Promise<Drug[]> {
    const drugGroups = await this.getFromStorage(STORAGE_KEYS.DRUG_GROUPS, []);
    return drugGroups;
  }

  // 약물 그룹 목록 조회
  async getDrugGroups(): Promise<DrugGroup[]> {
    return await this.getFromStorage(STORAGE_KEYS.DRUG_GROUPS, []);
  }

  async addDrugGroup(group: DrugGroup): Promise<void> {
    const drugGroups = await this.getCalendarDrugs();
    const updated = [...drugGroups, group];
    await this.saveToStorage(STORAGE_KEYS.DRUG_GROUPS, updated);
    console.log("그룹 추가 완료", group.name);
  }

  //아예 삭제하기
  //
  //
  //
  //개발용) 데이터 상태 출력 로그
  async logCurrentState(): Promise<{
    medications: number;
    calendarDrugs: number;
    groups: number;
  }> {
    const medications = await this.getMedicationsList();
    const calendarDrugs = await this.getCalendarDrugs();
    const groups = await this.getDrugGroups();

    console.log("현재 Mock 데이터 상태");
    console.log("약물 목록 (" + medications.length + "개):", medications);
    console.log("달력 데이터 (" + calendarDrugs.length + "개):", calendarDrugs);
    console.log("약물 그룹 (" + groups.length + "개):", groups);

    return {
      medications: medications.length,
      calendarDrugs: calendarDrugs.length,
      groups: groups.length,
    };
  }
  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      await this.initialGroups();
      console.log("모든 데이터 초기화, 기본 약물 그룹 생성");
    } catch (error) {
      console.error("모든 데이터 초기화 실패", error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.resetAll();
      console.log("시연 데이터 모두 삭제되었습니다.");
    } catch (error) {
      console.error("시연 데이터 모두 삭제 중 오류", error);
    }
  }

  // 추가: 시연용 샘플 약물 생성
  async addSampleMedication(): Promise<void> {
    const sampleNames = [
      "감기약",
      "진통제",
      "위장약",
      "눈약",
      "연고",
      "해열제",
    ];
    const randomName =
      sampleNames[Math.floor(Math.random() * sampleNames.length)];

    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const sampleMedication: Medication = {
      id: `sample_${Date.now()}`,
      medicineInfo: {
        id: `info_${Date.now()}`,
        name: randomName,
        code: `N${Math.floor(Math.random() * 100000)
          .toString()
          .padStart(5, "0")}`,
        effect: `${randomName} 효과`,
        warning: "의사의 지시에 따라 복용하세요",
        sideEffect: "부작용이 있을 수 있습니다",
        interaction: "다른 약물과의 상호작용 주의",
        depositMethod: "하루 2회 식후 복용",
      },
      startAt: today,
      endAt: nextMonth,
      takingType: "EVERY_DAY" as any,
      interval: undefined,
      specificDateList: undefined,
      perDay: 2,
      amount: 1,
      isActive: true,
      isEssential: false,
      groupName: "샘플 약물",
      groupId: "group-1",
      notifiTakingList: [],
    };

    await this.addMedication(sampleMedication);
    console.log("🎲 샘플 약물 추가됨:", randomName);
  }
}

export const mockMedicineStore = new MedicineMockStore();

//개발용
export const mockStoreUtils = {
  logCurrentState: () => mockMedicineStore.logCurrentState(),
  resetAll: () => mockMedicineStore.resetAll(),
  cleanup: () => mockMedicineStore.cleanup(),
  addSample: () => mockMedicineStore.addSampleMedication(),
};
