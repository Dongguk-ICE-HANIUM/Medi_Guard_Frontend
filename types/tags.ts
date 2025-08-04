import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
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

export const tagIcons = {
  pillTaken: {
    Icon: FontAwesome6,
    name: "circle-check",
  },
  pillMissed: {
    Icon: Feather,
    name: "x-circle",
  },
  sideEffect: {
    Icon: Foundation,
    name: "prohibited",
  },
  pillSchedule: {
    Icon: MaterialCommunityIcons,
    name: "calendar",
  },
  appointment: {
    Icon: FontAwesome,
    name: "hospital-o",
  },
};
