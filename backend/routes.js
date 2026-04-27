const express = require("express");
const router = express.Router();
const pool = require("./db");

// Add Lead
router.post("/leads", async (req, res) => {
  const { name, phone, source } = req.body;
  const result = await pool.query(
    "INSERT INTO leads (name, phone, source, status) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, phone, source, "Interested"]
  );
  res.json(result.rows[0]);
});

// Get Leads
router.get("/leads", async (req, res) => {
  const result = await pool.query("SELECT * FROM leads ORDER BY id DESC");
  res.json(result.rows);
});

// Update Status
router.put("/leads/:id", async (req, res) => {
  const { status } = req.body;
  await pool.query("UPDATE leads SET status=$1 WHERE id=$2", [
    status,
    req.params.id,
  ]);
  res.json({ message: "Updated" });
});

// Delete Lead
router.delete("/leads/:id", async (req, res) => {
  await pool.query("DELETE FROM leads WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

module.exports = router;