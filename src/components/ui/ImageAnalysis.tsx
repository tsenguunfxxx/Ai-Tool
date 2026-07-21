"use client";

import { useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";

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

const ImageAnalysis = () => {
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setImage(selectedFile);
    setResponse("");
  };

  const reset = () => {
    setImage(null);
    setResponse("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!image) return alert("Зураг оруулна уу");

    setLoading(true);
    setResponse("");

    try {
      const base64 = await fileToBase64(image);

      const result = await client.models.generateContent({
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

      setResponse(result.text ?? "");
    } catch (error) {
      console.log(error);
      setResponse("Алдаа гарлаа. API key эсвэл model name шалга.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[580px]">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6" />
            Image analysis
          </h2>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={reset}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Upload a food photo, and AI will detect the ingredients.
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 cursor-pointer items-center rounded-md border px-4 text-sm"
        >
          <span className="font-medium">Choose File</span>
          <span className="ml-3 text-gray-500">
            {image ? image.name : "JPG , PNG"}
          </span>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={loading || !image}
            className="h-12 w-[110px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <FileText className="h-6 w-6" />
          Here is the summary
        </h2>

        <div className="mt-3 text-sm text-gray-500">
          {response ? (
            <div className="prose max-w-none">
              <Markdown>{response}</Markdown>
            </div>
          ) : (
            <p>First, enter your image to recognize an ingredients.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImageAnalysis;
