import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  description: { type: String },
  order: { type: Number, default: 0 },
  isFreePreview: { type: Boolean, default: false }, // Useful addition
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    thumbnail: { type: String, default: "https://placehold.co/600x400/1e293b/94a3b8?text=Course" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number },
    instructor: {
      name: { type: String, required: true },
      bio: { type: String },
      photo: { type: String },
    },
    category: { type: String, trim: true },
    tags: [{ type: String }],
    lessons: [LessonSchema],
    totalDuration: { type: Number, default: 0 },
    validityDays: { type: Number, default: 365 },
    language: { type: String, default: "English" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    rating: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    zoomLink: { type: String },
    zoomSchedule: [
      {
        title: String,
        date: Date,
        link: String,
      },
    ],
    whatsappSupport: { type: String },
    
    // Certificate Logic
    certificateTemplate: { type: String }, // Path or URL to PDF/Image template
    enableCertificate: { type: Boolean, default: false }, // Global toggle for this course
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-generate slug
CourseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export const Course = mongoose.model("Course", CourseSchema);