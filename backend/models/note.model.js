import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  lessonNotes: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

// User aur Course ka compound unique index
NoteSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Note = mongoose.model('Note', NoteSchema);
export default Note; // Default export use kiya hai yahan