// import Quiz from "../models/quiz.model.js";
// import Certificate from "../models/certificate.model.js";
// import crypto from "crypto";

// /**
//  * Utility: generate unique certificate ID
//  */
// const generateCertificateId = () => crypto.randomBytes(8).toString("hex"); // 16-char hex

// /**
//  * Fetch all quizzes or by subject
//  */
// export const getQuizzes = async (req, res) => {
//   try {
//     const { subject } = req.query;
//     let quizzes;

//     if (subject) {
//       quizzes = await Quiz.find({ subject });
//       if (!quizzes.length) return res.status(404).json({ message: `No quizzes found for '${subject}'` });
//     } else {
//       quizzes = await Quiz.find();
//       if (!quizzes.length) return res.status(404).json({ message: "No quizzes found" });
//     }

//     res.status(200).json(quizzes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };

// /**
//  * Fetch quiz by ID
//  */
// export const getQuizById = async (req, res) => {
//   try {
//     const { quizId } = req.params;
//     if (!quizId) return res.status(400).json({ message: "Quiz ID required" });

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//     res.status(200).json(quiz);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };

// /**
//  * Submit quiz (score calculation + certificate)
//  * Email now comes from logged-in user (req.user.email)
//  */
// export const submitQuiz = async (req, res) => {
//   const { quizId, answers } = req.body;
//   const email = req.user?.email; // get email from cookie-auth middleware

//   if (!email) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//     let score = 0;

//     quiz.questions.forEach((q, idx) => {
//       const userAnswer = answers[idx];
//       if (!userAnswer) return;

//       if (q.type === "mcq") {
//         const correctOption = q.options.find(opt => opt.isCorrect);
//         if (correctOption && userAnswer === correctOption.text) score += q.marks;
//       } else if (q.type === "code") {
//         if (q.answerHint && userAnswer.toLowerCase().includes(q.answerHint.toLowerCase().split(" ")[0])) {
//           score += q.marks;
//         }
//       }
//     });

//     let certificate = null;
//     if (score >= 70) {
//       certificate = new Certificate({
//         email,
//         subject: quiz.subject,
//         score,
//         certificateId: generateCertificateId()
//       });
//       await certificate.save();
//     }

//     res.json({ score, certificate });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get all certificates for logged-in user
//  */
// export const getCertificates = async (req, res) => {
//   const email = req.user?.email;
//   if (!email) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const certificates = await Certificate.find({ email }).sort({ date: -1 });
//     res.json(certificates);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * Get certificate by certificateId (shareable URL)
//  */
// export const getCertificateById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const certificate = await Certificate.findOne({ certificateId: id });
//     if (!certificate) return res.status(404).json({ message: "Certificate not found" });
//     res.json(certificate);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
