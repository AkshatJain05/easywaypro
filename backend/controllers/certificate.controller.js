import PDFDocument from "pdfkit";
import { Certificates } from "../models/certificateCourse.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";


export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Auth Validation Check
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({ success: false, message: "User authentication missing or token invalid." });
    }
    const userId = req.user._id || req.user.id;

    // 1. Fetch Course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Backend Error: Course model not found." });
    }

    // ── STEP FORWARD LOGIC: Strict enableCertificate validation verification ──
    if (course.enableCertificate !== true) {
      return res.status(403).json({ 
        success: false, 
        message: "Certificate download is not available yet. Remaining course topics are still pending from the instructor's side. You will be notified once it is available." 
      });
    }

    // 2. Fetch Purchase (Aapke JSON ke mutabik status "completed" check ho raha hai)
    const purchase = await Purchase.findOne({ user: userId, course: courseId });
    if (!purchase) {
      return res.status(403).json({ success: false, message: "You have not purchased this course or enrollment record is missing." });
    }

    // 3. LOGIC: Progress validation check
    const progress = purchase.progress || 0;
    if (progress < 70) {
      return res.status(403).json({ 
        success: false, 
        message: `Requirement Failed: At least 70% progress required. Your progress: ${progress.toFixed(0)}%` 
      });
    }

    // 5. Fetch User Profile safely for College / Name metadata
    const userData = await User.findById(userId).select("name email CollegeName");
    const studentName = userData?.name || "Verified Student";

    // 6. Check/Create Certificate Record in DB
    let cert = await Certificates.findOne({ user: userId, course: courseId });
    if (!cert) {
      const certId = `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;
      try {
        cert = await Certificates.create({ 
          user: userId, 
          course: courseId, 
          purchase: purchase._id, 
          certificateId: certId 
        });
        
        purchase.certificateIssued = true;
        purchase.certificateIssuedAt = new Date();
        await purchase.save();
      } catch (dbErr) {
        console.error("Certificate Collection Write Error:", dbErr);
        return res.status(500).json({ success: false, message: "Failed to write certificate entry to database.", error: dbErr.message });
      }
    }

    // 7. INITIALIZE PDFKIT ENGINE STREAM PIPELINE
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 40, bottom: 40, left: 40, right: 40 }
    });

    // HTTP Response Streams headers configuration
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${cert.certificateId}.pdf`);

    doc.pipe(res);

   const gold = "#D4AF37";
const dark = "#0F172A";
const gray = "#64748B";

// Border
doc
  .rect(15, 15, doc.page.width - 30, doc.page.height - 30)
  .lineWidth(4)
  .stroke(gold);

doc
  .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
  .lineWidth(1)
  .stroke(gold);

// Watermark
doc.save();

doc.fillOpacity(0.03);

doc
  .fillColor("#BBBBBB")
  .font("Helvetica-Bold")
  .fontSize(60)
  .text(
    "EASYWAY PRO",
    80,   // move right
    250,
    {
      align: "center",
      lineBreak: false
    }
  );

doc.restore();
// =====================================
// TOP BRANDING
// =====================================

doc
  .fillColor(gold)
  .font("Helvetica-Bold")
  .fontSize(22)
  .text(
    "EASYWAY PRO",
    0,
    40,
    {
      align: "center"
    }
  );

doc
  .fillColor(gray)
  .font("Helvetica-Oblique")
  .fontSize(9)
  .text(
    "Empowering Skills. Building Futures.",
    0,
    65,
    {
      align: "center"
    }
  );


// =====================================
// TITLE
// =====================================

doc
  .fillColor(dark)
  .font("Helvetica-Bold")
  .fontSize(28)
  .text(
    "CERTIFICATE OF ACHIEVEMENT",
    0,
    110,
    {
      align: "center"
    }
  );


// =====================================
// AWARDED TO
// =====================================

doc
  .fillColor(gray)
  .font("Helvetica")
  .fontSize(12)
  .text(
    "This Certificate is Awarded To",
    0,
    160,
    {
      align: "center"
    }
  );


// =====================================
// STUDENT NAME
// =====================================

doc
  .fillColor(dark)
  .font("Helvetica-Bold")
  .fontSize(34)
  .text(
    studentName.toUpperCase(),
    0,
    195,
    {
      align: "center"
    }
  );

