"use client";
import { UploadButton } from "@/lib/uploadthing";
import React from "react";
import { toast } from "react-hot-toast";

export default function UploadButtonSidebar() {
  return (
    <div className="flex items-center justify-center pt-4">
      <UploadButton
        appearance={{
          button:
            "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-white/60 border text-white bg-[#09090b] after:bg-[#393946]",
          container:
            "w-max flex-row rounded-md border-dashed border border-black",
          allowedContent:
            "flex flex-col items-center justify-center px-2 text-black",
        }}
        endpoint="pdfUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          toast.success("File Uploaded");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);

          toast.error("Upload Failed");
        }}
      />
    </div>
  );
}
