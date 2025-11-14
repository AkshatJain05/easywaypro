import Doc from "../models/docs.model.js";

/* =========================================================
   📘 GET ALL DOCS
========================================================= */
export const getAllDocs = async (req, res) => {
  try {
    const docs = await Doc.find().sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch docs", error: err.message });
  }
};

/* =========================================================
   📗 GET DOC BY ID
========================================================= */
export const getDocById = async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doc", error: err.message });
  }
};

/* =========================================================
   📙 CREATE A NEW DOC (with multiple Qs & Ans)
========================================================= */
export const createDoc = async (req, res) => {
  try {
    const newDoc = new Doc(req.body);
    await newDoc.save();
    res.status(201).json({ message: "Doc created successfully", doc: newDoc });
  } catch (err) {
    res.status(400).json({ message: "Failed to create doc", error: err.message });
  }
};

/* =========================================================
   📝 UPDATE AN EXISTING DOC (subject/description)
========================================================= */
export const updateDoc = async (req, res) => {
  try {
    const updated = await Doc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Doc not found" });
    res.status(200).json({ message: "Doc updated successfully", doc: updated });
  } catch (err) {
    res.status(400).json({ message: "Failed to update doc", error: err.message });
  }
};

/* =========================================================
   ❌ DELETE A DOC
========================================================= */
export const deleteDoc = async (req, res) => {
  try {
    const deleted = await Doc.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doc not found" });
    res.status(200).json({ message: "Doc deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete doc", error: err.message });
  }
};

/* =========================================================
   ➕ ADD QUESTION TO EXISTING DOC
========================================================= */
export const addQuestion = async (req, res) => {
  try {
    const { id } = req.params; // doc id
    const { title, Q, ans } = req.body;

    const doc = await Doc.findById(id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    doc.questions.push({ title, Q, ans });
    await doc.save();

    res.status(200).json({ message: "Question added successfully", doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to add question", error: err.message });
  }
};

/* =========================================================
   ✏️ UPDATE A QUESTION INSIDE A DOC
========================================================= */
export const updateQuestion = async (req, res) => {
  try {
    const { id, qid } = req.params; // docId, questionId
    const { title, Q, ans } = req.body;

    const doc = await Doc.findById(id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const question = doc.questions.id(qid);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (title) question.title = title;
    if (Q) question.Q = Q;
    if (ans) question.ans = ans;

    await doc.save();
    res.status(200).json({ message: "Question updated successfully", doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to update question", error: err.message });
  }
};

/* =========================================================
   🧾 DELETE QUESTION FROM DOC
========================================================= */
export const deleteQuestion = async (req, res) => {
  try {
    const { id, qid } = req.params;
    const doc = await Doc.findById(id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const question = doc.questions.id(qid);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.remove();
    await doc.save();

    res.status(200).json({ message: "Question deleted successfully", doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question", error: err.message });
  }
};

/* =========================================================
   ➕ ADD ANSWER TO A QUESTION INSIDE DOC
========================================================= */
export const addAnswer = async (req, res) => {
  try {
    const { id, qid } = req.params; // doc id & question id
    const { type, content } = req.body;

    const doc = await Doc.findById(id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const question = doc.questions.id(qid);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.ans.push({ type, content });
    await doc.save();

    res.status(200).json({ message: "Answer added successfully", doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to add answer", error: err.message });
  }
};
