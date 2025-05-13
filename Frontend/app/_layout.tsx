import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent splash from hiding early
SplashScreen.preventAutoHideAsync();

// Light and Dark Themes
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";

// Custom Themes
const MyLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#FBE6DA",
    primary: "#2DB5A9",
    secondary: "#8BE4DB",
    accent: "#EBB7AD",
    info: "#659B5E",
    text: "#282C3E",
    border: "#DDDBe5",
    notification: "#77141F",
  },
};

const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#282C3E",
    primary: "#8BE4DB",
    secondary: "#2DB5A9",
    accent: "#EBB7AD",
    info: "#2EC4B6",
    text: "#FBE6DA",
    border: "#38231A",
    notification: "#77141F",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={
          colorScheme === "dark"
            ? MyDarkTheme.colors.background
            : MyLightTheme.colors.background
        }
      />
    </ThemeProvider>
  );
}
