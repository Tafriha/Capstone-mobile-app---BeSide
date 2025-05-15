import React from "react";
import { View, StyleSheet, ViewStyle, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
}

export function ThemedCard({ children, style, title }: ThemedCardProps) {
  const backgroundColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      {title && (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
