import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Lazy: GoogleGenAI throws in the browser when the key is missing, so creating
// it at module scope would crash the whole page instead of just the request.
export const getGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY тохируулаагүй байна. .env.local файлдаа нэмнэ үү.",
    );
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
};

export const fileToBase64 = (file: File): Promise<string> => {
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
