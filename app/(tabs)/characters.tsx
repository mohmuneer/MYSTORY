import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useCharacterStore } from "@/stores/characterStore";
import { COLORS } from "@/constants";

export default function CharactersScreen() {
  const router = useRouter();
  const { characters } = useCharacterStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>👤 الشخصيات</Text>
      <Text style={styles.subtitle}>أنشئ شخصيات لقصصك</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/character/new")}>
        <Text style={styles.addEmoji}>+</Text>
        <Text style={styles.addText}>شخصية جديدة</Text>
      </TouchableOpacity>

      {characters.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🎭</Text>
          <Text style={styles.emptyText}>لم تنشئ أي شخصية بعد</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {characters.map((char) => (
            <View key={char.id} style={styles.charCard}>
              {char.photo ? (
                <Image source={{ uri: char.photo }} style={styles.charPhoto} />
              ) : (
                <View style={styles.charPhotoPlaceholder}>
                  <Text style={styles.charInitial}>{char.name.charAt(0)}</Text>
                </View>
              )}
              <Text style={styles.charName}>{char.name}</Text>
              {char.personality && (
                <Text style={styles.charPersonality} numberOfLines={1}>
                  {char.personality}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.white, marginTop: 50 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  addButton: {
    flexDirection: "row-reverse",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  addEmoji: { fontSize: 20, color: COLORS.white },
  addText: { fontSize: 14, fontWeight: "bold", color: COLORS.white },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
  grid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 12 },
  charCard: {
    width: "47%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  charPhoto: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  charPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(139,92,246,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  charInitial: { fontSize: 28, fontWeight: "bold", color: COLORS.white },
  charName: { fontSize: 14, fontWeight: "bold", color: COLORS.white },
  charPersonality: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
