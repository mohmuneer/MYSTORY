import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStoryStore } from "@/stores/storyStore";
import { useCharacterStore } from "@/stores/characterStore";
import { COLORS } from "@/constants";

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stories } = useStoryStore();
  const { characters } = useCharacterStore();

  const story = stories.find((s) => s.id === id);
  const character = story?.characterId
    ? characters.find((c) => c.id === story.characterId)
    : null;

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>القصة غير موجودة</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{story.title}</Text>
        <View style={styles.metaRow}>
          {story.genre && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎭 {story.genre}</Text>
            </View>
          )}
          {story.style && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎨 {story.style}</Text>
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {story.status === "completed" ? "✅ مكتملة" : "⏳ مسودة"}
            </Text>
          </View>
        </View>
      </View>

      {/* Character */}
      {character && (
        <View style={styles.characterCard}>
          <Text style={styles.sectionLabel}>👤 الشخصية الرئيسية</Text>
          <Text style={styles.characterName}>{character.name}</Text>
          {character.personality && (
            <Text style={styles.characterPersonality}>{character.personality}</Text>
          )}
        </View>
      )}

      {/* Scenes */}
      {story.scenes && story.scenes.length > 0 ? (
        <View style={styles.scenesSection}>
          <Text style={styles.sectionLabel}>🎬 المشاهد ({story.scenes.length})</Text>
          {story.scenes
            .sort((a, b) => a.sceneNumber - b.sceneNumber)
            .map((scene) => (
              <View key={scene.id} style={styles.sceneCard}>
                <View style={styles.sceneHeader}>
                  <View style={styles.sceneNumber}>
                    <Text style={styles.sceneNumberText}>{scene.sceneNumber}</Text>
                  </View>
                  <Text style={styles.sceneTitle}>المشهد {scene.sceneNumber}</Text>
                </View>
                <Text style={styles.sceneText}>{scene.sceneText}</Text>
                {scene.imagePath && (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>🖼️ صورة المشهد</Text>
                  </View>
                )}
              </View>
            ))}
        </View>
      ) : (
        <View style={styles.fullStorySection}>
          <Text style={styles.sectionLabel}>📖 القصة كاملة</Text>
          <View style={styles.storyCard}>
            <Text style={styles.storyText}>{story.storyText}</Text>
          </View>
        </View>
      )}

      {/* Export */}
      <View style={styles.exportSection}>
        <Text style={styles.sectionLabel}>📤 التصدير</Text>
        <View style={styles.exportGrid}>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportEmoji}>📄</Text>
            <Text style={styles.exportLabel}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportEmoji}>📚</Text>
            <Text style={styles.exportLabel}>EPUB</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportEmoji}>🎬</Text>
            <Text style={styles.exportLabel}>فيديو</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportEmoji}>🔊</Text>
            <Text style={styles.exportLabel}>صوتي</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  errorText: { fontSize: 18, color: COLORS.textMuted, textAlign: "center", marginTop: 100 },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.white },
  metaRow: { flexDirection: "row-reverse", gap: 8, marginTop: 10 },
  badge: {
    backgroundColor: "rgba(139,92,246,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: COLORS.textMuted },
  characterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionLabel: { fontSize: 16, fontWeight: "bold", color: COLORS.white, marginBottom: 12 },
  characterName: { fontSize: 18, fontWeight: "bold", color: COLORS.primary },
  characterPersonality: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  scenesSection: { marginBottom: 20 },
  sceneCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sceneHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 10 },
  sceneNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(139,92,246,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sceneNumberText: { fontSize: 13, fontWeight: "bold", color: COLORS.white },
  sceneTitle: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  sceneText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: { color: COLORS.textMuted, fontSize: 14 },
  fullStorySection: { marginBottom: 20 },
  storyCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16 },
  storyText: { fontSize: 15, color: COLORS.textMuted, lineHeight: 26 },
  exportSection: { marginBottom: 20 },
  exportGrid: { flexDirection: "row-reverse", gap: 10 },
  exportButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  exportEmoji: { fontSize: 22, marginBottom: 4 },
  exportLabel: { fontSize: 11, color: COLORS.white },
});
