"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import { toast } from "react-hot-toast";
import { UploadFileResponse } from "uploadthing/client";
import axios from "axios";
import { useRouter } from "next/navigation";

function DropUpload() {
  const router = useRouter();

  const onSubmit = async (data: UploadFileResponse[] | undefined) => {
    try {
      // console.log(`Before Axios${JSON.stringify(data)}`);

      const response = await axios.post("/api/createchat/", data);

      const { chat_id } = response.data;

      console.log(`RESPONSE ${JSON.stringify(response.data)}`);

      if (response.status === 200) {
        router.push(`/chat/${chat_id}`);
        toast.success("Going to Chat");
      } else {
        toast.error("Something Wrong");
      }

      console.log(response);
    } catch (error) {
      console.log(`AXIOS POST ERROR${error}`);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="flex h-auto justify-center items-center max-w-3xl border-2 border-dashed border-white rounded-2xl">
      <UploadDropzone
        className="border-none ut-label:text-lg text-black font-extrabold"
        appearance={{
          uploadIcon: "text-white",
          label: "text-black",
          button:
            "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400",
        }}
        endpoint={"pdfUploader"}
        onClientUploadComplete={(res) => {
          // Do something with the response
          toast.success("Successfully Uploaded");
          onSubmit(res);
          console.log("Uploaded: ", res);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error("Failed Try again");
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}

export default DropUpload;
