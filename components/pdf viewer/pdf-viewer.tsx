"use client";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${url}&8embedded=true`}
      className="w-full h-full"></iframe>
  );
}
