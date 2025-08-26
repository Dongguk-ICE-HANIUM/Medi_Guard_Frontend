import { Drug, DrugGroup, Medication } from "@/types/medication";
import { RecognizedMedicineInfo } from "@/types/medicationReconition";
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

  //ai 루트
  // 인식된 약물 정보로 약물 등록 (기존 addMedication 메서드를 확장)
  async addMedicationFromRecognition(
    recognizedMedicine: RecognizedMedicineInfo,
    medicationData: Partial<Medication>
  ): Promise<void> {
    const medication: Medication = {
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      medicineInfo: {
        id: recognizedMedicine.id,
        name: recognizedMedicine.name,
        code: recognizedMedicine.code,
        effect: recognizedMedicine.effect,
        warning: recognizedMedicine.warning,
        sideEffect: recognizedMedicine.sideEffect,
        interaction: recognizedMedicine.interaction,
        depositMethod: recognizedMedicine.depositMethod,
      },
      startAt: medicationData.startAt || new Date().toISOString().split("T")[0],
      endAt:
        medicationData.endAt ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      takingType: medicationData.takingType || ("EVERY_DAY" as any),
      interval: medicationData.interval,
      specificDateList: medicationData.specificDateList,
      perDay: medicationData.perDay || 2,
      amount: medicationData.amount || 1,
      isActive: true,
      isEssential: false,
      groupName: medicationData.groupName || "인식된 약물",
      groupId: medicationData.groupId || "group-1",
      notifiTakingList: medicationData.notifiTakingList || [],
    };

    const medications = await this.getMedicationsList();
    const updated = [...medications, medication];
    await this.saveMedications(updated);

    console.log("인식된 약물 등록 완료:", medication.medicineInfo.name);
  }

  // 약물 인식 시뮬레이션 (시연용)
  async simulateMedicineRecognition(
    imageUri: string
  ): Promise<RecognizedMedicineInfo> {
    // 시연용 딜레이
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
      id: "huons-amoxicla-tab",
      name: "휴온스아목시크라정",
      code: "N0507034",
      effect:
        "아목시실린과 클라불란산 복합 제제로서 베타락타마제를 생성하는 내성균에 대해서도 효과를 나타내며, 광범위 항균 스펙트럼을 가진 항생제입니다.",
      warning:
        "임산부는 이 약의 순혈 중에 들어간 양이 보고되어 있어 분만시 용량을 제한해야 합니다. 신장기능이 저하된 환자들은 사용하지 말도록 합니다.",
      sideEffect:
        "일반적인 부작용으로 설사 또는 연변, 구역, 구토, 가스찬 복통, 과민반응이 나타날 수 있습니다. 때로는 간수치 상승, 혈소판 감소증이 나타날 수 있습니다.",
      interaction:
        "와파린과 병용시 혈액응고능 검사인 국제표준화비율(INR)의 변화가 보고되어 있어 주의해야 합니다. 경구용 항응고제와 함께 복용할 경우 혈액응고 시간을 정기적으로 모니터링해야 합니다.",
      depositMethod:
        "성인 및 12세 이상: 1회 1정, 1일 2회 12시간 간격으로 복용합니다. 식사와 함께 복용하면 위장장애를 줄일 수 있습니다.",
      imageUri,
    };
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

  //ai 루트

  // 인식된 약물로 샘플 추가
  addRecognizedSample: async () => {
    const sampleRecognition: RecognizedMedicineInfo = {
      id: "sample-recognition-" + Date.now(),
      name: "휴온스아목시크라정",
      code: "N0507034",
      effect: "광범위 항균 스펙트럼을 가진 항생제",
      warning: "임산부, 신장기능 저하 환자 주의",
      sideEffect: "설사, 구역, 구토 등",
      interaction: "와파린과 상호작용 주의",
      depositMethod: "1일 2회, 식사와 함께 복용",
    };

    await mockMedicineStore.addMedicationFromRecognition(sampleRecognition, {
      startAt: new Date().toISOString().split("T")[0],
      endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      perDay: 2,
      amount: 1,
      takingType: "EVERY_DAY" as any,
    });

    console.log("🔍 인식된 샘플 약물 추가됨");
  },
};
