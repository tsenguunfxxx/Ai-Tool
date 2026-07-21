"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import { Sparkles, FileText, Loader2 } from "lucide-react";
import Create from "@/components/ui/createImg";

const client = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AiFoodPage = () => {
  const [tab, setTab] = useState("analysis");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setImage(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const handleGenerate = async () => {
    if (!image) return alert("Зураг оруулна уу");

    setLoading(true);
    setResponse("");

    try {
      const base64 = await fileToBase64(image);

      const interaction = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: image.type,
              data: base64,
            },
          },
          {
            text: `Analyze this food image.

Return the result in Markdown:

# Food Name

## Ingredients
- ingredient 1
- ingredient 2

## Estimated Nutrition
- Calories:
- Protein:
- Carbs:
- Fat:
`,
          },
        ],
      });

      setResponse(interaction.text ?? "");
    } catch (error) {
      console.log("ERROR", error);
      setResponse("Алдаа гарлаа. API key эсвэл model name шалга.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-10 py-6">
        <h1 className="text-lg font-semibold">AI tools</h1>
      </header>

      <main className="mx-auto mt-8 w-[580px]">
        <div className="mb-8 flex justify-center">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={tab === "analysis" ? "default" : "ghost"}
              onClick={() => setTab("analysis")}
            >
              Image analysis
            </Button>

            <Button
              variant={tab === "ingredient" ? "default" : "ghost"}
              onClick={() => setTab("ingredient")}
            >
              Ingredient recognition
            </Button>

            <Button
              variant={tab === "creator" ? "default" : "ghost"}
              onClick={() => setTab("creator")}
            >
              Image creator
            </Button>
          </div>
        </div>

        {tab === "creator" ? (
          <div className="w-full flex items-center justify-center">
            <Create />
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Sparkles className="h-5 w-5" />
                  {tab === "ingredient"
                    ? "Ingredient recognition"
                    : "Image analysis"}
                </h2>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    setImage(null);
                    setPreviewImage("");
                    setResponse("");
                  }}
                >
                  ↻
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Upload a food photo, and AI will detect the ingredients.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 cursor-pointer items-start rounded-md border px-3 py-2 text-sm"
              >
                <span className="text-gray-400">
                  {image ? image.name : "JPG, PNG оруулна уу"}
                </span>
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />

              <div className="flex justify-end">
                <Button onClick={handleGenerate} disabled={loading || !image}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>

              {previewImage && (
                <img
                  src={previewImage}
                  alt="preview"
                  className="h-[133px] w-[200px] rounded-md object-cover"
                />
              )}
            </section>

            <section className="mt-10">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <FileText className="h-5 w-5" />
                Here is the summary
              </h2>

              <div className="mt-3 text-sm text-gray-500">
                {response ? (
                  <div className="prose max-w-none">
                    <Markdown>{response}</Markdown>
                  </div>
                ) : (
                  <p>First, enter your image to recognize ingredients.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AiFoodPage;
