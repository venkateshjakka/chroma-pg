// lib/chroma.ts
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const CHROMA_URL = "http://localhost:8000";

const embeddings = new OpenAIEmbeddings();

export const addDocument = async (document, index, collectionName) => {
  const vectorstore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
    url: CHROMA_URL,
  });
  const a = await vectorstore.addDocuments([new Document(document)]);
  console.log(`Inserted Index ${index} record into the collection ${a}`);
};

export const createCollection = async (collectionName) => {
  const vectorstore = await Chroma.fromDocuments([], embeddings, {
    collectionName,
    url: CHROMA_URL,
  });

  console.log(`✅ Collection created and documents stored. ${vectorstore}`);
};

export const queryCollection = async (
  query: string,
  collectionName: string
) => {
  const vectorstore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
    url: CHROMA_URL,
  });

  const result = await vectorstore.similaritySearch(query, 1);
  console.log("🔍 Result:", result);
};
