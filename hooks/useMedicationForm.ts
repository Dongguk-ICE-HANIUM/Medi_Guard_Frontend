import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";
import { useState } from "react";

//기본값
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

//초기 약물 데이터 생성
export const createInitialMedication = (
  medicineInfo: SelectedMedicineInfo
): Medication => ({
  ...MEDICATION_DEFAULTS,
  id: medicineInfo.id,
  name: medicineInfo.name,
});

//약물데이터 유효성 검사
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
      if (med.startAt && med.endAt) {
        const startDate = new Date(med.startAt);
        const endDate = new Date(med.endAt);
        if (startDate > endDate) {
          errors.push("종료일은 시작일 이후여야 합니다.");
        }
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
            if (med.interval > 365) {
              errors.push("간격은 365일을 초과할 수 없습니다.");
            }
            break;
          case TakingType.SPECIFIC_DAY:
            if (!med.particularDate || med.particularDate.length === 0) {
              errors.push("복용할 요일을 선택해주세요.");
            }
            const vaildDays = ["월", "화", "수", "목", "금", "토", "일"];
            const invaildDays = med.particularDate?.filter(
              (day) => !vaildDays.includes(day)
            );
            if (invaildDays && invaildDays.length > 0) {
              errors.push("올바르지 않은 요일이 선택되었습니다.");
            }
            break;
          case TakingType.SPECIFIC_DATE:
            if (!med.particularDate || med.particularDate.length === 0) {
              errors.push(
                "특정 날짜 복용 시 최소 하나 이상의 날짜를 선택해주세요."
              );
            }
            if (med.particularDate) {
              if (med.startAt && med.endAt) {
                const startDate = new Date(med.startAt);
                const endDate = new Date(med.endAt);
                const outOfRange = med.particularDate.filter((dateStr) => {
                  const date = new Date(dateStr);
                  return date < startDate || date > endDate;
                });
                if (outOfRange.length > 0) {
                  errors.push("복용 기간 내에서 날짜를 선택해주세요.");
                }
              }
            }
            break;

          case TakingType.NEED:
            break;

          default:
            errors.push("복약 주기를 선택해주세요.");
        }
      }
  }
  return errors;
};

export const vaildateMedication = (med: Medication): string[] => {
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
    const newMedication = { ...medication, [field]: value };
    setMedication(newMedication);

    const fieldErrors = validateField(newMedication, field);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors }));
  };

  const validateForm = () => {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    (Object.keys(medication) as (keyof Medication)[]).forEach((field) => {
      const errs = validateField(medication, field);
      if (errs.length > 0) {
        isValid = false;
        allErrors[field] = errs;
      }
    });
    setErrors(allErrors);
    return { isValid, erros: allErrors };
  };

  return {
    medication,
    errors,
    updateField,
    validateField,
    validateForm,
    isVaild: Object.values(errors).every((e) => e.length === 0),
  };
};
