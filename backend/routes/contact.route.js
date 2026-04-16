const express = require("express");
const Contact = require("../models/Contact"); // <-- Correct model import
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = await Contact.create({ name, email, message, status: "new" });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
