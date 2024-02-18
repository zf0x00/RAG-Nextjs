import { cn } from "@/lib/utils";
import { MessageCircleIcon } from "lucide-react";
import React from "react";

interface MessageCardSideBarProps {
  text: string;
  chatId: number;
  messageId: number;
}

export default function MessageCardSideBar({
  text,
  chatId,
  messageId,
}: MessageCardSideBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center mx-2 my-3 bg-[#09090b] rounded-xl m-3 hover:bg-black",
        {
          "bg-gray-500": messageId !== chatId,
        }
      )}>
      <div className="pt-3 pb-3">
        <div className="flex gap-x-3 text-white">
          <MessageCircleIcon className="ml-2 " />
          <p className="text-ellipsis line-clamp-1 pr-1">{text}</p>
        </div>
      </div>
    </div>
  );
}
