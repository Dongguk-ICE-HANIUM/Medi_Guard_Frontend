import { getAppointmentDetail, getAppointmentHistory, getNextAppointment, saveAppointment, startConsultation } from "@/api/appointment";
import { SaveAppointmentRequest } from "@/types/doctor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from 'zustand';

export const appointmentQueryKeys = {
  all : ['appointment'] as const,
  nextAppointment: () => [...appointmentQueryKeys.all, 'next'] as const,
  history: () => [...appointmentQueryKeys.all, 'history'] as const,
  detail: (scheduleId: string) => [...appointmentQueryKeys.all, 'detail', scheduleId] as const,
  startConsultation: (scheduleId: string) => [...appointmentQueryKeys.all, 'start', scheduleId] as const,
};

//쿼리 무효화 유틸리티 훅
export const useRefreshAppointmentData = () => {
  const queryClient = useQueryClient();

  return {
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all });
    },
    refreshNext: () => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.nextAppointment() });
    },
    refreshHistory: () => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.history() });
    },
    refreshDetail: (scheduleId: string) => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.detail(scheduleId) });
    },
  };
};

//예정된 진료 저장
export const useSaveAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: SaveAppointmentRequest) => {
      const response = await saveAppointment(appointmentData);
      if (response.errorCode) {
        throw new Error(response.message);
      }
      if (!response.result) {
        throw new Error("데이터를 찾을 수 없습니다.");
      }
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:appointmentQueryKeys.nextAppointment()});
    },
    onError: (error) => {
      console.error("진료 저장 실패:", error);
    },  
  })
};

//오늘(다음)의 진료 일정 조회
export const useNextAppointment = () => {
  return useQuery({
    queryKey: appointmentQueryKeys.nextAppointment(),
    queryFn : async () => {
      const response = await getNextAppointment();

      if(response.errorCode){
        throw new Error(response.message);
      }
      if(!response.result){
        throw new Error("데이터를 찾을 수 없습니다.");
      }
      return response.result;
    },
    staleTime: 5 * 60 * 1000,
    retry : 2, 
  });
};
  
//완료된 진료 이력 조회
export const useAppointmentHistory = () => {
  return useQuery({
    queryKey: appointmentQueryKeys.history(),
    queryFn: async () => {
      const response = await getAppointmentHistory();

      if (response.errorCode) {
        throw new Error(response.message);
      }
      if (!response.result) {
        throw new Error("데이터를 찾을 수 없습니다.");
      }
      return response.result.scheduleList;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
};

//진료 시작
export const useStartConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await startConsultation(scheduleId);

      if (response.errorCode) {
        throw new Error(response.message);
      }
      if (!response.result) {
        throw new Error("데이터를 찾을 수 없습니다.");
      }
      return response.result;
    },
    onSuccess: (data, scheduleId) => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.detail(scheduleId) });
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.nextAppointment() });
    },
    onError: (error) => {
      console.error("진료 시작 실패:", error);
    }
  });
};

//진료 이력 상세보기
export const useAppointmentDetail = (scheduleId: string, enabled : boolean = true) => {
  return useQuery({
    queryKey: appointmentQueryKeys.detail(scheduleId),
    queryFn: async () => {
      const response = await getAppointmentDetail(scheduleId);

      if (response.errorCode) {
        throw new Error(response.message);
      }
      if (!response.result) {
        throw new Error("데이터를 찾을 수 없습니다.");
      }
      return response.result;
    },
    enabled: enabled && scheduleId !== '',
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

//코드 인증 확인







// 현재 진행 중인 진료 상태 관리
interface CurrentScheduleStore {
  currentScheduleId: string | null;
  consultationCode : string | null;
  setCurrentScheduleId: (id:string | null) => void;
  setConsultationCode : (code : string) => void;
  clearCurrentSchedule: () => void;
}

export const useCurrentScheduleStore = create<CurrentScheduleStore>((set) => ({
  currentScheduleId: null,
  consultationCode : null,
  setCurrentScheduleId: (id) => set({ currentScheduleId: id }),
  setConsultationCode : (code) => set({ consultationCode : code}),
  clearCurrentSchedule: () => set({ currentScheduleId: null, consultationCode : null }),
}));

