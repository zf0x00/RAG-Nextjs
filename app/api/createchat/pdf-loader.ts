import { metadata } from "./../../layout";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { truncateStringByBytes } from "@/app/utils/string-by-bytes/truncateString";
import md5 from "md5";
import { getEmbeddings } from "@/app/utils/embedding/embedding-gen";
import { utils as PineconeUtils, Vector } from "@pinecone-database/pinecone";
import { getPineconeClient } from "@/app/utils/pinecone/pinecone";
import { string } from "zod";

const { chunkedUpsert, createIndexIfNotExists } = PineconeUtils;

export async function pdfLoader(fileUrl: string, fileKey: string) {
  const f = await fetch(fileUrl)
    .then((response) => response.blob())
    .then(async (blob) => {
      const loader = new PDFLoader(blob, {
        splitPages: true,
      });

      const docs = await loader.load();

      //   console.log(`New Pdf Loader', ${JSON.stringify(docs)}`);

      const extractedDataArray = docs.map((item) => {
        const pageContent = item.pageContent;
        const number = item.metadata.loc.pageNumber;

        return {
          pageContent: pageContent,
          metadata: {
            pagenumber: number,
          },
        };
      });

      console.log(
        `pdf-loader.ts extractedDataArray', ${JSON.stringify(
          extractedDataArray
        )}`
      );

      return extractedDataArray;
    });

  const splittedPdf = await Promise.all(f.map((item) => splitPdf(item)));

  return splittedPdf[0];
}

async function splitPdf(data: Document) {
  console.log(`pdf-loader.ts ENTRYDATA', ${JSON.stringify(data)}`);

  const pageContent = data.pageContent;
  const Pagenum = data.metadata.pagenumber;

  console.log(`pdf-loader.ts pageNumber', ${JSON.stringify(Pagenum)}`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const output = await splitter.splitDocuments([
    new Document({
      pageContent: pageContent,
      metadata: {
        pageNumber: Pagenum,
        text: truncateStringByBytes(pageContent, 3600),
      },
    }),
  ]);
  console.log(`pdf-loader.ts output', ${JSON.stringify(output)}`);

  const final = output.map((doc: Document) => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        pageNumber: doc.metadata.pageNumber as number,
        hash: md5(doc.pageContent),
        //@ts-ignore
        fromLoc: doc.metadata.loc.lines.from as string,
        //@ts-ignore
        toLoc: doc.metadata.loc.lines.to as string,
      },
    };
  });

  console.log(`pdf-loader.ts final', ${JSON.stringify(final)}`);

  const vectors = await Promise.all(final.flat().map(embedDocuments));

  // console.log(`pdf-loader.ts final', ${JSON.stringify(final)}`);

  console.log(`pdf-loader.ts vectors', ${JSON.stringify(vectors)}`);

  //upsert vector to database
  await seed(vectors);
}

async function embedDocuments(doc: Document): Promise<Vector> {
  try {
    // console.log(`pdf-loader.ts org', ${JSON.stringify(doc)}`);

    const embedding = await getEmbeddings(doc.pageContent);

    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embedding,
      metadata: {
        chunk: doc.pageContent,
        text: doc.metadata.text as string,
        pageNumber: doc.metadata.pageNumber as number,
        hash: doc.metadata.hash as string,
        fromLoc: doc.metadata.fromLoc as number,
        toLoc: doc.metadata.toLoc as number,
      },
    } as Vector;
  } catch (error) {
    console.log("Error embedding document: ", error);
    throw error;
  }
}

async function seed(vectors: Vector[]) {
  try {
    console.log(`pdf-loader.ts seed', ${vectors}`);

    const pinecone = await getPineconeClient();

    const indexName = process.env.PINECONE_INDEX;

    await createIndexIfNotExists(pinecone!, indexName!, 512);
    const index = pinecone && pinecone.Index(indexName!);

    await chunkedUpsert(index, vectors, "", 10);
  } catch (error) {
    console.error("Error seeding:", error);
    throw error;
  }
}
