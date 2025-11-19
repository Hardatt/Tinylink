const pool = require("../db");
const generateCode = require("../utils/generateCode");

exports.createLink = async (req, res) => {
  try {
    const { url, code } = req.body;

    try { new URL(url); } 
    catch { return res.status(400).json({ error: "Invalid URL" }); }

    const shortCode = code || generateCode();

    const exists = await pool.query("SELECT 1 FROM links WHERE code = $1", [shortCode]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: "Code exists" });

    await pool.query(
      "INSERT INTO links (code, url) VALUES ($1, $2)",
      [shortCode, url]
    );

    res.status(201).json({ code: shortCode, url });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllLinks = async (req, res) => {
  const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
  res.json(result.rows);
};

exports.getSingleLink = async (req, res) => {
  const { code } = req.params;
  const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
};

exports.deleteLink = async (req, res) => {
  const { code } = req.params;
  await pool.query("DELETE FROM links WHERE code = $1", [code]);
  res.json({ success: true });
};

exports.redirect = async (req, res) => {
  const { code } = req.params;
  const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rows.length === 0) return res.status(404).send("Not Found");

  const link = result.rows[0];

  await pool.query(
    "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = $1",
    [code]
  );

  res.redirect(302, link.url);
};
