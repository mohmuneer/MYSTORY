"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Story {
  id: string;
  title: string;
  prompt: string;
  storyText: string;
  genre: string | null;
  style: string | null;
  language: string;
  duration: string | null;
  status: string;
  scenes: Scene[];
}

interface Scene {
  id: string;
  sceneNumber: number;
  sceneText: string;
  imagePrompt: string | null;
  imagePath: string | null;
}

const GENRES = ["مغامرة", "فانتازيا", "علوم", "uckets", "uckets", "uckets", "uckets", "uckets", "uckets", "uckets"];
const STYLES = ["Pixar", "ديزني", "أنمي", "قصص مصورة", "واقعي", "ثلاثي الأبعاد"];
const LANGUAGES = [
  { code: "ar", name: "العربية" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "tr", name: "Türkçe" },
];
const DURATIONS = ["قصيرة (5 مشاهد)", "متوسطة (10 مشاهد)", "طويلة (15 مشهد)"];

export default function StoryEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [style, setStyle] = useState("");
  const [language, setLanguage] = useState("ar");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [personality, setPersonality] = useState("");
  const [favoritePlaces, setFavoritePlaces] = useState("");
  const [favoriteCharacters, setFavoriteCharacters] = useState("");
  const [colorPreference, setColorPreference] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    loadStory();
  }, []);

  async function loadStory() {
    try {
      const res = await fetch(`/api/stories/${id}`);
      const data = await res.json();
      if (data.story) {
        setStory(data.story);
        setTitle(data.story.title);
        setPrompt(data.story.prompt);
        setGenre(data.story.genre || "");
        setStyle(data.story.style || "");
        setLanguage(data.story.language);
        setDuration(data.story.duration || "");
      }
    } catch {
      console.error("Failed to load story");
    } finally {
      setLoading(false);
    }
  }

  async function saveStory() {
    setSaving(true);
    try {
      await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          prompt,
          genre,
          style,
          language,
          duration,
          interests,
          personality,
          favoritePlaces,
          favoriteCharacters,
          colorPreference,
        }),
      });
    } catch {
      console.error("Failed to save story");
    } finally {
      setSaving(false);
    }
  }

  async function generateStory() {
    setGenerating(true);
    await saveStory();
    try {
      await fetch(`/api/stories/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          prompt,
          genre,
          style,
          language,
          duration,
          interests,
          personality,
          favoritePlaces,
          favoriteCharacters,
          colorPreference,
        }),
      });
      await loadStory();
    } catch {
      console.error("Failed to generate story");
    } finally {
      setGenerating(false);
    }
  }

  function addInterest() {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  }

  function removeInterest(interest: string) {
    setInterests(interests.filter((i) => i !== interest));
  }

  async function handleExport(format: string) {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId: id, format }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "story"}.${format === "pdf" ? "pdf" : format === "epub" ? "epub" : "txt"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch {
      console.error("Export failed");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-purple-300 hover:text-white transition-colors"
            >
              → الرئيسية
            </button>
            <span className="text-purple-500">|</span>
            <h1 className="font-bold">{title || "قصة جديدة"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveStory}
              disabled={saving}
              className="px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all text-sm"
            >
              {saving ? "جاري الحفظ..." : "💾 حفظ"}
            </button>
            <button
              onClick={generateStory}
              disabled={generating}
              className="px-4 py-2 rounded-xl bg-gradient-to-l from-purple-500 to-cyan-500 font-bold text-sm hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
            >
              {generating ? "جاري التوليد..." : "✨ توليد القصة"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Title */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📝</span> عنوان القصة
              </h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-lg"
                placeholder="عنوان قصتك..."
              />
            </div>

            {/* Story Concept */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>💡</span> فكر القصة
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl min-h-[120px] resize-none"
                placeholder="صف فكرة القصة... مثال: طفل يكتشف عالم السحر في مكتبة قديمة"
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Genre */}
              <div className="glass rounded-2xl p-4">
                <label className="block text-sm text-purple-200 mb-2">🎭 النوع</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm"
                >
                  <option value="">اختر...</option>
                  <option value="مغامرة">مغامرة</option>
                  <option value="فانتازيا">فانتازيا</option>
                  <option value="خيال علمي">خيال علمي</option>
                  <option value="تعليمي">تعليمي</option>
                  <option value="كوميدي">كوميدي</option>
                </select>
              </div>

              {/* Style */}
              <div className="glass rounded-2xl p-4">
                <label className="block text-sm text-purple-200 mb-2">🎨 أسلوب الرسوم</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm"
                >
                  <option value="">اختر...</option>
                  {STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div className="glass rounded-2xl p-4">
                <label className="block text-sm text-purple-200 mb-2">🌐 اللغة</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="glass rounded-2xl p-4">
                <label className="block text-sm text-purple-200 mb-2">⏱️ المدة</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm"
                >
                  <option value="">اختر...</option>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interests */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⭐</span> الاهتمامات
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addInterest()}
                  className="flex-1 px-4 py-2 rounded-xl text-sm"
                  placeholder="أضف اهتمام..."
                />
                <button
                  onClick={addInterest}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all text-sm"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center gap-1"
                  >
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="text-purple-400 hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Personality */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🧠</span> الشخصية
              </h3>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full px-4 py-3 rounded-xl min-h-[80px] resize-none text-sm"
                placeholder="صف شخصية البطل... مثال: شجاع، ذكي، طموح، يحب المساعدة"
              />
            </div>

            {/* Favorite Places */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🏰</span> الأماكن المفضلة
              </h3>
              <textarea
                value={favoritePlaces}
                onChange={(e) => setFavoritePlaces(e.target.value)}
                className="w-full px-4 py-3 rounded-xl min-h-[80px] resize-none text-sm"
                placeholder="الأماكن التي يحبها البطل... مثال: الغابة السحرية، المكتبة القديمة، الفضاء"
              />
            </div>

            {/* Favorite Characters */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>👥</span> الشخصيات المفضلة
              </h3>
              <textarea
                value={favoriteCharacters}
                onChange={(e) => setFavoriteCharacters(e.target.value)}
                className="w-full px-4 py-3 rounded-xl min-h-[80px] resize-none text-sm"
                placeholder="الشخصيات المفضلة... مثال: روبوت صغير، تنين صديق، ساحرة حكيمة"
              />
            </div>

            {/* Color Preference */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🎨</span> اللون المفضل
              </h3>
              <input
                type="text"
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                placeholder="اللون المفضل... مثال: الأزرق، الذهبي، الأحمر"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Story Preview */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📖</span> نص القصة
              </h3>
              {story?.storyText ? (
                <div className="bg-black/20 rounded-xl p-4 max-h-[400px] overflow-y-auto">
                  <p className="whitespace-pre-wrap leading-relaxed text-purple-100">
                    {story.storyText}
                  </p>
                </div>
              ) : (
                <div className="bg-black/20 rounded-xl p-8 text-center">
                  <p className="text-purple-300">لم يتم توليد القصة بعد</p>
                  <p className="text-purple-400 text-sm mt-2">أدخل البيانات واضغط &quot;توليد القصة&quot;</p>
                </div>
              )}
            </div>

            {/* Scenes */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🎬</span> المشاهد ({story?.scenes?.length || 0})
              </h3>
              {story?.scenes && story.scenes.length > 0 ? (
                <div className="space-y-4">
                  {story.scenes.map((scene) => (
                    <div key={scene.id} className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-bold">
                          {scene.sceneNumber}
                        </span>
                        <span className="text-sm font-medium">المشهد {scene.sceneNumber}</span>
                      </div>
                      <p className="text-sm text-purple-200 mb-2">{scene.sceneText}</p>
                      {scene.imagePath && (
                        <div className="mt-2 rounded-lg overflow-hidden bg-black/20 h-40 flex items-center justify-center">
                          <span className="text-purple-400">🖼️ صورة المشهد</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/20 rounded-xl p-8 text-center">
                  <p className="text-purple-300">لم يتم إنشاء مشاهد بعد</p>
                </div>
              )}
            </div>

            {/* Export Options */}
            {story?.storyText && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span>📤</span> التصدير
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all text-sm"
                  >
                    📄 تصدير PDF
                  </button>
                  <button
                    onClick={() => handleExport("epub")}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all text-sm"
                  >
                    📚 تصدير EPUB
                  </button>
                  <button
                    onClick={() => handleExport("text")}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all text-sm"
                  >
                    📝 تصدير نص
                  </button>
                  <button
                    onClick={() => handlePrint()}
                    className="px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all text-sm"
                  >
                    🖨️ طباعة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
