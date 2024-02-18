import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import React from "react";
import { Document } from "langchain/document";
import EmbeddingGenerator from "../embedding/embedding-gen";
import { truncateStringByBytes } from "../string-by-bytes/truncateString";

export interface TextSplitterProps {
  pageContent: string;
  metadata: {
    pageNumber: any;
  };
}

export default async function TextSplitter(data: TextSplitterProps) {
  const pageContent = data.pageContent;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 100,
  });

  console.log(`Text Splitter Data ${data}`);

  // const output = await splitter.createDocuments(
  //   data.map((item) => item.pageContent)
  // );

  const output = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: data.metadata.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  // const output = await splitter.createDocuments(text, pageNumber);

  console.log(`Text Splitter Output ${JSON.stringify(output)}`);

  // const vectors = await EmbeddingGenerator(output);

  // console.log(`text-spillter.ts', ${vectors}`);

  return output;
}

// const res = TextSplitter(data);

// console.log(`text-spillter.ts Output Final', ${JSON.stringify(res)}`);
