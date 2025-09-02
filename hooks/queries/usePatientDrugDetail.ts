import { fetchDrugDetail } from "@/api/medicine";
import { DrugDetailResponse } from "@/types/medication";
import { useQuery } from "@tanstack/react-query";

export const usePatientDrugDetail = (patientDrugId: string) => {
  return useQuery<DrugDetailResponse, Error>({
    queryKey: ["patientDrugDetail", patientDrugId],
    queryFn: () => fetchDrugDetail(patientDrugId),
    enabled: !!patientDrugId, // patientDrugId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하다고 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (React Query v5)
  });
};
