// routes/contact.js
import express from "express";
const router = express.Router();

// Example MongoDB model
import Contact from "../pages/ContactPage.js";

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = await Contact.create({ name, email, message, status: "new" });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
