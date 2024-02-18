import { getEmbeddings } from "@/app/utils/embedding/embedding-gen";
import { getMatchesFromEmbeddings } from "@/app/utils/pinecone/pinecone";

export type MetaData = {
  text: string;
  pageNumber: number;
  hash: string;
  fromLoc: number;
  toLoc: number;
  chunk: string;
};

export async function getContext(
  message: string,
  fileKey: string,
  miniscore = 0.7,
  getOnlyText = true
) {
  // Covert give message to the embeddings

  const embeddings = await getEmbeddings(message);

  //search for the similar embeddings in pinecone
  const matches = await getMatchesFromEmbeddings(embeddings, 5, fileKey);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > miniscore
  );

  if (!getOnlyText) {
    // Use a map to deduplicate matches by URL
    return qualifyingDocs;
  }
  let docs = matches
    ? qualifyingDocs.map((matches) => (matches.metadata as MetaData).chunk)
    : [];

  return docs.join("\n").substring(0, 3000);
}
