"use client";

import React from "react";
import { Input } from "../ui/input";
import { useChat, useCompletion } from "ai/react";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import MessageList from "./message-list";

interface ChatComponentProps {
  chatId: number;
}

export default function ChatComponent({ chatId }: ChatComponentProps) {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: { chatId },
  });

  return (
    <div className="relative max-h-screen overflow-scroll">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit ">
        <div className="text-xl font-bold">Chat</div>
      </div>

      <MessageList message={messages} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 px-3 py-4 inset-x-0">
        <div className="flex">
          <Input
            onChange={handleInputChange}
            value={input}
            placeholder="Enter Your Question here.."
          />
          <Button className="bg-black ml-3">
            <SendIcon className="h-3 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
