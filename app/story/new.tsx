import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/stores/appStore";
import { useStoryStore } from "@/stores/storyStore";
import { useCharacterStore } from "@/stores/characterStore";
import { COLORS, GENRES, ART_STYLES, DURATIONS, LANGUAGES } from "@/constants";

export default function NewStoryScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const { addStory, setGenerating, isGenerating } = useStoryStore();
  const { characters } = useCharacterStore();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [style, setStyle] = useState("pixar");
  const [language, setLanguage] = useState("ar");
  const [duration, setDuration] = useState("short");
  const [personality, setPersonality] = useState("");
  const [favoritePlaces, setFavoritePlaces] = useState("");
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  async function handleGenerate() {
    if (!title.trim() || !prompt.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال العنوان وفكر القصة");
      return;
    }

    setGenerating(true);

    try {
      const storyId = `story_${Date.now()}`;
      const sceneCount =
        DURATIONS.find((d) => d.id === duration)?.scenes || 5;
      const selectedStyle = ART_STYLES.find((s) => s.id === style);

      const scenes = generateDemoStory(
        prompt,
        user?.name || "البطل",
        sceneCount,
        selectedStyle?.name || "Pixar"
      );

      const newStory = {
        id: storyId,
        userId: user?.id || "",
        title,
        prompt,
        storyText: scenes.map((s) => s.text).join("\n\n"),
        genre,
        style,
        language,
        duration,
        status: "completed",
        coverImage: null,
        characterId: selectedCharId,
        seriesId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scenes: scenes.map((s, i) => ({
          id: `scene_${storyId}_${i}`,
          storyId,
          sceneNumber: i + 1,
          sceneText: s.text,
          imagePrompt: s.imagePrompt,
          imagePath: null,
          audioPath: null,
        })),
      };

      addStory(newStory);
      setGenerating(false);
      router.push(`/story/${storyId}`);
    } catch (error) {
      setGenerating(false);
      Alert.alert("خطأ", "حدث خطأ أثناء إنشاء القصة");
    }
  }

  function addInterest() {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  }

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري توليد القصة...</Text>
        <Text style={styles.loadingSubtext}>الذكاء الاصطناعي يعمل على كتابة قصتك</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>📝 عنوان القصة</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="عنوان قصتك..."
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Concept */}
      <View style={styles.section}>
        <Text style={styles.label}>💡 فكر القصة</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="صف فكرة القصة... مثال: طفل يكتشف عالم السحر"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Genre */}
      <View style={styles.section}>
        <Text style={styles.label}>🎭 النوع</Text>
        <View style={styles.chipRow}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, genre === g && styles.chipActive]}
              onPress={() => setGenre(g)}
            >
              <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Art Style */}
      <View style={styles.section}>
        <Text style={styles.label}>🎨 أسلوب الرسوم</Text>
        <View style={styles.chipRow}>
          {ART_STYLES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.chip, style === s.id && styles.chipActive]}
              onPress={() => setStyle(s.id)}
            >
              <Text style={[styles.chipText, style === s.id && styles.chipTextActive]}>
                {s.emoji} {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>⏱️ المدة</Text>
        <View style={styles.chipRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.chip, duration === d.id && styles.chipActive]}
              onPress={() => setDuration(d.id)}
            >
              <Text style={[styles.chipText, duration === d.id && styles.chipTextActive]}>
                {d.emoji} {d.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.label}>🌐 اللغة</Text>
        <View style={styles.chipRow}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.chip, language === l.code && styles.chipActive]}
              onPress={() => setLanguage(l.code)}
            >
              <Text style={[styles.chipText, language === l.code && styles.chipTextActive]}>
                {l.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Character Selection */}
      {characters.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>👤 اختر الشخصية</Text>
          <View style={styles.chipRow}>
            {characters.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, selectedCharId === c.id && styles.chipActive]}
                onPress={() => setSelectedCharId(c.id)}
              >
                <Text style={[styles.chipText, selectedCharId === c.id && styles.chipTextActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.label}>⭐ الاهتمامات</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newInterest}
            onChangeText={setNewInterest}
            placeholder="أضف اهتمام..."
            placeholderTextColor={COLORS.textMuted}
            onSubmitEditing={addInterest}
          />
          <TouchableOpacity style={styles.addButton} onPress={addInterest}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {interests.map((i) => (
            <TouchableOpacity
              key={i}
              style={styles.chip}
              onPress={() => setInterests(interests.filter((x) => x !== i))}
            >
              <Text style={styles.chipText}>✕ {i}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Personality */}
      <View style={styles.section}>
        <Text style={styles.label}>🧠 الشخصية</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={personality}
          onChangeText={setPersonality}
          placeholder="صف شخصية البطل... شجاع، ذكي، طموح"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Favorite Places */}
      <View style={styles.section}>
        <Text style={styles.label}>🏰 الأماكن المفضلة</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={favoritePlaces}
          onChangeText={setFavoritePlaces}
          placeholder="الغابة السحرية، المكتبة القديمة، الفضاء..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>✨ توليد القصة</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function generateDemoStory(
  prompt: string,
  heroName: string,
  sceneCount: number,
  style: string
) {
  const scenes = [
    {
      text: `في صباح مشرق جميل، استيقظ ${heroName} على صوت طيور تغني خارج نافذته. كان الطقس رائعاً والشمس تشرق بألوان ذهبية جميلة.`,
      imagePrompt: `${heroName} waking up in a colorful bedroom, morning light, ${style} style, warm colors`,
    },
    {
      text: `خرج ${heroName} من البيت ووجد صندوقاً غامضاً أمام الباب. كان الصندوق مغطى بنقوش غريبة ومتلألئة بألوان زاهية.`,
      imagePrompt: `${heroName} discovering a mysterious glowing box, magical atmosphere, ${style} style`,
    },
    {
      text: `فتح ${heroName} الصندوق بحذر ووجد خريطة قديمة تدل على مكان مخفي. كانت الخريطة مرسومة بألوان جميلة.`,
      imagePrompt: `${heroName} looking at an old magical map, enchanted forest background, ${style} style`,
    },
    {
      text: `دخل ${heroName} الغابة ووجد أشجاراً عملاقة يصل ارتفاعها إلى السماء. كانت الأضواء تتلألأ بين الأغصان.`,
      imagePrompt: `${heroName} in an enchanted forest with giant glowing trees, fairy lights, ${style} style`,
    },
    {
      text: `فجأة وجد ${heroName} صغيراً ملوناً يرفرف بأجنحته. كان من نوع لم يره من قبل. تRIENDLY成了 صديقاً سريعاً.`,
      imagePrompt: `${heroName} meeting a colorful magical creature, friendly expression, ${style} style`,
    },
    {
      text: `وصل ${heroName} إلى قلعة سحرية مهيبة بأبراج عالية وألوان زاهية. كانت القلعة تلمع في ضوء الشمس.`,
      imagePrompt: `${heroName} standing before a magnificent colorful castle, epic view, ${style} style`,
    },
    {
      text: `دخل ${heroName} القلعة ووجد في_center قاعة كبيرة مليئة بالكنوز والمفاجآت الرائعة.`,
      imagePrompt: `${heroName} inside a grand treasure hall, sparkling gems and books, ${style} style`,
    },
    {
      text: `اكتشف ${heroName} أن الكنز ليس ذهباً، بل كان كنز المعرفة والحكمة. كتاب يحتوي على أسرار السعادة.`,
      imagePrompt: `${heroName} reading a glowing magical book, wisdom light, ${style} style`,
    },
    {
      text: `عاد ${heroName} إلى البيت حاملاً الكنز الحقيقي: الحكمة والصداقات الجديدة. كان سعيداً جداً.`,
      imagePrompt: `${heroName} happily returning home with a glowing book, sunset, ${style} style`,
    },
    {
      text: `في تلك الليلة، نام ${heroName} وحلم بمغامرات جديدة. كان يعلم أن كل يوم يحمل مفاجأة جديدة.`,
      imagePrompt: `${heroName} sleeping peacefully with a smile, stars outside window, ${style} style`,
    },
  ];

  return scenes.slice(0, sceneCount);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: { fontSize: 20, fontWeight: "bold", color: COLORS.white, marginTop: 20 },
  loadingSubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: COLORS.white, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.white,
    fontSize: 14,
    textAlign: "right",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  inputRow: { flexDirection: "row-reverse", gap: 8, marginBottom: 8 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(139,92,246,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
  chipRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: "rgba(139,92,246,0.3)",
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.white, fontWeight: "600" },
  generateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonText: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
});