doc
  .moveTo(180, 245)
  .lineTo(doc.page.width - 180, 245)
  .stroke(gold);


// =====================================
// COURSE TEXT
// =====================================

doc
  .fillColor(gray)
  .font("Helvetica")
  .fontSize(12)
  .text(
    "For Successfully Completing",
    0,
    270,
    {
      align: "center"
    }
  );


// =====================================
// COURSE BOX
// =====================================

doc
  .roundedRect(
    170,
    300,
    doc.page.width - 340,
    45,
    8
  )
  .fill("#FFF8E7");

doc
  .fillColor("#B8860B")
  .font("Helvetica-Bold")
  .fontSize(18)
  .text(
    course.title.toUpperCase(),
    170,
    315,
    {
      width: doc.page.width - 340,
      align: "center"
    }
  );


// =====================================
// DESCRIPTION
// =====================================

doc
  .fillColor(gray)
  .font("Helvetica")
  .fontSize(11)
  .text(
    "This certificate recognizes the successful completion of all required learning objectives, assessments and practical exercises associated with the program.",
    140,
    370,
    {
      width: doc.page.width - 280,
      align: "center"
    }
  );


// =====================================
// GUIDANCE
// =====================================

doc
  .fillColor(gray)
  .font("Helvetica")
  .fontSize(11)
  .text(
    "Under the Guidance of",
    0,
    440,
    {
      align: "center"
    }
  );

doc
  .fillColor(dark)
  .font("Helvetica-Bold")
  .fontSize(15)
  .text(
    course.instructor?.name || "Lead Instructor",
    0,
    460,
    {
      align: "center"
    }
  );

doc
  .fillColor(gray)
  .fontSize(10)
  .text(
    "Lead Instructor",
    0,
    480,
    {
      align: "center"
    }
  );


// =====================================
// SIGNATURES
// =====================================

const signY = 500;

// doc
//   .moveTo(90, signY)
//   .lineTo(240, signY)
//   .stroke("#94A3B8");

// doc
//   .fillColor(gray)
//   .fontSize(9)
//   .text(
//     "Instructor Signature",
//     90,
//     signY + 8,
//     {
//       width: 150,
//       align: "center"
//     }
//   );

// doc
//   .moveTo(
//     doc.page.width - 240,
//     signY
//   )
//   .lineTo(
//     doc.page.width - 90,
//     signY
//   )
//   .stroke("#94A3B8");

// doc
//   .text(
//     "Authorized By Easyway Pro",
//     doc.page.width - 240,
//     signY + 8,
//     {
//       width: 150,
//       align: "center"
//     }
//   );


// =====================================
// FOOTER
// =====================================

doc
  .fillColor(gray)
  .font("Helvetica")
  .fontSize(9)
  .text(
    `Issued On: ${new Date(
      purchase.certificateIssuedAt || Date.now()
    ).toLocaleDateString()}`,
    50,
    540
  );

doc
  .text(
    `Certificate ID: ${cert.certificateId}`,
    doc.page.width - 270,
    540
  );

doc.end();

  } catch (err) {
    // Isse aapko Node terminal me pata chalega ki 500 error ki exact line kahan hai
    console.error("CRITICAL RUNTIME ERROR IN CONTROLLER STACK:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Internal server compilation error.", error: err.message });
    }
  }
};

// Admin: Manually issue certificate
export const adminIssueCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const certId = `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;
    const cert = await Certificates.create({ user: userId, course: courseId, certificateId: certId });
    await Purchase.findOneAndUpdate({ user: userId, course: courseId }, { certificateIssued: true, certificateIssuedAt: new Date() });
    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Express Handler Endpoint matching route: GET /api/certificates/verify/:id
export const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // Search the certificate layout, populating connected student & course metrics
    const certificate = await Certificates.findOne({ certificateId: id })
      .populate('user', 'name email')
      .populate('course', 'title instructor description');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'No digital badge registry record maps to that specific tracking reference string.'
      });
    }

    return res.status(200).json({
      success: true,
      certificate
    });

  } catch (error) {
    console.error("Internal Verification Stack Error:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to access database registry services.'
    });
  }
};