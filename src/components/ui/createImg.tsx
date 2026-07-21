"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InferenceClient } from "@huggingface/inference";
import { useState } from "react";

const client = new InferenceClient(process.env.NEXT_PUBLIC_HF_TOKEN);

const Create = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateImage = async () => {
    setImageUrl("");

    const dataUrl = await client.textToImage(
      {
        provider: "fal-ai",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: inputValue,
      },
      {
        outputType: "dataUrl",
      },
    );

    setImageUrl(dataUrl);
  };

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <div className="flex gap-4">
        <Input onChange={handleInput} />
        <Button onClick={generateImage}>Generate Image</Button>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated image"
          className="w-96 rounded-lg border"
        />
      )}
    </div>
  );
};

export default Create;
