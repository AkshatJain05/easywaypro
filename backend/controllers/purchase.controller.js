import Razorpay from "razorpay";
import crypto from "crypto";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Check if already purchased
    const existing = await Purchase.findOne({ user: req.user._id, course: courseId, status: "completed" });
    if (existing && !existing.isExpired) {
      return res.status(400).json({ success: false, message: "You already have access to this course" });
    }

    const amount = (course.discountPrice || course.price) * 100; // Razorpay in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { courseId: courseId.toString(), userId: req.user._id.toString() },
    });

    // Create pending purchase
    const purchase = await Purchase.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        user: req.user._id,
        course: courseId,
        razorpayOrderId: order.id,
        amount: course.discountPrice || course.price,
        status: "pending",
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      course: { title: course.title, thumbnail: course.thumbnail },
      user: { name: req.user.name, email: req.user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Purchase.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const course = await Course.findById(courseId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (course.validityDays || 365));

    const purchase = await Purchase.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "completed",
        purchasedAt: new Date(),
        expiresAt,
        isExpired: false,
      },
      { new: true }
    ).populate("course", "title thumbnail price");

    // Update student count
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.json({ success: true, message: "Payment verified successfully", purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get receipt
export const getReceipt = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("user", "name email phoneNo CollegeName")
      .populate("course", "title price discountPrice instructor thumbnail");
    if (!purchase) return res.status(404).json({ success: false, message: "Receipt not found" });
    if (purchase.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    res.json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Renew course
export const renewCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    const purchase = await Purchase.findOne({ user: req.user._id, course: courseId });
    if (!purchase) return res.status(404).json({ success: false, message: "No previous purchase found" });

    // Create renewal order (same flow as new purchase)
    const amount = (course.discountPrice || course.price) * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `renewal_${Date.now()}`,
    });

    purchase.razorpayOrderId = order.id;
    purchase.status = "pending";
    await purchase.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      isRenewal: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, progress } = req.body;
    const purchase = await Purchase.findOne({ user: req.user._id, course: courseId, status: "completed" });
    if (!purchase) return res.status(404).json({ success: false, message: "Purchase not found" });

    if (lessonId && !purchase.completedLessons.includes(lessonId)) {
      purchase.completedLessons.push(lessonId);
    }
    if (progress !== undefined) purchase.progress = progress;
    purchase.lastAccessed = new Date();

    if (purchase.progress >= 100) {
      purchase.isCompleted = true;
      purchase.completedAt = new Date();
    }

    await purchase.save();
    res.json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
