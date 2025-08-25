import { Medication, MedicineInfo, TakingType } from "@/types/medication";
import { convertBinaryToDays, convertDaysToBinary } from "@/utils/dateUtils";
import { useState } from "react";

// 상수 정의
const VALID_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const MAX_INTERVAL = 365;

// 기본값
const MEDICATION_DEFAULTS: Omit<Medication, "id" | "medicineInfo"> = {
  startAt: "",
  endAt: "",
  takingType: TakingType.UNSELECTED,
  interval: 0,
  specificDateList: [],
  perDay: 1,
  amount: 1.0,
  isActive: true,
  isEssential: false,
  groupName: "",
  notifiTakingList: [],
};

type ExtraErrorKeys = "dateRange" | "takingTypeRequired";
export type FieldKey = keyof Medication | ExtraErrorKeys;

const isDateInRange = (
  dateStr: string,
  startAt: string,
  endAt: string
): boolean => {
  if (!startAt || !endAt) return true;
  const date = new Date(dateStr);
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  return date >= startDate && date <= endDate;
};
const requireDateRange = (med: Medication): string[] => {
  const errors: string[] = [];
  if (!med.startAt || !med.endAt) {
    errors.push("복용 기간을 설정해주세요.");
  }
  return errors;
};

const requireTakingType = (med: Medication): string[] => {
  const errors: string[] = [];
  if (!med.takingType || med.takingType === TakingType.UNSELECTED) {
    errors.push("복용 주기를 선택해주세요.");
  }
  return errors;
};

// 초기 약물 데이터 생성
export const createInitialMedication = (
  medicineInfo: MedicineInfo
): Medication => ({
  ...MEDICATION_DEFAULTS,
  id: medicineInfo.id,
  medicineInfo: medicineInfo,
});

// 약물데이터 유효성 검사
export const validateField = (med: Medication, field: FieldKey): string[] => {
  const errors: string[] = [];

  switch (field) {
    case "dateRange":
      return requireDateRange(med);
    case "takingTypeRequired":
      return requireTakingType(med);

    case "takingType":
      switch (med.takingType) {
        case TakingType.EVERY_DAY:
          break;
        case TakingType.PARTICULAR_INTERVAL:
          if ((med.interval ?? 0) < 1) {
            errors.push("복용 간격을 1일 이상으로 설정해주세요.");
          }
          if ((med.interval ?? 0) > MAX_INTERVAL) {
            errors.push(`간격은 ${MAX_INTERVAL}일을 초과할 수 없습니다.`);
          }
          break;
        case TakingType.PARTICULAR_DAY:
          if ((med.interval ?? 0) === 0) {
            errors.push("복용할 요일을 선택해주세요.");
          }
          break;
        case TakingType.SPECIFIC_DATE:
          if (!med.specificDateList || med.specificDateList.length === 0) {
            errors.push(
              "특정 날짜 복용 시 최소 하나 이상의 날짜를 선택해주세요."
            );
          }
          if (med.specificDateList && med.startAt && med.endAt) {
            const outOfRange = med.specificDateList.filter(
              (dateStr) => !isDateInRange(dateStr, med.startAt, med.endAt)
            );
            if (outOfRange.length > 0) {
              errors.push("복용 기간 내에서 날짜를 선택해주세요.");
            }
          }
          break;
        case TakingType.NEED:
          break;
      }
      break;

    case "medicineInfo":
    case "notifiTakingList":
      // 이 필드들은 유효성 검사가 필요하지 않음
      break;

    default:
      // 다른 필드들에 대한 기본 검사
      break;
  }
  return errors;
};

export const validateMedication = (med: Medication): string[] => {
  const byField = (Object.keys(med) as (keyof Medication)[]).flatMap((field) =>
    validateField(med, field)
  );

  const cross = [
    ...validateField(med, "dateRange"),
    ...validateField(med, "takingTypeRequired"),
  ];
  return [...byField, ...cross];
};

export const useMedicationForm = (
  selected: MedicineInfo,
  initialValues?: Partial<Medication>
) => {
  const [medication, setMedication] = useState<Medication>(() => {
    //임시 id 때문에 (고유 id가 없어서)
    // 임시 ID인 경우 고유한 ID로 변경 (컴포넌트 마운트 시 한 번만 실행)
    let medicineInfoWithUniqueId = selected;

    if (selected.id.startsWith("temp-")) {
      // 이미 고유한 ID가 있는지 확인
      if (selected.id === "temp-default") {
        medicineInfoWithUniqueId = {
          ...selected,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
      } else {
        // 이미 고유한 ID가 있으면 그대로 사용
        medicineInfoWithUniqueId = selected;
      }
    }
    //

    const baseMedication = createInitialMedication(medicineInfoWithUniqueId);
    if (initialValues) {
      return { ...baseMedication, ...initialValues };
    }
    return baseMedication;
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const getSelectedDays = (): string[] => {
    if (medication.takingType === TakingType.PARTICULAR_DAY) {
      return convertBinaryToDays(medication.interval ?? 0);
    }
    return [];
  };

  const updateSelectedDays = (days: string[]) => {
    const binaryValue = convertDaysToBinary(days);
    updateField("interval", binaryValue ?? 0);
  };

  const updateField = <K extends keyof Medication>(
    field: K,
    value: Medication[K]
  ) => {
    setMedication((prevMedication) => {
      const next = { ...prevMedication, [field]: value };

      if (field === "takingType") {
        if (value === TakingType.PARTICULAR_DAY) {
          next.interval = 0;
        } else if (value === TakingType.PARTICULAR_INTERVAL) {
          next.interval = 0;
        }
      }

      if (field === "specificDateList") {
        next.specificDateList = value as string[];
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: validateField(next, field),

        dateRange:
          field === "startAt" || field === "endAt"
            ? validateField(next, "dateRange")
            : prevErrors.dateRange || [],

        takingTypeRequired:
          field === "takingType"
            ? validateField(next, "takingTypeRequired")
            : prevErrors.takingTypeRequired || [],

        interval:
          field === "takingType" || field === "interval"
            ? validateField(next, "interval")
            : prevErrors.interval || [],

        specificDateList:
          field === "takingType" || field === "specificDateList"
            ? validateField(next, "specificDateList")
            : prevErrors.specificDateList || [],
      }));
      return next;
    });
  };

  const validateForm = () => {
    setSubmitted(true);
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    (Object.keys(medication) as (keyof Medication)[]).forEach((field) => {
      const fieldErrors = validateField(medication, field);
      if (fieldErrors.length > 0) {
        isValid = false;
        allErrors[field] = fieldErrors;
      }
    });

    const dateErr = validateField(medication, "dateRange");
    if (dateErr.length > 0) {
      isValid = false;
      allErrors.dateRange = dateErr;
    }

    const takingTypeErr = validateField(medication, "takingTypeRequired");
    if (takingTypeErr.length > 0) {
      isValid = false;
      allErrors.takingTypeRequired = takingTypeErr;
    }

    setErrors(allErrors);
    return { isValid, errors: allErrors };
  };

  return {
    medication,
    errors,
    submitted,
    getSelectedDays,
    updateSelectedDays,
    updateField,
    validateField,
    validateForm,
    isValid: Object.values(errors).every((e) => e.length === 0),
  };
};
