import { TextStyle } from "react-native";

export const Typography: Record<string, TextStyle> = {
  title: {
    fontSize: 36,
    fontWeight: "600",
    fontFamily: "SpaceMono",
    lineHeight: 42,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "SpaceMono",
    lineHeight: 30,
    textTransform: "capitalize",
  },
  default: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "SpaceMono",
    lineHeight: 21,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SpaceMono",
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "400",
    fontFamily: "SpaceMono",
    lineHeight: 20,
    opacity: 0.7,
  },
};
