"use client";

import { useState } from "react";
import MarkdownBody from "@/components/ui/MarkdownBody";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { getGemini } from "@/lib/gemini";

const IngredientRecognition = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setText("");
    setResponse("");
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const result = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            text: `Read the food description below and list the ingredients needed for it.

Return the result in Markdown: a short summary sentence, then a bullet list of ingredients.

Description:
${text}`,
          },
        ],
      });

      setResponse(result.text ?? "");
    } catch (error) {
      console.log(error);
      setResponse(
        error instanceof Error
          ? error.message
          : "Алдаа гарлаа. API key эсвэл model name шалга.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6" />
            Ingredient recognition
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

        <p className="text-sm text-muted-foreground">
          Describe the food, and AI will detect the ingredients.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type / paste a recipe"
          className="h-[120px] w-full resize-none rounded-md border px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={loading || !text.trim()}
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
          Identified ingredients
        </h2>

        <div className="mt-3 text-sm text-muted-foreground">
          {loading ? (
            <p className="flex items-center gap-2">
              Working on your text, just wait for a moment
              <Loader2 className="h-4 w-4 animate-spin" />
            </p>
          ) : response ? (
            <div className="text-foreground"><MarkdownBody>{response}</MarkdownBody></div>
          ) : (
            <p>First, enter your text to recognize an ingredients.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default IngredientRecognition;
