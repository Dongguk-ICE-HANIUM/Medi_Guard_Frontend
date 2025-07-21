export interface TagInfo {
  type:
    | "pillTaken"
    | "pillMissed"
    | "sideEffect"
    | "pillSchedule"
    | "appointment";
  label: string;
  color: string;
}
