import { mockAppointmentApi } from "@/api/appointment";
import { useCallback } from "react";
import { useAppointmentContext } from "../context/AppointmentContext";

//다음 진료
export const useNextAppointment = () => {
  const { state, dispatch } = useAppointmentContext();

  const fetchNextAppointment = useCallback(async () => {
    dispatch({ type: "FETCH_NEXT_APPOINTMENT" });

    try {
      const response = await mockAppointmentApi.getNextAppointment();

      if (response.errorCode) {
        dispatch({
          type: "FETCH_NEXT_APPOINTMENT_ERROR",
          payload: response.message,
        });
        return;
      }

      if (response.result) {
        dispatch({
          type: "FETCH_NEXT_APPOINTMENT_SUCCESS",
          payload: response.result,
        });
      } else {
        dispatch({
          type: "FETCH_NEXT_APPOINTMENT_ERROR",
          payload: "데이터를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      dispatch({
        type: "FETCH_NEXT_APPOINTMENT_ERROR",
        payload: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    }
  }, [dispatch]);

  return {
    nextAppointment: state.nextAppointment,
    loading: state.nextLoading,
    error: state.nextError,
    fetchNextAppointment,
  };
};

//진료 이력
export const useAppointmentHistory = () => {
  const { state, dispatch } = useAppointmentContext();

  const fetchAppointmentHistory = useCallback(async () => {
    dispatch({ type: "FETCH_HISTORY" });

    try {
      const response = await mockAppointmentApi.getAppointmentHistory();

      if (response.errorCode) {
        dispatch({ type: "FETCH_HISTORY_ERROR", payload: response.message });
        return;
      }

      if (response.result) {
        dispatch({
          type: "FETCH_HISTORY_SUCCESS",
          payload: response.result.scheduleList,
        });
      } else {
        dispatch({
          type: "FETCH_HISTORY_ERROR",
          payload: "데이터를 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      dispatch({
        type: "FETCH_HISTORY_ERROR",
        payload: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    }
  }, [dispatch]);

  return {
    appointmentHistory: state.historyList,
    loading: state.historyLoading,
    error: state.historyError,
    fetchAppointmentHistory,
  };
};

//진료 상세
export const useAppointmentDetail = () => {
  const { state, dispatch } = useAppointmentContext();

  const fetchAppointmentDetail = useCallback(
    async (scheduleId: number) => {
      dispatch({ type: "FETCH_DETAIL" });

      try {
        const response = await mockAppointmentApi.getAppointmentDetail(
          scheduleId
        );

        if (response.errorCode) {
          dispatch({ type: "FETCH_DETAIL_ERROR", payload: response.message });
        } else if (response.result) {
          dispatch({ type: "FETCH_DETAIL_SUCCESS", payload: response.result });
        } else {
          dispatch({
            type: "FETCH_DETAIL_ERROR",
            payload: "데이터를 찾을 수 없습니다.",
          });
        }
      } catch (error) {
        dispatch({
          type: "FETCH_DETAIL_ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
        });
      }
    },
    [dispatch]
  );

  const clearAppointmentDetail = useCallback(() => {
    dispatch({ type: "CLEAR_DETAIL" });
  }, [dispatch]);

  return {
    appointmentDetail: state.appointmentDetail,
    loading: state.appointmentDetailLoading,
    error: state.appointmentDetailError,
    fetchAppointmentDetail,
    clearAppointmentDetail,
  };
};

//진료 시작
export const useStartConsultation = () => {
  const { state, dispatch } = useAppointmentContext();

  const startConsultation = useCallback(
    async (scheduleId: number) => {
      dispatch({ type: "START_CONSULTATION" });

      try {
        const response = await mockAppointmentApi.startConsultation(scheduleId);

        if (response.errorCode) {
          dispatch({
            type: "START_CONSULTATION_ERROR",
            payload: response.message,
          });
        } else if (response.result) {
          dispatch({
            type: "START_CONSULTATION_SUCCESS",
            payload: response.result.code,
          });
        } else {
          dispatch({
            type: "START_CONSULTATION_ERROR",
            payload: "데이터를 찾을 수 없습니다.",
          });
        }
      } catch (error) {
        dispatch({
          type: "START_CONSULTATION_ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
        });
      }
    },
    [dispatch]
  );

  const clearConsultationCode = useCallback(() => {
    dispatch({ type: "CLEAR_CONSULTATION_CODE" });
  }, [dispatch]);

  return {
    consultationCode: state.consultationCode,
    loading: state.consultationLoading,
    error: state.consultationError,
    startConsultation,
    clearConsultationCode,
  };
};

// 현재 진행 중인 진료 관리
export const useCurrentSchedule = () => {
  const { state, dispatch } = useAppointmentContext();

  const setCurrentScheduleId = useCallback((scheduleId: number) => {
    dispatch({ type: "SET_CURRENT_SCHEDULE_ID", payload: scheduleId });
  }, [dispatch]);

  const clearCurrentScheduleId = useCallback(() => {
    dispatch({ type: "CLEAR_CURRENT_SCHEDULE_ID" });
  }, [dispatch]);

  return {
    currentScheduleId: state.currentScheduleId,
    setCurrentScheduleId,
    clearCurrentScheduleId,
  };
};

// 통합
export const useAppointment = () => {
  const todayNext = useNextAppointment();
  const history = useAppointmentHistory();
  const detail = useAppointmentDetail();
  const consultation = useStartConsultation();
  const currentSchedule = useCurrentSchedule();

  return {
    todayNext,
    history,
    detail,
    consultation,
    currentSchedule,
  };
};
