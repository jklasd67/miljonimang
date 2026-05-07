const express = require("express");
const path = require("path");

const taskRoutes = require("./routes/tasks");
const gameRoutes = require("./routes/game");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/tasks", taskRoutes);
app.use("/api/game", gameRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Miljonimang kaivitus: http://localhost:${PORT}`);
});
