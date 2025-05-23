// lib/askQuestion.ts
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

const CHROMA_URL = "http://localhost:8000";
const COLLECTION_NAME = "deal_versions";

export const askQuestion = async (question: string, kDocs?: number) => {
  const embeddings = new OpenAIEmbeddings();

  const vectorstore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: COLLECTION_NAME,
    url: CHROMA_URL,
  });

  const docs = await vectorstore.similaritySearch(question, kDocs ?? 50);
  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4", // or "gpt-4"
  });

  const prompt = `
You are a helpful assistant. Based on the following context, answer the user's question.

Context:
${context}

Question: ${question}
`;

  const res = await llm.invoke(prompt);
  console.log("🧠 Answer:", res.content);
};
