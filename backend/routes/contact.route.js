import express from "express";
import { Contact } from "../models/contact.model.js";
import { protect } from "../middlewares/auth.middlerware.js";
import { isAdmin } from "../middlewares/auth.middlerware.js";

const router = express.Router();

// Add contact message - public
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = new Contact({
      name,
      email,
      message,
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all contacts - admin only
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

export default router;
