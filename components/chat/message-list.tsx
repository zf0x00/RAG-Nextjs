import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";

type Props = {
  message: Message[];
};

function MessageList({ message }: Props) {
  if (!message) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col gap-3 px-4">
        {message.map((message) => {
          return (
            <div
              className={cn("flex", {
                "justify-end": message.role === "user",

                "justify-start pr-10": message.role === "assistant",
              })}
              key={message.id}>
              <div
                className={cn(
                  "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-400",
                  { "bg-black text-white": message.role === "user" }
                )}>
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MessageList;
