"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Settings {
  modelName: string;
  language: string;
  theme: string;
  artStyle: string;
  ttsVoice: string;
  ttsEnabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    modelName: "llama3.2",
    language: "ar",
    theme: "dark",
    artStyle: "pixar",
    ttsVoice: "",
    ttsEnabled: false,
  });
  const [saving, setSaving] = useState(false);
  const [aiStatus, setAiStatus] = useState<"checking" | "connected" | "disconnected">("checking");

  useEffect(() => {
    loadSettings();
    checkAiStatus();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch {
      console.error("Failed to load settings");
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch {
      console.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function checkAiStatus() {
    try {
      const res = await fetch("/api/ai/status");
      const data = await res.json();
      setAiStatus(data.connected ? "connected" : "disconnected");
    } catch {
      setAiStatus("disconnected");
    }
  }

  const AI_MODELS = [
    { id: "llama3.2", name: "Llama 3.2", desc: "نموذج متعدد اللغات" },
    { id: "gemma2", name: "Gemma 2", desc: "نموذج Google" },
    { id: "qwen2.5", name: "Qwen 2.5", desc: "نموذج عالمي" },
    { id: "phi-4", name: "Phi-4 Mini", desc: "نموذج Microsoft" },
  ];

  const ART_STYLES = [
    { id: "pixar", name: "Pixar", emoji: "🎬" },
    { id: "disney", name: "ديزني", emoji: "🏰" },
    { id: "anime", name: "أنمي", emoji: "🎌" },
    { id: "comic", name: "قصص مصورة", emoji: "💥" },
    { id: "realistic", name: "واقعي", emoji: "📷" },
    { id: "3d", name: "ثلاثي الأبعاد", emoji: "🧊" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-purple-300 hover:text-white transition-colors"
            >
              → الرئيسية
            </button>
            <span className="text-purple-500">|</span>
            <h1 className="font-bold">⚙️ الإعدادات</h1>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-cyan-500 font-bold text-sm hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "💾 حفظ"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* AI Status */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🤖</span> حالة الذكاء الاصطناعي
          </h3>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              aiStatus === "connected" ? "bg-green-500" :
              aiStatus === "checking" ? "bg-yellow-500 animate-pulse" :
              "bg-red-500"
            }`}></div>
            <span>
              {aiStatus === "connected" ? "متصل بـ Ollama" :
               aiStatus === "checking" ? "جاري الفحص..." :
               "غير متصل - يرجى تثبيت Ollama"}
            </span>
          </div>
          {aiStatus === "disconnected" && (
            <div className="mt-4 p-4 bg-black/20 rounded-xl">
              <p className="text-sm text-purple-200 mb-2">لتشغيل الذكاء الاصطناعي محلياً:</p>
              <ol className="text-sm text-purple-300 space-y-1 list-decimal list-inside">
                <li>ثبّت Ollama من <span className="text-cyan-400">ollama.ai</span></li>
                <li>شغّل الأمر: <code className="bg-black/30 px-2 py-1 rounded">ollama serve</code></li>
                <li>حمّل النموذج: <code className="bg-black/30 px-2 py-1 rounded">ollama pull llama3.2</code></li>
              </ol>
            </div>
          )}
        </div>

        {/* AI Model Selection */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🧠</span> نموذج الذكاء الاصطناعي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSettings({ ...settings, modelName: model.id })}
                className={`p-4 rounded-xl text-left transition-all ${
                  settings.modelName === model.id
                    ? "bg-purple-500/30 border-2 border-purple-500"
                    : "bg-black/20 border-2 border-transparent hover:border-white/20"
                }`}
              >
                <p className="font-bold">{model.name}</p>
                <p className="text-sm text-purple-300">{model.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Art Style */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🎨</span> أسلوب الرسوم
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ART_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSettings({ ...settings, artStyle: style.id })}
                className={`p-4 rounded-xl text-center transition-all ${
                  settings.artStyle === style.id
                    ? "bg-purple-500/30 border-2 border-purple-500"
                    : "bg-black/20 border-2 border-transparent hover:border-white/20"
                }`}
              >
                <span className="text-2xl block mb-2">{style.emoji}</span>
                <p className="font-bold text-sm">{style.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🌐</span> اللغة
          </h3>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-4 py-3 rounded-xl"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>

        {/* TTS Settings */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🔊</span> النطق بالقصة
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span>تفعيل النطق التلقائي</span>
            <button
              onClick={() => setSettings({ ...settings, ttsEnabled: !settings.ttsEnabled })}
              className={`w-12 h-6 rounded-full transition-all ${
                settings.ttsEnabled ? "bg-purple-500" : "bg-gray-600"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-all ${
                settings.ttsEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}></div>
            </button>
          </div>
          {settings.ttsEnabled && (
            <div>
              <label className="block text-sm text-purple-200 mb-2">الصوت</label>
              <select
                value={settings.ttsVoice}
                onChange={(e) => setSettings({ ...settings, ttsVoice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl"
              >
                <option value="">اختر صوتاً...</option>
                <option value="ar-male-1">صوت رجالي عربي</option>
                <option value="ar-female-1">صوت نسائي عربي</option>
                <option value="en-male-1">صوت رجالي إنجليزي</option>
                <option value="en-female-1">صوت نسائي إنجليزي</option>
              </select>
              <p className="text-xs text-purple-400 mt-2">
                يتطلب تثبيت Piper TTS محلياً
              </p>
            </div>
          )}
        </div>

        {/* About */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>ℹ️</span> حول التطبيق
          </h3>
          <div className="space-y-2 text-sm text-purple-200">
            <p>حكايتي AI - StoryAI Studio</p>
            <p>الإصدار: 0.1.0</p>
            <p>يعمل بالكامل بدون إنترنت</p>
            <p>جميع البيانات محفوظة محلياً</p>
          </div>
        </div>
      </main>
    </div>
  );
}
