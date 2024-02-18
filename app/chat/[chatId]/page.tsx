import ChatSidebar from "@/components/chat-component/sidebar";
import ChatComponent from "@/components/chat/chat-component";
import PdfViewer from "@/components/pdf viewer/pdf-viewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

interface ChatProps {
  params: {
    chatId: string;
  };
}

export default async function ChatPage({ params: { chatId } }: ChatProps) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const chatMessages = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!chatMessages) {
    return redirect("/");
  }

  if (!chatMessages.find((chats) => chats.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentchat = chatMessages.find(
    (chat) => chat.id === parseFloat(chatId)
  );

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* Chat sidebar with notes */}
        <div className="flex-[1] max-w-xs">
          {/* Chat component */}
          <ChatSidebar chat={chatMessages} chatId={parseInt(chatId)} />
        </div>
        {/* PDF Version */}
        <div className="max-w-3xl w-5/12 bg-blue-200 max-h-screen p-4 overflow-scroll">
          {/* <PdfViewer url={currentchat?.pdfUrl || ""} /> */}
        </div>
        {/* chat message area */}
        <div className="flex[1] w-full max-w-2xl h-full">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}
