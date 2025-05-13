import { Text, TextProps, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Typography";

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof typeof Typography;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  const baseStyle = Typography[type] as TextStyle;

  return (
    <Text
      style={[
        { color: themeColor },
        baseStyle,
        style, // override style if passed
      ]}
      {...rest}
    />
  );
}
