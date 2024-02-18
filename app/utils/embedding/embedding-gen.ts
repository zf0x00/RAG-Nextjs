// import { Document } from "langchain/document";
// import { HfInference } from "@huggingface/inference";
// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env" });
// import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";

// if (!process.env.HUGGING_FACE) {
//   throw new Error("HUGGING_FACE API not found");
// }
// const hf = new HfInference(process.env.HUGGING_FACE);

// interface EmbeddingProps {
//   pageContent: string;
// }

// export default async function EmbeddingGenerator(data: EmbeddingProps[]) {
//   console.log(`embedding-gen.ts', ${JSON.stringify(data)}`);

//   const model = new HuggingFaceTransformersEmbeddings({
//     modelName: "Xenova/all-MiniLM-L6-v2",
//   });

//   /* Embed documents */
//   const documentRes = await model.embedDocuments(data.pageContent);
//   console.log(`Document Res ${documentRes}`);

//   return documentRes;
// }

import { OpenAIApi, Configuration } from "openai-edge";
import { setInterval } from "timers/promises";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function getEmbeddings(input: string) {
  // console.log(`embedding-gen.ts', ${input.replace(/\n/g, " ")}`);

  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: input.replace(/\n/g, " "),
    });

    const result = await response.json();
    console.log(`embedding-gen.ts result ', ${JSON.stringify(result)}`);

    return result.data[0].embedding as number[];
  } catch (e) {
    console.log("Error calling OpenAI embedding API: ", e);
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
