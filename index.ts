// index.ts
import "dotenv/config";
import { addDocument, createCollection, queryCollection } from "./lib/chroma";
import { db } from "./lib/db";
import { askQuestion } from "./lib/askQuestion";
import { ChromaClient } from "chromadb";

(async () => {
  await createCollection("deal_versions"); // run once
  const rows = await db.query(
    "SELECT * FROM cdm_plan_data_versions where division_id = 4 and ad_date = '04-MAR-2020'"
  );
  console.log(rows);
  for (const [index, row] of rows.rows.entries()) {
    await addDocument(
      {
        pageContent: `${row.wh_item_code} has a Vendor deal ${row.deal_type_name} from ${row.deal_start_date} to ${row.deal_end_date} with Deal Rate of ${row.deal_rate} and a customer deal ${row.customer_deal_type_name} from ${row.reflect_start_date} to ${row.reflect_end_date} with rate of ${row.reflect_rate} for and ad date of ${row.ad_date}`,
        metadata: {
          source: "Deals",
        },
        id: row.wh_item_code,
      },
      index,
      "deal_versions"
    );
  }
  //   addDocument({
  //     pageContent:
  //       "Venkatesh is a Sr. Software Engineer woks at CloudIO Inc. from 13years",
  //   });
  // await queryCollection("How many deals do we have ?");
  // await askQuestion(
  //   "what is the average deal rate? on how many deals you did the average?"
  // );

  await getCollectionStats("deal_versions");
  await askQuestion(
    "what is the average deal rate? on how many deals you did the average?"
  );
})();

async function getCollectionStats(name: string) {
  const res = await fetch(`http://localhost:8000/api/v1/collections/${name}`);
  const data = await res.json();
  console.log(`✅ Collection "${name}" contains ${data?.size || 0} documents`);
}
