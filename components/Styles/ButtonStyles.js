import { colors } from "@/constants";
import { StyleSheet } from "react-native";

export const ButtonStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "semibold",
  },

  large: {
    width: "100%",
    height: 50,
  },
  small: {
    width: "50%",
    height: 42,
  },

  pink: {
    backgroundColor: colors.PINK,
    color: colors.BLACK,
  },
  gray: {
    backgroundColor: colors.BACK_GRAY,
    color: colors.BLACK,
  },
  pressed: {
    opacity: 0.8,
  },
});
