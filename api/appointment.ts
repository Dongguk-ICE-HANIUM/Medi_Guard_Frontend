import {
  AppointmentDetailResponse,
  AppointmentHistoryResponse,
  NextAppointmentResponse,
  SaveAppointmentRequest,
  SaveAppointmentResponse,
  StartConsultationResponse,
} from "@/types/doctor";
import apiClient from "./apiClient";


//예정된 진료 저장
export const saveAppointment = async(appointmentData : SaveAppointmentRequest) : Promise<SaveAppointmentResponse>=>{
  try{
    const response = await apiClient.post<SaveAppointmentResponse>('/api/schedules', appointmentData);
    console.log('새로운 진료 생성 성공', response.data);
    return response.data;
  }catch(error : any){
    console.error('새로운 진료 생성 실패', error);
    
    if(error?.response?.data){
      return { errorCode : error.response.data.errorCode || 'UNKNOWN_ERROR',
      message: error.response.data.message || '알수없는 오류가 발생했습니다.',
      result: null
      }
    }
    return { errorCode: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.', result: null };
}
}

//오늘(다음)의 진료 일정 조회
export const getNextAppointment = async (): Promise<NextAppointmentResponse> => {
  try{
    const response = await apiClient.get<NextAppointmentResponse>('/api/appointment/today');
    console.log('오늘의 진료 조회 성공', response.data);
    return response.data;

  } catch (error : any) {
    console.error('오늘의 진료 조회 실패', error);

    if(error?.response?.data){
      return { errorCode : error.response.data.errorCode || 'UNKNOWN_ERROR',
      message: error.response.data.message || '알수없는 오류가 발생했습니다.',
      result: null
      }
    }

    return { errorCode: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.', result: null };
  
  }
}
 
//완료된 진료 이력 조회
export const getAppointmentHistory = async (pageNumber : number = 1): Promise<AppointmentHistoryResponse> => {
  try{
    const response = await apiClient.get<AppointmentHistoryResponse>(`/api/schedules?page=${pageNumber}`);
    console.log('진료 이력 조회 성공', response.data);
    return response.data;
  }catch(error : any){
    console.error('진료 이력 조회 실패', error);

    if(error?.response?.data){
      return { errorCode : error.response.data.errorCode || 'UNKNOWN_ERROR',
      message: error.response.data.message || '알수없는 오류가 발생했습니다.',
      result: null
      }
    }

    return { errorCode: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.', result: null };

  }
}

//진료 시작
export const startConsultation = async (scheduleId: string): Promise<StartConsultationResponse> => {
  try{
    const response = await apiClient.post<StartConsultationResponse>(`/api/schedules/${scheduleId}`);
    console.log('진료 시작 성공', response.data);
    return response.data;
  }catch(error : any){
    console.error('진료 시작 실패', error);

    if(error?.response?.data){
      return { errorCode : error.response.data.errorCode || 'UNKNOWN_ERROR',
      message: error.response.data.message || '알수없는 오류가 발생했습니다.',
      result: null
      };
    }

    return { errorCode: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.', result: null };
  }
}

//진료 이력 상세보기
export const getAppointmentDetail = async (scheduleId : string): Promise<AppointmentDetailResponse> => {
  try{
    const response = await apiClient.get<AppointmentDetailResponse>(`/api/schedules/${scheduleId}`);
    console.log('진료 상세 조회 성공', response.data);
    return response.data; 
  }catch(error : any){
    console.error('진료 상세 조회 실패', error);

    if(error?.response?.data){
      return { errorCode : error.response.data.errorCode || 'UNKNOWN_ERROR',
      message: error.response.data.message || '알수없는 오류가 발생했습니다.',
      result: null
      };
    }

    return { errorCode: 'UNKNOWN_ERROR', message: '알 수 없는 오류가 발생했습니다.', result: null };
  }
}

//코드 인증 확인

