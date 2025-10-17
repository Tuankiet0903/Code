import axios from "axios";
import fs from "fs-extra";
import { PROVINCES } from "../utils/crawlProvinces.js";
import pLimit from "p-limit";
import colors from "colors";

const CONCURRENCY_LIMIT = 1;
const limit = pLimit(CONCURRENCY_LIMIT);

const YEAR = 2025;
const OUTPUT_DIR = `./data/${YEAR}`;
const END_ID = 200; // Số lượng ID / tỉnh

let totalRecords = 0;

async function crawlProvince(province) {
  const outPath = `${OUTPUT_DIR}/${province.name}.json`;
  await fs.ensureFile(outPath);
  const stream = fs.createWriteStream(outPath);
  stream.write("[");

  let first = true;
  let count = 0;

  console.log(colors.yellow(`\n▶️  Crawling ${province.name}...`));

  for (let i = 1; i <= END_ID; i++) {
    const id = `${province.code}${i.toString().padStart(6, "0")}`;
    const url = `https://api-university-2022.beecost.vn/university/lookup_examiner?id=${id}`;

    try {
      const res = await axios.get(url, { timeout: 5000 });
      const data = res.data?.data?.scores;
      if (!data?.id) continue;

      const student = {
        id: data.id,
        province: province.name,
        year: data.year,
        math: data.mathematics_score,
        physical: data.physics_score,
        chemistry: data.chemistry_score,
        literature: data.literature_score,
        history: data.history_score,
        geography: data.geography_score,
        civics: data.civic_education_score,
        language: data.foreign_language_score,
        lang_type: data.foreign_language_type,
      };

      Object.keys(student).forEach(
        (k) => (student[k] == null || student[k] === "") && delete student[k]
      );

      if (!first) stream.write(",");
      stream.write(JSON.stringify(student));
      first = false;

      count++;

      // 👉 Hiện tiến trình rõ ràng: 1/200, 2/200, ...
      process.stdout.write(`📍 [${province.name}] ${i}/${END_ID}\r`);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(`\n❌ [${province.name}] - ${id}: ${err.message}`);
      }
    }
  }

  stream.write("]");
  stream.end();

  totalRecords += count;
  console.log(colors.green(`\n✅ Done [${province.name}] (${count} records)`));
}

export async function crawlAll() {
  console.log(
    `🚀 Starting THPT data crawler...\n⚙️  Limit concurrency: ${CONCURRENCY_LIMIT}\n`
  );

  const startTime = performance.now();

  const tasks = PROVINCES.map((province) =>
    limit(async () => {
      await crawlProvince(province);
    })
  );

  await Promise.all(tasks);

  const endTime = performance.now();
  const durationSec = ((endTime - startTime) / 1000).toFixed(2);
  const durationMin = (durationSec / 60).toFixed(2);

  console.log("\n🎉 All provinces completed!");
  console.log(colors.green(`📦 Total records crawled: ${totalRecords}`));
  console.log(
    colors.cyan(`⏱️  Elapsed time: ${durationMin} min (${durationSec} sec)\n`)
  );
}
