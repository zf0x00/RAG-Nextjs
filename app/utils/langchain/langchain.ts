import { clear } from "console";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export async function upsertDocument(data: string) {
  const loader = new PDFLoader(data, {
    splitPages: false,
  });

  console.log(`Loader ${loader}`);
  const docs = await loader.load();
  console.log(`Docs ${docs}`);

  return docs;
}
