import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FaClock, FaCertificate, FaUserTie, FaVideo, FaTasks, FaCheckCircle, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import java from "../../assets/java.png";
import python from "../../assets/python.png";

export default function PaidCourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const courseData = {
    java: {
      title: "Java Placement Mastery",
      image: java,
      price: "₹999",
      duration: "6 Weeks",
      level: "Intermediate",
      certificate: true,
      live: true,
      mockInterview: true,
      syllabus: [
        "Java Basics, Loops & Arrays",
        "OOPs Concepts (Inheritance, Polymorphism)",
        "Exception Handling & File I/O",
        "Collections Framework (List, Set, Map)",
        "Multi-threading & Generics",
        "Data Structures & Algorithms in Java",
        "Project: Build a Mini Placement Portal",
      ],
      features: [
        "50+ Hours of HD Video Lectures",
        "Weekly Doubt Solving Sessions",
        "Industry Projects & Quizzes",
        "Mock Interviews with Mentors",
        "Placement & Resume Assistance",
        "Certificate of Completion",
      ],
      description:
        "This placement-focused Java course covers everything from core concepts to advanced problem solving. Designed for B.Tech students and beginners aiming for product-based company interviews.",
    },

    python: {
      title: "Python Pro Bootcamp",
      image: python,
      price: "₹799",
      duration: "4 Weeks",
      level: "Beginner",
      certificate: true,
      live: false,
      mockInterview: false,
      syllabus: [
        "Python Fundamentals & Syntax",
        "Data Structures (List, Dict, Tuple)",
        "File Handling & Exception Management",
        "Automation Projects using Python",
        "Mini Project: Web Scraper / API App",
        "Introduction to Data Science",
      ],
      features: [
        "30+ Hours of Video Lessons",
        "Hands-on Exercises & Assignments",
        "Beginner Friendly Explanation",
        "Lifetime Access to Materials",
        "Certificate After Completion",
      ],
      description:
        "Master Python programming with practical exercises, automation projects, and real-world use cases. Ideal for beginners wanting to enter coding, automation, or data science fields.",
    },
  };

  const course = courseData[id] || courseData.java;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 px-6 py-10">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-fuchsia-400 mb-8"
      >
        <FaArrowLeft /> Back to Courses
      </motion.button>

      {/* Main Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Course Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-purple-500/40 p-6 shadow-lg flex justify-center items-center"
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-contain rounded-xl"
          />
        </motion.div>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-400 text-transparent bg-clip-text">
            {course.title}
          </h1>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{course.description}</p>

          <div className="flex flex-wrap gap-4 text-sm sm:text-base">
            <span className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
              <FaClock className="text-fuchsia-400" /> {course.duration}
            </span>
            <span className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
              <FaUserTie className="text-sky-400" /> {course.level}
            </span>
            {course.certificate && (
              <span className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                <FaCertificate className="text-yellow-400" /> Certificate Included
              </span>
            )}
          </div>

          <div className="text-xl font-bold text-fuchsia-400">Price: {course.price}</div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 px-6 py-3 rounded-xl font-semibold text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
          >
            <FaShoppingCart /> Enroll Now
          </motion.button>
        </motion.div>
      </div>

      {/* Course Details */}
      <div className="max-w-5xl mx-auto mt-14 grid md:grid-cols-2 gap-10">
        {/* Syllabus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-fuchsia-400 mb-4">Syllabus Overview</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            {course.syllabus.map((topic, i) => (
              <li key={i} className="flex items-start gap-2">
                <FaCheckCircle className="text-green-400 mt-1" /> {topic}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-sky-400 mb-4">Course Features</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            {course.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <FaTasks className="text-purple-400 mt-1" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 text-sm text-gray-400">
            {course.live ? (
              <p className="flex items-center gap-2 text-green-400">
                <FaVideo /> Live Classes Included
              </p>
            ) : (
              <p className="flex items-center gap-2 text-yellow-400">
                <FaVideo /> Recorded Sessions Only
              </p>
            )}

            {course.mockInterview ? (
              <p className="flex items-center gap-2 text-green-400 mt-2">
                <FaUserTie /> Mock Interview Rounds Available
              </p>
            ) : (
              <p className="flex items-center gap-2 text-red-400 mt-2">
                <FaUserTie /> No Mock Interviews in this Course
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
