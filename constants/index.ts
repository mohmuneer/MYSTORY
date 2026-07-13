export const COLORS = {
  primary: "#8b5cf6",
  primaryLight: "#a78bfa",
  primaryDark: "#7c3aed",
  secondary: "#06b6d4",
  accent: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
  background: "#0f0720",
  surface: "rgba(255,255,255,0.05)",
  surfaceHover: "rgba(255,255,255,0.1)",
  border: "rgba(255,255,255,0.1)",
  text: "#f0e6ff",
  textMuted: "#a78bfa",
  white: "#ffffff",
  black: "#000000",
} as const;

export const AI_MODELS = [
  { id: "llama3.2", name: "Llama 3.2", desc: "نموذج متعدد اللغات" },
  { id: "gemma2", name: "Gemma 2", desc: "نموذج Google" },
  { id: "qwen2.5", name: "Qwen 2.5", desc: "نموذج عالمي" },
  { id: "phi-4", name: "Phi-4 Mini", desc: "نموذج Microsoft" },
] as const;

export const ART_STYLES = [
  { id: "pixar", name: "Pixar", emoji: "🎬" },
  { id: "disney", name: "ديزني", emoji: "🏰" },
  { id: "anime", name: "أنمي", emoji: "🎌" },
  { id: "comic", name: "قصص مصورة", emoji: "💥" },
  { id: "realistic", name: "واقعي", emoji: "📷" },
  { id: "3d", name: "ثلاثي الأبعاد", emoji: "🧊" },
] as const;

export const GENRES = [
  "مغامرة",
  "فانتازيا",
  "خيال علمي",
  "تعليمي",
  "كوميدي",
  "درامي",
  "رعب خفيف",
  "رومانسي",
] as const;

export const LANGUAGES = [
  { code: "ar", name: "العربية", dir: "rtl" as const },
  { code: "en", name: "English", dir: "ltr" as const },
  { code: "fr", name: "Français", dir: "ltr" as const },
  { code: "tr", name: "Türkçe", dir: "ltr" as const },
] as const;

export const DURATIONS = [
  { id: "short", name: "قصيرة", scenes: 5, emoji: "⚡" },
  { id: "medium", name: "متوسطة", scenes: 10, emoji: "📖" },
  { id: "long", name: "طويلة", scenes: 15, emoji: "📚" },
] as const;

export const STYLE_PROMPTS: Record<string, string> = {
  pixar: "Pixar style, 3D animation, vibrant colors, expressive characters, cinematic lighting",
  disney: "Disney style, magical, warm colors, fairy tale atmosphere, soft lighting",
  anime: "Anime style, detailed, dynamic, Japanese animation, vivid colors",
  comic: "Comic book style, bold lines, dramatic, pop art, high contrast",
  realistic: "Photorealistic, cinematic lighting, detailed textures, high resolution",
  "3d": "3D render, Unreal Engine style, realistic lighting, detailed materials",
};
