const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

// POST /api/contact → Guest sends a message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = await Contact.create({ name, email, message, status: "new" });
    res.json({ success: true, contact });
  } catch (err) {
    console.error("❌ Contact form error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
