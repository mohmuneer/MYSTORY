"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  age: number;
  gender: string | null;
  photo: string | null;
}

interface Story {
  id: string;
  title: string;
  genre: string | null;
  style: string | null;
  status: string;
  createdAt: string;
  _count?: { scenes: number };
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserAge, setNewUserAge] = useState("");
  const [newUserGender, setNewUserGender] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) loadStories();
  }, [user]);

  async function loadUser() {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setShowNewUser(true);
      }
    } catch {
      setShowNewUser(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadStories() {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data.stories || []);
    } catch {
      console.error("Failed to load stories");
    }
  }

  async function createUser() {
    if (!newUserName || !newUserAge) return;
    setCreatingUser(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          age: parseInt(newUserAge),
          gender: newUserGender || null,
        }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setShowNewUser(false);
      }
    } catch {
      console.error("Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  }

  async function createStory() {
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();
      if (data.story) {
        router.push(`/story/${data.story.id}`);
      }
    } catch {
      console.error("Failed to create story");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (showNewUser) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full slide-up">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-l from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              حكايتي AI
            </h1>
            <p className="text-purple-200">مرحباً! أنشئ حسابك لبدء كتابة القصص</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200 mb-1">الاسم</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                placeholder="اسمك هنا..."
              />
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-1">العمر</label>
              <input
                type="number"
                value={newUserAge}
                onChange={(e) => setNewUserAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                placeholder="عمرك..."
                min={1}
                max={120}
              />
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-1">الجنس (اختياري)</label>
              <select
                value={newUserGender}
                onChange={(e) => setNewUserGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
              >
                <option value="">اختر...</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <button
              onClick={createUser}
              disabled={!newUserName || !newUserAge || creatingUser}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-purple-500 to-cyan-500 font-bold text-white hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
            >
              {creatingUser ? "جاري الإنشاء..." : "ابدأ الرحلة"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-l from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                حكايتي AI
              </h1>
              <p className="text-xs text-purple-300">StoryAI Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-purple-300">{user?.age} سنة</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl font-bold mb-4">
            مرحباً <span className="bg-gradient-to-l from-purple-400 to-cyan-400 bg-clip-text text-transparent">{user?.name}</span>
          </h2>
          <p className="text-purple-200 text-lg">أنشئ قصتك المصورة الخاصة</p>
        </div>

        {/* New Story Button */}
        <div className="mb-12 text-center">
          <button
            onClick={createStory}
            className="px-8 py-4 rounded-2xl bg-gradient-to-l from-purple-500 to-cyan-500 font-bold text-lg hover:from-purple-600 hover:to-cyan-600 transition-all glow-hover animate-pulse-glow"
          >
            ✨ قصة جديدة
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold mb-2">ذكاء محلي</h3>
            <p className="text-sm text-purple-200">يعمل بدون إنترنت بـ Ollama أو llama.cpp</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold mb-2">صور ذكية</h3>
            <p className="text-sm text-purple-200">توليد صور لكل مشهد بأسلوب يختاره المستخدم</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-bold mb-2">قصص مصورة</h3>
            <p className="text-sm text-purple-200">تصدير كـ PDF أو EPUB أو فيديو</p>
          </div>
        </div>

        {/* Stories Library */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📚</span> مكتبتي
          </h3>
          {stories.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-purple-200 text-lg">لا توجد قصص بعد</p>
              <p className="text-purple-300 text-sm mt-2">ابدأ بإنشاء قصتك الأولى!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => router.push(`/story/${story.id}`)}
                  className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg">{story.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      story.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : story.status === "generating"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}>
                      {story.status === "completed" ? "مكتملة" : story.status === "generating" ? "جاري التوليد" : "مسودة"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    {story.genre && <span>🎭 {story.genre}</span>}
                    {story.style && <span>🎨 {story.style}</span>}
                  </div>
                  {story._count && (
                    <p className="text-xs text-purple-400 mt-2">{story._count.scenes} مشهد</p>
                  )}
                  <p className="text-xs text-purple-400 mt-1">
                    {new Date(story.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
