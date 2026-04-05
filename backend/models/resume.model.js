import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  institution: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" }
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  jobTitle: { type: String, default: "" },
  company: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  description: { type: String, default: "" }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  techStack: { type: String, default: "" },
  link: { type: String, default: "" },
  description: { type: String, default: "" }
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  issuer: { type: String, default: "" },
  date: { type: String, default: "" }
}, { _id: false });

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      default: "Untitled Resume",
      required: true
    },

    personalInfo: {
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    education: {
      type: Array,
      default: []
    },

    experience: {
      type: Array,
      default: []
    },

    skills: {
      type: Array,
      default: []
    },

    projects: {
      type: Array,
      default: []
    },

    certifications: {
      type: Array,
      default: []
    },

    isDefault: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", ResumeSchema);
























// import mongoose from "mongoose";

// const ResumeSchema = new mongoose.Schema(
//   {
//     personalInfo: {
//       name: { type: String, default: "" },
//       title: { type: String, default: "" },
//       email: { type: String, default: "" },
//       phone: { type: String, default: "" },
//       address: { type: String, default: "" },
//       linkedin: { type: String, default: "" },
//       github: { type: String, default: "" },
//       portfolio: { type: String, default: "" },
//       summary: { type: String, default: "" },
//     },
//     education: { type: Array, default: [] },
//     experience: { type: Array, default: [] },
//     skills: { type: Array, default: [] },
//     projects: { type: Array, default: [] },
//     certifications: { type: Array, default: [] },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if multi-user
//   },
//   { timestamps: true }
// );

// export const Resume = mongoose.model("Resume", ResumeSchema);






// import mongoose from "mongoose";

// const EducationSchema = new mongoose.Schema({
//   degree: { type: String, default: "" },
//   institution: { type: String, default: "" },
//   location: { type: String, default: "" },
//   startDate: { type: String, default: "" },
//   endDate: { type: String, default: "" },
//   description: { type: String, default: "" }
// }, { _id: false });

// const ExperienceSchema = new mongoose.Schema({
//   jobTitle: { type: String, default: "" },
//   company: { type: String, default: "" },
//   location: { type: String, default: "" },
//   startDate: { type: String, default: "" },
//   endDate: { type: String, default: "" },
//   description: { type: String, default: "" }
// }, { _id: false });

// const ProjectSchema = new mongoose.Schema({
//   title: { type: String, default: "" },
//   techStack: { type: String, default: "" },
//   link: { type: String, default: "" },
//   description: { type: String, default: "" }
// }, { _id: false });

// const CertificationSchema = new mongoose.Schema({
//   name: { type: String, default: "" },
//   issuer: { type: String, default: "" },
//   date: { type: String, default: "" }
// }, { _id: false });

// const ResumeSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true
//     },

//     title: {
//       type: String,
//       default: "Untitled Resume",
//       required: true
//     },

//     personalInfo: {
//       name: { type: String, default: "" },
//       title: { type: String, default: "" },
//       email: { type: String, default: "" },
//       phone: { type: String, default: "" },
//       address: { type: String, default: "" },
//       linkedin: { type: String, default: "" },
//       github: { type: String, default: "" },
//       portfolio: { type: String, default: "" },
//       summary: { type: String, default: "" },
//     },

//     education: {
//       type: [EducationSchema],
//       default: []
//     },

//     experience: {
//       type: [ExperienceSchema],
//       default: []
//     },

//     skills: {
//       type: [String],
//       default: []
//     },

//     projects: {
//       type: [ProjectSchema],
//       default: []
//     },

//     certifications: {
//       type: [CertificationSchema],
//       default: []
//     },

//     isDefault: {
//       type: Boolean,
//       default: false
//     }

//   },
//   { timestamps: true }
// );

// export const Resume = mongoose.model("Resume", ResumeSchema);
