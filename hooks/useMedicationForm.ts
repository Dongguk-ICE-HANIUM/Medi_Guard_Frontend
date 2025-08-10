import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";
import { useState } from "react";

// 상수 정의
const VALID_DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const MAX_INTERVAL = 365;

// 기본값
const MEDICATION_DEFAULTS: Omit<Medication, "id" | "name"> = {
  startAt: "",
  endAt: "",
  takingType: TakingType.DAILY,
  interval: 1,
  particularDate: [],
  perDay: 1,
  amount: 1.0,
  isActive: true,
  groupName: "",
};

// 날짜 비교 유틸리티 함수
const isDateRangeValid = (startAt: string, endAt: string): boolean => {
  if (!startAt || !endAt) return true;
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  return startDate <= endDate;
};

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

// 초기 약물 데이터 생성
export const createInitialMedication = (
  medicineInfo: SelectedMedicineInfo
): Medication => ({
  ...MEDICATION_DEFAULTS,
  id: medicineInfo.id,
  name: medicineInfo.name,
});

// 약물데이터 유효성 검사
export const validateField = (
  med: Medication,
  field: keyof Medication
): string[] => {
  const errors: string[] = [];

  switch (field) {
    case "startAt":
      if (!med.startAt) {
        errors.push("복용 시작일이 필요합니다.");
      }
      break;
    case "endAt":
      if (!med.endAt) {
        errors.push("복용 종료일이 필요합니다.");
      }
      if (!isDateRangeValid(med.startAt, med.endAt)) {
        errors.push("종료일은 시작일 이후여야 합니다.");
      }
      break;
    case "takingType":
      if (!med.takingType) {
        errors.push("복용 주기가 필요합니다.");
      } else {
        switch (med.takingType) {
          case TakingType.DAILY:
            break;
          case TakingType.SPECIFIC_INTERVAL:
            if (!med.interval || med.interval < 1) {
              errors.push(
                "특정 날짜 간격으로 복용할 경우, 간격(일 수)을 입력해주세요."
              );
            }
            if (med.interval > MAX_INTERVAL) {
              errors.push(`간격은 ${MAX_INTERVAL}일을 초과할 수 없습니다.`);
            }
            break;
          case TakingType.SPECIFIC_DAY:
            if (!med.particularDate || med.particularDate.length === 0) {
              errors.push("복용할 요일을 선택해주세요.");
            }
            const invalidDays = med.particularDate?.filter(
              (day) => !VALID_DAYS.includes(day as (typeof VALID_DAYS)[number])
            );
            if (invalidDays && invalidDays.length > 0) {
              errors.push("올바르지 않은 요일이 선택되었습니다.");
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
          default:
            errors.push("복용 주기를 선택해주세요.");
        }
      }
      break;
  }
  return errors;
};

export const validateMedication = (med: Medication): string[] => {
  return (Object.keys(med) as (keyof Medication)[]).flatMap((field) =>
    validateField(med, field)
  );
};

export const useMedicationForm = (selected: SelectedMedicineInfo) => {
  const [medication, setMedication] = useState<Medication>(
    createInitialMedication(selected)
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateField = <K extends keyof Medication>(
    field: K,
    value: Medication[K]
  ) => {
    setMedication((prevMedication) => {
      const newMedication = { ...prevMedication, [field]: value };
      const fieldErrors = validateField(newMedication, field);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldErrors }));

      return newMedication;
    });
  };

  const validateForm = () => {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    (Object.keys(medication) as (keyof Medication)[]).forEach((field) => {
      const fieldErrors = validateField(medication, field);
      if (fieldErrors.length > 0) {
        isValid = false;
        allErrors[field] = fieldErrors;
      }
    });
    setErrors(allErrors);
    return { isValid, errors: allErrors };
  };

  return {
    medication,
    errors,
    updateField,
    validateField,
    validateForm,
    isValid: Object.values(errors).every((e) => e.length === 0),
  };
};
