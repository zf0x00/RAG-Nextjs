import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/contedxt/context";
import { db } from "@/lib/db";
import { chats, message as mess } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Message } from "ai/react";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, chatId } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1];

  const chat = await db.select().from(chats).where(eq(chats.id, chatId));

  const fileKey = chat[0].fileKey;

  //getting context from db
  const context = await getContext(lastMessage.content, fileKey);

  if (chat.length != 1) {
    return NextResponse.json("error chat found", { status: 401 });
  }

  const prompt = [
    {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI is a big fan of chatwithpdf.pro tool mostly used by student and researchers.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
    },
  ];

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      ...prompt,
      ...messages.filter((message: Message) => message.role === "user"),
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onStart: async () => {
      await db.insert(mess).values({
        chatId,
        content: lastMessage.content,
        role: "user",
      });
    },

    onCompletion: async (completion) => {
      await db.insert(mess).values({
        chatId,
        content: completion,
        role: "system",
      });
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
