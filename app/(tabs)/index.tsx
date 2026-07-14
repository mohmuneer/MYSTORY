import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/stores/appStore";
import { useStoryStore } from "@/stores/storyStore";
import { COLORS } from "@/constants";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const { stories } = useStoryStore();

  const recentStories = stories.slice(0, 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>مرحباً {user?.name || "صاحب القصص"} 👋</Text>
          <Text style={styles.subtitle}>ما القصة التي ستكتبها اليوم؟</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || "📖"}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: "#7c3aed20" }]}
          onPress={() => router.push("/story/new")}
        >
          <Text style={styles.actionEmoji}>✨</Text>
          <Text style={styles.actionTitle}>قصة جديدة</Text>
          <Text style={styles.actionDesc}>ابدأ من الصفر</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: "#06b6d420" }]}
          onPress={() => router.push("/character/new")}
        >
          <Text style={styles.actionEmoji}>👤</Text>
          <Text style={styles.actionTitle}>شخصية جديدة</Text>
          <Text style={styles.actionDesc}>أنشئ بطل القصة</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>⚡ المميزات</Text>
        <View style={styles.featuresGrid}>
          {[
            { emoji: "🤖", title: "ذكاء محلي", desc: "بدون إنترنت" },
            { emoji: "🎨", title: "صور ذكية", desc: "توليد لكل مشهد" },
            { emoji: "📖", title: "قصص مصورة", desc: "PDF وفيديو" },
          ].map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Stories */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>📚 آخر القصص</Text>
        {recentStories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyText}>لا توجد قصص بعد</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/story/new")}
            >
              <Text style={styles.emptyButtonText}>أنشئ قصتك الأولى</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recentStories.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => router.push(`/story/${story.id}`)}
            >
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <View style={styles.storyMeta}>
                  {story.genre && <Text style={styles.storyGenre}>🎭 {story.genre}</Text>}
                  {story.style && <Text style={styles.storyGenre}>🎨 {story.style}</Text>}
                </View>
              </View>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      story.status === "completed"
                        ? COLORS.success
                        : story.status === "generating"
                        ? COLORS.accent
                        : COLORS.primary,
                  },
                ]}
              />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  greeting: { fontSize: 24, fontWeight: "bold", color: COLORS.white, textAlign: "right" },
  subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: "right", marginTop: 4 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.white, fontSize: 22, fontWeight: "bold" },
  actionsRow: { flexDirection: "row-reverse", gap: 12, marginBottom: 30 },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  actionEmoji: { fontSize: 32, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: "bold", color: COLORS.white },
  actionDesc: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  featuresSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.white, marginBottom: 12 },
  featuresGrid: { flexDirection: "row-reverse", gap: 10 },
  featureCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  featureEmoji: { fontSize: 24, marginBottom: 6 },
  featureTitle: { fontSize: 12, fontWeight: "bold", color: COLORS.white },
  featureDesc: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  recentSection: { marginBottom: 20 },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginBottom: 16 },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: { color: COLORS.white, fontWeight: "bold" },
  storyCard: {
    flexDirection: "row-reverse",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  storyInfo: { flex: 1 },
  storyTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
  storyMeta: { flexDirection: "row-reverse", gap: 10, marginTop: 4 },
  storyGenre: { fontSize: 12, color: COLORS.textMuted },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
