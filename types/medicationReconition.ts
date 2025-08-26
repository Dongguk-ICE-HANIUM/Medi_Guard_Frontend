export interface RecognizedMedicineInfo {
  id: string;
  name: string;
  code: string;
  effect: string;
  warning: string;
  sideEffect: string;
  interaction: string;
  depositMethod: string;
  imageUri?: string;
}

export interface CameraState {
  isActive: boolean;
  isAnalyzing: boolean;
  capturedImage: string | null;
}

export interface AnalysisProgress {
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
}
