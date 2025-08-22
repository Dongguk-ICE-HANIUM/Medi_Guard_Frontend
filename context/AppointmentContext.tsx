import {
  AppointmentDetail,
  AppointmentHistoryItem,
  NextAppointment,
} from "@/types/doctor";
import { createContext, useContext, useReducer } from "react";

interface AppointmentState {
  //다음 진료
  nextAppointment: NextAppointment | null;
  nextLoading: boolean;
  nextError: string | null;

  //진료 이력
  historyList: AppointmentHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;

  //진료 상세
  appointmentDetail: AppointmentDetail | null;
  appointmentDetailLoading: boolean;
  appointmentDetailError: string | null;

  //진료 시작
  consultationCode: string | null;
  consultationLoading: boolean;
  consultationError: string | null;
}

type AppointmentAction =
  | { type: "FETCH_NEXT_APPOINTMENT" }
  | { type: "FETCH_NEXT_APPOINTMENT_SUCCESS"; payload: NextAppointment }
  | { type: "FETCH_NEXT_APPOINTMENT_ERROR"; payload: string }
  | { type: "FETCH_HISTORY" }
  | { type: "FETCH_HISTORY_SUCCESS"; payload: AppointmentHistoryItem[] }
  | { type: "FETCH_HISTORY_ERROR"; payload: string }
  | { type: "FETCH_DETAIL" }
  | { type: "FETCH_DETAIL_SUCCESS"; payload: AppointmentDetail }
  | { type: "FETCH_DETAIL_ERROR"; payload: string }
  | { type: "CLEAR_DETAIL" }
  | { type: "START_CONSULTATION" }
  | { type: "START_CONSULTATION_SUCCESS"; payload: string }
  | { type: "START_CONSULTATION_ERROR"; payload: string }
  | { type: "CLEAR_CONSULTATION_CODE" };

const initialState: AppointmentState = {
  nextAppointment: null,
  nextLoading: false,
  nextError: null,

  historyList: [],
  historyLoading: false,
  historyError: null,

  appointmentDetail: null,
  appointmentDetailLoading: false,
  appointmentDetailError: null,

  consultationCode: null,
  consultationLoading: false,
  consultationError: null,
};

const appointmentReducer = (
  state: AppointmentState,
  action: AppointmentAction
): AppointmentState => {
  switch (action.type) {
    case "FETCH_NEXT_APPOINTMENT":
      return {
        ...state,
        nextLoading: true,
        nextError: null,
      };
    case "FETCH_NEXT_APPOINTMENT_SUCCESS":
      return {
        ...state,
        nextLoading: false,
        nextError: null,
        nextAppointment: action.payload,
      };
    case "FETCH_NEXT_APPOINTMENT_ERROR":
      return {
        ...state,
        nextLoading: false,
        nextError: action.payload,
      };
    case "FETCH_HISTORY":
      return {
        ...state,
        historyLoading: true,
        historyError: null,
      };
    //진료 이력
    case "FETCH_HISTORY_SUCCESS":
      return {
        ...state,
        historyLoading: false,
        historyError: null,
        historyList: action.payload,
      };
    case "FETCH_HISTORY_ERROR":
      return {
        ...state,
        historyLoading: false,
        historyError: action.payload,
      };
    case "FETCH_DETAIL":
      return {
        ...state,
        appointmentDetailLoading: true,
        appointmentDetailError: null,
      };
    //진료 상세
    case "FETCH_DETAIL_SUCCESS":
      return {
        ...state,
        appointmentDetailLoading: false,
        appointmentDetailError: null,
        appointmentDetail: action.payload,
      };
    case "FETCH_DETAIL_ERROR":
      return {
        ...state,
        appointmentDetailLoading: false,
        appointmentDetailError: action.payload,
      };
    case "CLEAR_DETAIL":
      return {
        ...state,
        appointmentDetail: null,
        appointmentDetailLoading: false,
        appointmentDetailError: null,
      };
    //진료 시작
    case "START_CONSULTATION":
      return {
        ...state,
        consultationLoading: true,
        consultationError: null,
      };
    case "START_CONSULTATION_SUCCESS":
      return {
        ...state,
        consultationLoading: false,
        consultationError: null,
        consultationCode: action.payload,
      };
    case "START_CONSULTATION_ERROR":
      return {
        ...state,
        consultationLoading: false,
        consultationError: action.payload,
      };
    case "CLEAR_CONSULTATION_CODE":
      return {
        ...state,
        consultationCode: null,
        consultationLoading: false,
        consultationError: null,
      };
    default:
      return state;
  }
};

//context
interface AppointmentContextType {
  state: AppointmentState;
  dispatch: React.Dispatch<AppointmentAction>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

//provider
interface AppointmentProviderProps {
  children: React.ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};

//context hook
export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointmentContext must be used within an AppointmentProvider"
    );
  }
  return context;
};
