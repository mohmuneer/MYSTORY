import "../../global.css";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={styles.icon}>{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "المكتبة",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📚" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: "الشخصيات",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1a0a2e",
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "rgba(139,92,246,0.2)",
  },
  icon: {
    fontSize: 20,
  },
});
