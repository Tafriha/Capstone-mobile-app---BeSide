import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { Typography } from "@/constants/Typography";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();


  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#FFF0EB", "#FAD4C0", "#EBB7AD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ThemedText style={Typography.title}>BeSide</ThemedText>

        <ThemedText style={[Typography.subtitle, styles.subtitle]}>
          With You Every Mile, Every Moment
        </ThemedText>

        <View style={styles.buttonWrapper}>
          <ThemedButton
            title="Login"
            type="primary"
            onPress={() => router.push("/login")}
            style={styles.button}
          />
          <ThemedButton
            title="Register"
            type="outline"
            onPress={() => router.push("/register")}
            style={styles.button}
          />
        </View>

        <ThemedText style={[Typography.caption, styles.reassurance]}>
          Your privacy is respected. Your safety is our priority.
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 60 : 100,
    marginBottom: 40,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginTop: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
    maxWidth: 320,
    lineHeight: 22,
  },
  reassurance: {
    marginTop: 24,
    marginBottom: 12,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    marginVertical: 8,
  },
});
