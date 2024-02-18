import TextSplitter, {
  TextSplitterProps,
} from "@/app/utils/splitter/text-spillter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

async function PdftoText(fileUrl: string) {
  const f = await fetch(fileUrl)
    .then((response) => response.blob())
    .then(async (blob) => {
      const loader = new PDFLoader(blob, {
        splitPages: true,
      });

      const docs = await loader.load();

      const extractedDataArray: TextSplitterProps[] = docs.map((item) => {
        const pageContent = item.pageContent;
        const number = item.metadata.loc.pageNumber;

        return {
          pageContent: pageContent,
          metadata: {
            pageNumber: number,
          },
        };
      });

      console.log(`psd-to-text.ts', ${JSON.stringify(extractedDataArray)}`);

      // const splitter = await TextSplitter(
      //   extractedDataArray.map((item) => item)
      // );

      const splitter = await Promise.all(
        extractedDataArray.map((item) => TextSplitter(item))
      );

      console.log(`splitter psd-to-text.ts', ${JSON.stringify(splitter)}`);

      // const vectors = await EmbeddingGenerator(splitter);

      // console.log(`psd-to-text.ts Vectors', ${vectors}`);

      // return vectors;
    });
}

export default PdftoText;
