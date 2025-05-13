import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
  Platform,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Typography";

type ButtonType =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "outline";

interface ThemedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  type?: ButtonType;
  style?: ViewStyle;
  disabled?: boolean;
}

export function ThemedButton({
  title,
  onPress,
  type = "primary",
  style,
  disabled = false,
}: ThemedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = useThemeColor(
    {},
    disabled ? "muted" : type === "outline" ? "background" : type
  );

  const hoverBackground = useThemeColor(
    {},
    type === "outline" ? "background" : "secondary"
  );

  const textColor = useThemeColor(
    {},
    disabled ? "muted" : type === "outline" ? "primary" : "surface"
  );

  const borderColor = useThemeColor(
    {},
    disabled ? "muted" : type === "outline" ? "primary" : "background"
  );

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        styles.button,
        {
          backgroundColor: isHovered ? hoverBackground : backgroundColor,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text style={[Typography.defaultSemiBold, { color: textColor }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    transitionDuration: "200ms", // React Native Web support only
  } as ViewStyle,
});
