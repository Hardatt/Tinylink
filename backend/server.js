const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const linkRoutes = require("./routes/linkRoutes");
const ctrl = require("./controllers/linkController");

app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

app.use("/api", linkRoutes);

app.get("/:code", ctrl.redirect);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
