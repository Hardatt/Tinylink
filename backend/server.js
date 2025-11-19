const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const linkRoutes = require("./routes/linkRoutes");
const ctrl = require("./controllers/linkController");

app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

app.post("/api/links", (req, res, next) => {
  console.log("DEBUG BODY:", req.body);
  next();
});

app.use("/api", linkRoutes);


app.get("/:code", ctrl.redirect);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
