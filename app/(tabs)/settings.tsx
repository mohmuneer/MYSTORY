import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useAppStore } from "@/stores/appStore";
import { AI_MODELS, ART_STYLES, COLORS } from "@/constants";

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, language, setLanguage } = useAppStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>⚙️ الإعدادات</Text>

      {/* Dark Mode */}
      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>🌙 الوضع الليلي</Text>
          <Text style={styles.settingDesc}>تبديل بين الوضع الليلي والنهاري</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor="#f4f3f4"
        />
      </View>

      {/* AI Model */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 نموذج الذكاء</Text>
        {AI_MODELS.map((model) => (
          <TouchableOpacity key={model.id} style={styles.optionCard}>
            <Text style={styles.optionName}>{model.name}</Text>
            <Text style={styles.optionDesc}>{model.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Art Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 أسلوب الرسوم</Text>
        <View style={styles.styleGrid}>
          {ART_STYLES.map((style) => (
            <TouchableOpacity key={style.id} style={styles.styleCard}>
              <Text style={styles.styleEmoji}>{style.emoji}</Text>
              <Text style={styles.styleName}>{style.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 اللغة</Text>
        {["العربية", "English", "Français", "Türkçe"].map((lang) => (
          <TouchableOpacity key={lang} style={styles.optionCard}>
            <Text style={styles.optionName}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ حول التطبيق</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>حكايتي AI - MyStory Studio</Text>
          <Text style={styles.infoText}>الإصدار: 1.0.0</Text>
          <Text style={styles.infoText}>يعمل بالكامل بدون إنترنت</Text>
          <Text style={styles.infoText}>جميع البيانات محفوظة محلياً</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.white, marginTop: 50, marginBottom: 20 },
  settingRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  settingLabel: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
  settingDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.white, marginBottom: 12 },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  optionName: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  optionDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  styleGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  styleCard: {
    width: "30%",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  styleEmoji: { fontSize: 24, marginBottom: 4 },
  styleName: { fontSize: 11, color: COLORS.white },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16 },
  infoText: { fontSize: 13, color: COLORS.textMuted, marginBottom: 4 },
});
