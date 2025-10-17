import { crawlExamScores } from "../services/crawlService.js";

export async function handleCrawl(req, res) {
  try {
    const total = await crawlExamScores();
    res.json({ message: `Crawled ${total} records successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
