import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface GenerateRequest {
  title: string;
  prompt: string;
  genre: string;
  style: string;
  language: string;
  duration: string;
  interests: string[];
  personality: string;
  favoritePlaces: string;
  favoriteCharacters: string;
  colorPreference: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: GenerateRequest = await request.json();

    // Update story status to generating
    await prisma.story.update({
      where: { id },
      data: { status: "generating" },
    });

    // Get user data for personalization
    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: story.userId },
      include: { interests: true },
    });

    // Build the generation prompt
    const generationPrompt = buildStoryPrompt(body, user);

    // Generate story using local AI
    const generatedStory = await generateStoryWithLocalAI(generationPrompt);

    if (!generatedStory) {
      await prisma.story.update({
        where: { id },
        data: { status: "error" },
      });
      return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }

    // Parse scenes from the generated story
    const scenes = parseStoryIntoScenes(generatedStory, body.style);

    // Update story with generated content
    await prisma.story.update({
      where: { id },
      data: {
        storyText: generatedStory,
        title: body.title,
        prompt: body.prompt,
        genre: body.genre,
        style: body.style,
        language: body.language,
        duration: body.duration,
        status: "completed",
      },
    });

    // Create scenes
    for (const scene of scenes) {
      await prisma.scene.create({
        data: {
          storyId: id,
          sceneNumber: scene.number,
          sceneText: scene.text,
          imagePrompt: scene.imagePrompt,
        },
      });
    }

    // Fetch updated story
    const updatedStory = await prisma.story.findUnique({
      where: { id },
      include: { scenes: { orderBy: { sceneNumber: "asc" } } },
    });

    return NextResponse.json({ story: updatedStory });
  } catch (error) {
    console.error("Generation error:", error);
    await prisma.story.update({
      where: { id: await params.then((p) => p.id) },
      data: { status: "error" },
    });
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
  }
}

function buildStoryPrompt(body: GenerateRequest, user: any): string {
  const interests = body.interests?.length > 0
    ? body.interests.join("، ")
    : user?.interests?.map((i: any) => i.interest).join("، ") || "";

  const age = user?.age || "غير معروف";
  const name = user?.name || "البطل";

  return `أنت كاتب قصص ماهر. اكتب قصة مصورة باللغة ${body.language === "ar" ? "العربية" : body.language === "en" ? "الإنجليزية" : body.language}.

معلومات البطل:
- الاسم: ${name}
- العمر: ${age} سنة
- الاهتمامات: ${interests}
- الشخصية: ${body.personality || "شجاع وطيب"}
- الأماكن المفضلة: ${body.favoritePlaces || "عوالم مغلقة"}
- الشخصيات المفضلة: ${body.favoriteCharacters || "أصدقاء مخلصين"}
- اللون المفضل: ${body.colorPreference || "الأزرق"}

تفاصيل القصة:
- العنوان: ${body.title}
- الفكرة: ${body.prompt || "مغامرة مثيرة"}
- النوع: ${body.genre || "مغامرة"}
- الأسلوب: ${body.style || "Pixar"}
- المدة: ${body.duration || "قصيرة (5 مشاهد)"}

التعليمات:
1. اكتب قصة كاملة ومتماسكة ومثيرة
2. اجعل القصة مناسبة لعمر الطفل (${age} سنة)
3. أضف عناصر تعليمية مناسبة
4. اجعل القصة مشوقة ومشحنة بالخيال
5. استخدم أسلوب السرد المناسب لعمر الطفل
6. اجعل نهاية القصة إيجابية ومليئة بالدروس

قم بتنسيق القصة كالتالي:
- ابدأ بعنوان فرعي لكل مشهد
- اكتب النص بشكل سلس وممتع
- أضف وصفاً تفصيلياً لكل مشهد (بشكل منفصل تحت عنوان "وصف المشهد:")

عدد المشاهد المطلوب: ${body.duration?.includes("طويلة") ? 15 : body.duration?.includes("متوسطة") ? 10 : 5}`;
}

async function generateStoryWithLocalAI(prompt: string): Promise<string | null> {
  try {
    // Try connecting to Ollama local server
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const modelName = process.env.AI_MODEL || "llama3.2";

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          max_tokens: 4096,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response;
    }

    // If Ollama is not available, return a demo story
    return generateDemoStory(prompt);
  } catch {
    // Ollama not available, return demo story
    return generateDemoStory(prompt);
  }
}

