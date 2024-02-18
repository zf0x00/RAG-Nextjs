import { NextResponse } from "next/server";
import { pdfLoader } from "./pdf-loader";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Un-Authorized SignIn First" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    console.log(`Log Body ${JSON.stringify(body)}`);
    const [{ fileKey, fileUrl }] = body;

    if (!fileKey && fileUrl) {
      return new NextResponse("File Not Uploaded Something went wrong");
    }

    await pdfLoader(fileUrl, fileKey);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: fileKey,
        pdfName: fileKey,
        pdfUrl: fileUrl,
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
}
