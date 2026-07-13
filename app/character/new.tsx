import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "@/stores/appStore";
import { useCharacterStore } from "@/stores/characterStore";
import { COLORS } from "@/constants";

export default function NewCharacterScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const { addCharacter } = useCharacterStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");

  function handleCreate() {
    if (!name.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال اسم الشخصية");
      return;
    }

    const newChar = {
      id: `char_${Date.now()}`,
      userId: user?.id || "",
      name: name.trim(),
      description: description.trim() || null,
      age: age ? parseInt(age) : null,
      personality: personality.trim() || null,
      appearance: appearance.trim() || null,
      photo: null,
      embedding: null,
      createdAt: new Date().toISOString(),
    };

    addCharacter(newChar);
    router.back();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.label}>👤 اسم الشخصية</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="اسم الشخصية..."
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>📝 الوصف</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="وصف الشخصية..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🎂 العمر</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="العمر..."
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>🧠 الشخصية</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={personality}
          onChangeText={setPersonality}
          placeholder="صف الشخصية... شجاع، ذكي، لطيف"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>👀 الملامح</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={appearance}
          onChangeText={setAppearance}
          placeholder="وصف الملامح... شعر طويل، عيون زرقاء"
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>✨ إنشاء الشخصية</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
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
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  createButtonText: { fontSize: 18, fontWeight: "bold", color: COLORS.white },
});
