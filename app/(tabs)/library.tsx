import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useStoryStore } from "@/stores/storyStore";
import { COLORS } from "@/constants";

export default function LibraryScreen() {
  const router = useRouter();
  const { stories } = useStoryStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📚 مكتبتي</Text>
      <Text style={styles.subtitle}>{stories.length} قصة</Text>

      {stories.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📖</Text>
          <Text style={styles.emptyText}>مكتبتك فارغة</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/story/new")}>
            <Text style={styles.addButtonText}>+ قصة جديدة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => router.push(`/story/${story.id}`)}
          >
            <View style={styles.storyHeader}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      story.status === "completed" ? "#10b98130" : "#8b5cf630",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        story.status === "completed" ? COLORS.success : COLORS.primary,
                    },
                  ]}
                >
                  {story.status === "completed" ? "مكتملة" : "مسودة"}
                </Text>
              </View>
            </View>
            <Text style={styles.storyPrompt} numberOfLines={2}>
              {story.prompt}
            </Text>
            <View style={styles.storyMeta}>
              {story.genre && <Text style={styles.metaItem}>🎭 {story.genre}</Text>}
              {story.style && <Text style={styles.metaItem}>🎨 {story.style}</Text>}
            </View>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.white, marginTop: 50 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginBottom: 16 },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: { color: COLORS.white, fontWeight: "bold" },
  storyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  storyHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storyTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "600" },
  storyPrompt: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, lineHeight: 20 },
  storyMeta: { flexDirection: "row-reverse", gap: 10, marginTop: 8 },
  metaItem: { fontSize: 12, color: COLORS.textMuted },
});
