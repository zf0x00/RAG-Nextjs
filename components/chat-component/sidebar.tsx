import { DrizzleChat, message } from "@/lib/db/schema";
import React from "react";
import { Button } from "../ui/button";
import { UploadButton } from "@uploadthing/react";
import UploadButtonSidebar from "./components/uploadbutton";
import MessageCardSideBar from "./components/message-card";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";

interface ChatSidebarProps {
  chat: DrizzleChat[];
  chatId: number;
}

export default async function ChatSidebar({ chat, chatId }: ChatSidebarProps) {
  // const messages = await await db.select().from(message).fi;
  const messages = await db.query.message.findMany({
    where: eq(message.chatId, chatId),
  });

  console.log(`Sidebar ${messages}`);
  return (
    <div className="w-full h-screen bg-gray-200">
      <UploadButtonSidebar />
      {/* Button */}
      <div className="flex">
        {chat.map((message) => (
          <Link key={message.id} href={`chat/${message.id}`}>
            <MessageCardSideBar
              text={message.pdfName.replace(/\d+/g, "")}
              messageId={message.id}
              chatId={chatId}
            />
          </Link>
        ))}
      </div>
      {/* Chat History */}
      <div className="flex"></div>
      {/* Notes Area */}
      <div></div>
    </div>
  );
}
