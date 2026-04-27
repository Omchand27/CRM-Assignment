import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Add Lead
router.post("/leads", async (req, res) => {
  const { name, phone, source } = req.body;

  const { data, error } = await supabase
    .from("leads")
    .insert([{ name, phone, source }])
    .select();

  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

// Get Leads
router.get("/leads", async (req, res) => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Update Status
router.put("/leads/:id", async (req, res) => {
  const { status } = req.body;

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", req.params.id);

  if (error) return res.status(400).json(error);
  res.json({ message: "Updated" });
});

// Delete Lead
router.delete("/leads/:id", async (req, res) => {
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json(error);
  res.json({ message: "Deleted" });
});

export default router;