"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownBody from "@/components/ui/MarkdownBody";
import { ArrowUp, Loader2, MessageCircle, X } from "lucide-react";
import { getGemini } from "@/lib/gemini";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Сайн байна уу? Юугаар туслах вэ?" },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Шинэ мессеж нэмэгдэх бүрт хамгийн доод хэсэг рүү гүйлгэнэ.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, open]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const history = [...messages, { role: "user", text: question } as Message];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const result = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a friendly cooking assistant for a food AI tool.

Language rule: always answer in the SAME language the user wrote their last message in.
- Mongolian question (Cyrillic or transliterated Latin) -> answer in Mongolian Cyrillic.
- English question -> answer in English.
- Any other language -> answer in that language.
If the language is unclear, answer in Mongolian Cyrillic.

Keep answers short and practical.`,
        },
        contents: history.map((message) => ({
          role: message.role === "user" ? "user" : "model",
          parts: [{ text: message.text }],
        })),
      });

      setMessages([
        ...history,
        { role: "assistant", text: result.text ?? "" },
      ]);
    } catch (error) {
      console.log(error);
      setMessages([
        ...history,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Алдаа гарлаа. API key шалга.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat assistant"
        className="fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 flex h-[420px] w-[320px] flex-col rounded-lg border bg-background shadow-xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">Chat assistant</span>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat assistant"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <MarkdownBody>{message.text}</MarkdownBody>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-3 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t px-3 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Мессежээ бичнэ үү..."
          className="h-8 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />

        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
