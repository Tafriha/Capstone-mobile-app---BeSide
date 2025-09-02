import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Platform,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Typography";

type ButtonType = "primary" | "secondary" | "danger" | "success" | "warning" | "outline";

interface ThemedButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  testID?: string;
}

export function ThemedButton({
  title,
  onPress,
  type = "primary",
  style,
  textStyle,
  disabled = false,
  testID,
}: ThemedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = useThemeColor(
    {},
    disabled ? "muted" : type === "outline" ? "background" : type
  );
  const hoverBackground = useThemeColor({}, type === "outline" ? "background" : "secondary");
  const textColor = useThemeColor({}, disabled ? "muted" : type === "outline" ? "primary" : "surface");
  const borderColor = useThemeColor({}, disabled ? "muted" : type === "outline" ? "primary" : "background");

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      android_ripple={
        Platform.OS === "android" ? { color: "#00000022", radius: 140, borderless: false } : undefined
      }
      hitSlop={8}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isHovered ? hoverBackground : backgroundColor,
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <Text style={[Typography.defaultSemiBold, { color: textColor }, textStyle]}>{title}</Text>
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
  },
  pressed: { opacity: 0.85 },
});
