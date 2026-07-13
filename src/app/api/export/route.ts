import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyId, format } = body;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        scenes: { orderBy: { sceneNumber: "asc" } },
        user: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    switch (format) {
      case "pdf":
        return await exportAsPDF(story);
      case "epub":
        return await exportAsEPUB(story);
      case "text":
        return await exportAsText(story);
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

async function exportAsPDF(story: any) {
  // Generate PDF content
  const pdfContent = generatePDFContent(story);

  return new NextResponse(pdfContent, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${story.title}.pdf"`,
    },
  });
}

async function exportAsEPUB(story: any) {
  // Generate EPUB content
  const epubContent = generateEPUBContent(story);

  return new NextResponse(epubContent, {
    headers: {
      "Content-Type": "application/epub+zip",
      "Content-Disposition": `attachment; filename="${story.title}.epub"`,
    },
  });
}

async function exportAsText(story: any) {
  const content = generateTextContent(story);

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${story.title}.txt"`,
    },
  });
}

function generatePDFContent(story: any): string {
  // Simple PDF-like content (in real implementation, use a PDF library)
  let content = `%PDF-1.4\n`;
  content += `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n`;
  content += `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n`;
  content += `3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n`;
  content += `xref\n0 4\n`;
  content += `0000000000 65535 f \n`;
  content += `0000000009 00000 n \n`;
  content += `0000000058 00000 n \n`;
  content += `0000000115 00000 n \n`;
  content += `trailer<</Size 4/Root 1 0 R>>\n`;
  content += `startxref\n190\n%%EOF`;
  return content;
}

function generateEPUBContent(story: any): string {
  // Simple EPUB structure (in real implementation, use an EPUB library)
  let content = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  content += `<package xmlns="http://www.idpf.org/2007/opf" version="3.0">\n`;
  content += `  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
  content += `    <dc:title>${story.title}</dc:title>\n`;
  content += `    <dc:language>${story.language}</dc:language>\n`;
  content += `  </metadata>\n`;
  content += `  <manifest>\n`;
  content += `    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>\n`;
  content += `  </manifest>\n`;
  content += `  <spine>\n`;
  content += `    <itemref idref="content"/>\n`;
  content += `  </spine>\n`;
  content += `</package>`;
  return content;
}

function generateTextContent(story: any): string {
  let content = `${story.title}\n`;
  content += `${"=".repeat(story.title.length)}\n\n`;

  if (story.scenes && story.scenes.length > 0) {
    story.scenes.forEach((scene: any) => {
      content += `--- المشهد ${scene.sceneNumber} ---\n\n`;
      content += `${scene.sceneText}\n\n`;
    });
  } else {
    content += `${story.storyText}\n`;
  }

  content += `\n---\n`;
  content += `تم الإنشاء بواسطة حكايتي AI\n`;

  return content;
}
