import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { initializeDatabase } from "@/database";
import { COLORS } from "@/constants";

export default function RootLayout() {
  const { isDarkMode, isRTL } = useAppStore();

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="story/new"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "قصة جديدة",
            headerTintColor: COLORS.white,
            headerStyle: { backgroundColor: COLORS.background },
          }}
        />
        <Stack.Screen
          name="story/[id]"
          options={{
            headerShown: true,
            headerTitle: "",
            headerTintColor: COLORS.white,
            headerStyle: { backgroundColor: COLORS.background },
          }}
        />
        <Stack.Screen
          name="character/new"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "شخصية جديدة",
            headerTintColor: COLORS.white,
            headerStyle: { backgroundColor: COLORS.background },
          }}
        />
      </Stack>
    </View>
  );
}
