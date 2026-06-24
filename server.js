import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "zerojury",
    sponsor: "0G Compute"
  });
});

app.post("/api/jury", (req, res) => {
  const question =
    typeof req.body?.question === "string"
      ? req.body.question.trim()
      : "";

  if (question.length < 10) {
    return res.status(400).json({
      error: "Question must contain at least 10 characters."
    });
  }

  return res.status(501).json({
    status: "integration_pending",
    message: "The 0G jury integration is the next implementation gate."
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (process.argv[1] === __filename) {
  const port = Number(process.env.PORT || 8080);

  app.listen(port, "0.0.0.0", () => {
    console.log(`ZeroJury listening on port ${port}`);
  });
}
