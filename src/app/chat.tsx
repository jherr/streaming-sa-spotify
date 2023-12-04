"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";

export function Chat({ handler }: { handler: any }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: handler,
  });

  return (
    <div className="container mx-auto p-4">
      <form
        className="flex gap-2 w-full pb-2 border-b-slate-700 border-b items-center"
        onSubmit={handleSubmit}
      >
        <Label className="flex-nowrap text-xl whitespace-nowrap">
          Albums that feel like
        </Label>
        <Input
          className="border border-gray-500 rounded p-2 w-full text-xl"
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <Button type="submit" className="bg-black text-white rounded px-4">
          Send
        </Button>
      </form>
      <ul>
        {messages.map((m, index) => (
          <li key={index} className="mt-3 font-bold text-xl">
            {/* {m.role === "user" ? "User: " : "AI: "} */}
            {m.role === "user" ? m.content : m.ui}
          </li>
        ))}
      </ul>
    </div>
  );
}
