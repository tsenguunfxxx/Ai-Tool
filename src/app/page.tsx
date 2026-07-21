"use client";

import { useState } from "react";
import ImageAnalysis from "@/components/ui/ImageAnalysis";
import IngredientRecognition from "@/components/ui/IngredientRecognition";
import Create from "@/components/ui/createImg";
import ChatAssistant from "@/components/ui/ChatAssistant";

const tabs = [
  { id: "analysis", label: "Image analysis" },
  { id: "ingredient", label: "Ingredient recognition" },
  { id: "creator", label: "Image creator" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const AiFoodPage = () => {
  const [tab, setTab] = useState<TabId>("analysis");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-10 py-6">
        <h1 className="text-lg font-semibold">AI tools</h1>
      </header>

      <main className="mx-auto mt-10 w-[580px] pb-24">
        <div className="mb-8 flex gap-6 border-b">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                tab === item.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "analysis" && <ImageAnalysis />}
        {tab === "ingredient" && <IngredientRecognition />}
        {tab === "creator" && <Create />}
      </main>

      <ChatAssistant />
    </div>
  );
};

export default AiFoodPage;