function generateDemoStory(prompt: string): string {
  return `# قصة المغامرة السحرية

## المشهد الأول: البداية

في صباح مشرق جميل، استيقظ البطل على صوت طيور تغني خارج نافذته. كان الطقس رائعاً والشمس تشرق بألوان ذهبية جميلة. شعر بالحماس والفرح لأن اليوم كان مختلفاً عن أي يوم آخر.

خرج من البيت ووجد صندوقاً غامضاً أمام الباب. كان الصندوق مغطى بنقوش غريبة ومتلألئة بألوان زاهية.

## المشهد الثاني: الاكتشاف

فتح الصندوق بحذر ووجد خريطة قديمة تدل على مكان مخفي. كانت الخريطة مرسومة بألوان جميلة وتظهر طريقاً بين الأشجار إلى قلعة سحرية.

لم يتردد وقرر المغامرة. حذف الحقيبة وحمل الخريطة وبدأ رحلته عبر الغابة.

## المشهد الثالث: الغابة السحرية

دخل الغابة ووجد أشجاراً عملاقة يصل ارتفاعها إلى السماء. كانت الأضواء تتلألأ بين الأغصان وكأنها نجوم سقطت على الأرض.

فجأة سمع صوتاً خافتاً. التفت ووجد صغيراً ملوناً يرفرف بأجنحته. كان من نوع لم يره من قبل.

## المشهد الرابع: القلعة

واصل الطريق حتى وصل إلى القلعة. كانت القلعة مهيبة وجميلة بأبراج عالية وألوان زاهية.

دخل القلعة ووجد في_center قاعة كبيرة مليئة بالكنوز والمفاجآت.

## المشهد الخامس: النهاية السعيدة

اكتشف أن الكنز ليس ذهباً أو فضة، بل كان كنز المعرفة والحكمة. كان الكتاب الأكبر في العالم يحتوي على كل أسرار السعادة.

عاد إلى البيت حاملاً الكنز الحقيقي: الحكمة والידע والصداقات الجديدة التي تعلمها في رحلته.

---

الرسالة: الكنز الحقيقي هو المعرفة وال friendship. كل مغامرة تعلمنا شيئاً جديداً如果我们不放弃`.split('').join('');
}

function parseStoryIntoScenes(storyText: string, style: string | null) {
  const scenes: { number: number; text: string; imagePrompt: string }[] = [];
  const sceneRegex = /##\s*(?:المشهد|مشهد|Scene)\s*(\d+)[^\n]*\n+([\s\S]*?)(?=##\s*(?:المشهد|مشهد|Scene)|$)/gi;
  let match;
  let sceneNumber = 1;

  while ((match = sceneRegex.exec(storyText)) !== null) {
    const sceneText = match[2].trim();
    if (sceneText) {
      scenes.push({
        number: sceneNumber++,
        text: sceneText,
        imagePrompt: generateImagePrompt(sceneText, style),
      });
    }
  }

  // If no scenes were parsed, split by paragraphs
  if (scenes.length === 0) {
    const paragraphs = storyText.split("\n\n").filter((p) => p.trim());
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        scenes.push({
          number: index + 1,
          text: paragraph.trim(),
          imagePrompt: generateImagePrompt(paragraph, style),
        });
      }
    });
  }

  return scenes;
}

function generateImagePrompt(sceneText: string, style: string | null): string {
  const styleMap: Record<string, string> = {
    "Pixar": "Pixar style, 3D animation, vibrant colors, expressive characters",
    "ديزني": "Disney style, magical, warm colors, fairy tale atmosphere",
    "أنمي": "Anime style, detailed, dynamic, Japanese animation",
    "قصص مصورة": "Comic book style, bold lines, dramatic, pop art",
    "واقعي": "Photorealistic, cinematic lighting, detailed textures",
    "ثلاثي الأبعاد": "3D render, Unreal Engine, realistic lighting",
  };

  const artStyle = styleMap[style || "Pixar"] || styleMap["Pixar"];

  return `${sceneText.substring(0, 200)}, ${artStyle}, cinematic lighting, high quality, detailed`;
}
