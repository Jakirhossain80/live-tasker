import express = require("express");
import cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "LiveTasker API is running",
  });
});

app.listen(port, () => {
  console.log(`LiveTasker API is running on port ${port}`);
});
