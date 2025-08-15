import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";
import { convertBinaryToDays, convertDaysToBinary } from "@/utils/dateUtils";
import { useState } from "react";

// 상수 정의
const VALID_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const MAX_INTERVAL = 365;

// 기본값
const MEDICATION_DEFAULTS: Omit<Medication, "id" | "name"> = {
  startAt: "",
  endAt: "",
  takingType: TakingType.UNSELECTED,
  interval: 0,
  particularDate: [],
  perDay: 1,
  amount: 1.0,
  isActive: true,
  groupName: "",
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
  medicineInfo: SelectedMedicineInfo
): Medication => ({
  ...MEDICATION_DEFAULTS,
  id: medicineInfo.id,
  name: medicineInfo.name,
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
        case TakingType.DAILY:
          break;
        case TakingType.SPECIFIC_INTERVAL:
          if (med.interval < 1) {
            errors.push("복용 간격을 1일 이상으로 설정해주세요.");
          }
          if (med.interval > MAX_INTERVAL) {
            errors.push(`간격은 ${MAX_INTERVAL}일을 초과할 수 없습니다.`);
          }
          break;
        case TakingType.SPECIFIC_DAY:
          if (med.interval === 0) {
            errors.push("복용할 요일을 선택해주세요.");
          }
          break;
        case TakingType.SPECIFIC_DATE:
          if (!med.particularDate || med.particularDate.length === 0) {
            errors.push(
              "특정 날짜 복용 시 최소 하나 이상의 날짜를 선택해주세요."
            );
          }
          if (med.particularDate && med.startAt && med.endAt) {
            const outOfRange = med.particularDate.filter(
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

export const useMedicationForm = (selected: SelectedMedicineInfo) => {
  const [medication, setMedication] = useState<Medication>(
    createInitialMedication(selected)
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);

  const getSelectedDays = (): string[] => {
    if (medication.takingType === TakingType.SPECIFIC_DAY) {
      return convertBinaryToDays(medication.interval);
    }
    return [];
  };

  const updateSelectedDays = (days: string[]) => {
    const binaryValue = convertDaysToBinary(days);
    updateField("interval", binaryValue);
  };

  const updateField = <K extends keyof Medication>(
    field: K,
    value: Medication[K]
  ) => {
    setMedication((prevMedication) => {
      const next = { ...prevMedication, [field]: value };

      if (field === "takingType") {
        if (value === TakingType.SPECIFIC_DAY) {
          next.interval = 0;
        } else if (value === TakingType.SPECIFIC_INTERVAL) {
          next.interval = 0;
        }
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

        particularDate:
          field === "takingType" || field === "particularDate"
            ? validateField(next, "particularDate")
            : prevErrors.particularDate || [],
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
