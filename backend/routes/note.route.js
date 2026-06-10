import express from 'express';
import Note from '../models/note.model.js'
import { protect } from '../middlewares/auth.middlerware.js';

const router = express.Router();

// ── SAVE OR UPDATE NOTES (UPSERT) ──
router.post('/save', protect, async (req, res) => {
  try {
    const { courseId, lessonNotes } = req.body;
    const userId = req.user.id; // Authentication middleware se attached user state

    if (!courseId || !lessonNotes) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const updatedNotes = await Note.findOneAndUpdate(
      { userId, courseId },
      { $set: { lessonNotes } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Notes successfully saved to cloud storage.',
      data: updatedNotes.lessonNotes
    });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ success: false, message: 'Internal server compilation error.' });
  }
});

// ── GET SAVED NOTES FOR COURSE ──
router.get('/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const notesDoc = await Note.findOne({ userId, courseId });
    
    res.status(200).json({
      success: true,
      data: notesDoc ? notesDoc.lessonNotes : {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database query execution error.' });
  }
});

export default router; // Router bundle ko export kiya