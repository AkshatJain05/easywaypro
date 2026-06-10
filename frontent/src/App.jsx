import { Routes, Route } from "react-router-dom";

// ── 1. GLOBAL & CORE LAYOUT IMPORTS ───────────────────────────────────
import ScrollToTop from "./ScrollToTop.jsx";
import UserLayout from "./component/UserLayout.jsx";
import AdminLayout from "./component/AdminLayout.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import AdminProtectedRoute from "./component/AdminProtectedRoute.jsx";
import PublicRoute from "./component/PublicRoute.jsx";
import NotFound from "./component/NotFound.jsx";

// ── 2. GENERAL PUBLIC PAGES & LEGAL IMPORTS ───────────────────────────
import Home from "./pages/Home/Home.jsx";
import ContactUs from "./pages/Contact-Us/ContactUs.jsx";
import PrivacyPolicy from "./component/PrivacyPolicy.jsx";
import TermsAndConditions from "./component/Terms&Condition.jsx";

// ── 3. AUTHENTICATION IMPORTS ─────────────────────────────────────────
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";

// ── 4. ACADEMIC & STUDY MATERIAL IMPORTS ──────────────────────────────
import StudyMaterial from "./pages/Study Material/StudyMaterial.jsx";
import Syllabus from "./pages/Study Material/Syllabus.jsx";
import Notes from "./pages/Study Material/Notes.jsx";
import PYQ from "./pages/Study Material/PYQ.jsx";
import VideoLectures from "./pages/Study Material/VideoLecture.jsx";
import QuizPlacement from "./pages/Study Material/Quiz/QuizPlacement.jsx";
import DocsList from "./pages/Study Material/Docs (Notes)/DocsList.jsx";
import DocDetails from "./pages/Study Material/Docs (Notes)/DetailDocs.jsx";

// ── 5. AI FEATURES & PRODUCTIVITY IMPORTS ─────────────────────────────
import EasywayAi from "./pages/Easyway AI/EasywayAi.jsx";
import ChatBot from "./pages/Easyway AI/chatbot/ChatBot.jsx";
import CodeAnalyzer from "./pages/Easyway AI/Code Analyzer/CodeAnalyzer.jsx";
import TodoList from "./pages/TodoList/TodoList.jsx";
import ResumeDashboard from "./pages/Easyway AI/Resume Builder/ResumeDashboard.jsx";
import ResumeBuilder from "./pages/Easyway AI/Resume Builder/ResumeBuilder.jsx";

// ── 6. VISUALIZATION & ROADMAP IMPORTS ────────────────────────────────
import HomePage from "./pages/Visualization/VisaulizationHomePage.jsx";
import SortingPage from "./pages/Visualization/SortingPage.jsx";
import TreePage from "./pages/Visualization/TreePage.jsx";
import RoadmapList from "./pages/Roadmap/RoadmapList.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";

// ── 7. CERTIFICATE & QUIZ SYSTEM IMPORTS ──────────────────────────────
import QuizzesList from "./pages/Certificate/QuizzesList.jsx";
import Quiz from "./pages/Certificate/Quiz.jsx";
import Result from "./pages/Certificate/Result.jsx";
import Certificates from "./pages/Certificate/Certificates.jsx";
import CertificateView from "./pages/Certificate/CertificateView.jsx";

// ── 8. STUDENT COURSE CONSOLE IMPORTS ─────────────────────────────────
import HomePages from "./pages/Courses/HomePage.jsx";
// import Courses from "./pages/Courses/Courses.jsx"; 
import CoursesPage from "./pages/Courses/CoursesPage.jsx";
import CourseDetailPage from "./pages/Courses/CourseDetail.jsx";
import DashboardPage from "./pages/Courses/student/DashboardPage.jsx";
import PurchasedCoursesPage from "./pages/Courses/student/PurchasedCoursesPage.jsx";
import CoursePlayerPage from "./pages/Courses/student/CoursePlayerPage.jsx";
import ResourcesPortal from "./component/ResourcesPortal.jsx";
import AttendancePage from "./pages/Courses/student/AttendancePage.jsx";
import ReceiptPage from "./pages/Courses/student/ReceiptPage.jsx";
import CertificatesPage from "./pages/Courses/student/CertificatesPage.jsx";
import VerifyCertificate from "./component/VerifyCertificate.jsx";

// ── 9. ADMIN SYSTEM IMPORTS ───────────────────────────────────────────
import Users from "./pages/Admin/Users.jsx";
import ManageResources from "./pages/Admin/ManageResources.jsx";
import AdminContacts from "./pages/Admin/AdminContacts.jsx";
import AdminRoadmap from "./pages/Admin/AddRoadmap.jsx";
import AdminCreateQuiz from "./pages/Admin/AdminCreateQuiz.jsx";
import AdminDocs from "./pages/Admin/AdminDocs.jsx";
import Profile from "./component/Profil.jsx"; // Left inside original mapping configuration

// ── 10. ADMIN COURSE CORE IMPORTS ─────────────────────────────────────
import AdminDashboard from "./pages/Admin/Course Admin/AdminDashboard.jsx";
import AdminCourses from "./pages/Admin/Course Admin/AdminCourses.jsx";
import AdminCourseForm from "./pages/Admin/Course Admin/AdminCourseForm.jsx";
import AdminPurchases from "./pages/Admin/Course Admin/AdminPurchases.jsx";
import AdminUsers from "./pages/Admin/Course Admin/AdminUsers.jsx";
import AdminAttendance from "./pages/Admin/Course Admin/AdminAttendance.jsx";
import AdminCertificates from "./pages/Admin/Course Admin/AdminCertificates.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        
        {/* ==================== USER SYSTEM ROUTES ==================== */}
        <Route element={<UserLayout />}>
          
          {/* 🌐 Core Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/TAC" element={<TermsAndConditions />} />

          {/* 🔐 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 📚 Academic & Study Materials Portal */}
          <Route path="/study-material" element={<StudyMaterial />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/video-lectures" element={<VideoLectures />} />
          <Route path="/quiz" element={<QuizPlacement />} />

          {/* 🤖 Core AI Portal Hubs */}
          <Route path="/easyway-ai" element={<EasywayAi />} />

          {/* 📊 Interactive Algorithms Visualizers */}
          <Route path="/algorithm-visualizer" element={<HomePage />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/trees" element={<TreePage />} />

          {/* 🎓 Public Courses Directory */}
          <Route path="/course" element={<HomePages />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/verify-paid-course-certificate" element={<VerifyCertificate />} />

          {/* 🛡️ Authenticated User Protected Sub-Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            
            {/* AI Workspace Ecosystem */}
            <Route path="/resume/dashboard" element={<ResumeDashboard />} />
            <Route path="/editor/:id" element={<ResumeBuilder />} />
            <Route path="/code-analyzer" element={<CodeAnalyzer />} />
            <Route path="//task-planner" element={<TodoList />} />
            
            {/* Interactive Roadmap Console */}
            <Route path="/roadmap" element={<RoadmapList />} />
            <Route path="/roadmap/:id" element={<Roadmap />} />

            {/* Test Engine & Certificate Center */}
            <Route path="/quizzes" element={<QuizzesList />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/docs" element={<DocsList />} />
            <Route path="/docs/:id" element={<DocDetails />} />

            {/* Premium Paid Student Base Hub */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-courses" element={<PurchasedCoursesPage />} />
            <Route path="/learn/:courseId" element={<CoursePlayerPage />} />
            <Route path="/learn/resource" element={<ResourcesPortal />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/receipt/:id" element={<ReceiptPage />} />
            <Route path="/certificate" element={<CertificatesPage />} />
          </Route>
        </Route>

        {/* ==================== OUTSIDE TEMPLATE LAYOUTS ==================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/certificate/:certificateId" element={<CertificateView />} />
        
        {/* Floating Isolated Chat System */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chatbot" element={<ChatBot />} />
        </Route>

        {/* ==================== ADMINISTRATIVE SYSTEM PANEL ==================== */}
        <Route element={<AdminLayout />}>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin">
              {/* Legacy Core Admin Management */}
              <Route path="users" element={<Users />} />
              <Route path="manage-resource" element={<ManageResources />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="add-roadmap" element={<AdminRoadmap />} />
              <Route path="create-quiz" element={<AdminCreateQuiz />} />
              <Route path="docs" element={<AdminDocs />} />

              {/* Extended Course Management Engine */}
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/new" element={<AdminCourseForm />} />
              <Route path="courses/edit/:id" element={<AdminCourseForm />} />
              <Route path="purchases" element={<AdminPurchases />} />
              <Route path="users/course" element={<AdminUsers />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="revenue" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Global Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
































































// import { Routes, Route } from "react-router-dom";

// import Home from "./pages/Home/Home.jsx";
// import StudyMaterial from "./pages/Study Material/StudyMaterial.jsx";
// import ContactUs from "./pages/Contact-Us/ContactUs.jsx";
// import EasywayAi from "./pages/Easyway AI/EasywayAi.jsx";
// import Courses from "./pages/Courses/Courses.jsx";
// import Login from "./pages/auth/Login.jsx";
// import SignUp from "./pages/auth/SignUp.jsx";
// import Roadmap from "./pages/Roadmap/Roadmap.jsx";
// import RoadmapList from "./pages/Roadmap/RoadmapList.jsx";
// import Profile from "./component/Profil.jsx";
// import ResumeBuilder from "./pages/Easyway AI/Resume Builder/ResumeBuilder.jsx";
// import Syllabus from "./pages/Study Material/Syllabus.jsx";
// import QuizPlacement from "./pages/Study Material/Quiz/QuizPlacement.jsx";
// import ChatBot from "./pages/Easyway AI/chatbot/ChatBot.jsx";
// import CodeAnalyzer from "./pages/Easyway AI/Code Analyzer/CodeAnalyzer.jsx";
// import TodoList from "./pages/TodoList/TodoList.jsx";
// import ProtectedRoute from "./component/ProtectedRoute.jsx";
// import UserLayout from "./component/UserLayout.jsx";
// import NotFound from "./component/NotFound.jsx";
// import PYQ from "./pages/Study Material/PYQ.jsx";
// import Notes from "./pages/Study Material/Notes.jsx";
// import VideoLectures from "./pages/Study Material/VideoLecture.jsx";
// import ManageResources from "./pages/Admin/ManageResources.jsx";
// import AdminContacts from "./pages/Admin/AdminContacts.jsx";
// import AdminRoadmap from "./pages/Admin/AddRoadmap.jsx";
// import AdminLayout from "./component/AdminLayout.jsx";
// import Users from "./pages/Admin/Users.jsx";
// import AdminLogin from "./pages/auth/AdminLogin.jsx";
// import AdminProtectedRoute from "./component/AdminProtectedRoute.jsx";
// import PrivacyPolicy from "./component/PrivacyPolicy.jsx";
// import TermsAndConditions from "./component/Terms&Condition.jsx";

// import HomePage from "./pages/Visualization/VisaulizationHomePage.jsx";
// import SortingPage from "./pages/Visualization/SortingPage.jsx";
// import TreePage from "./pages/Visualization/TreePage.jsx";
// import ScrollToTop from "./ScrollToTop.jsx";
// import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
// import ResetPassword from "./pages/auth/ResetPassword.jsx";
// import Quiz from "./pages/Certificate/Quiz.jsx";
// import Result from "./pages/Certificate/Result.jsx";
// import Certificates from "./pages/Certificate/Certificates.jsx";
// import CertificateView from "./pages/Certificate/CertificateView.jsx";
// import QuizzesList from "./pages/Certificate/QuizzesList.jsx";
// import AdminCreateQuiz from "./pages/Admin/AdminCreateQuiz.jsx";

// import DocsList from "./pages/Study Material/Docs (Notes)/DocsList.jsx";
// import DocDetails from "./pages/Study Material/Docs (Notes)/DetailDocs.jsx";
// import AdminDocs from "./pages/Admin/AdminDocs.jsx";
// import ResumeDashboard from "./pages/Easyway AI/Resume Builder/ResumeDashboard.jsx";

// import PublicRoute from "./component/PublicRoute.jsx";

// import AdminDashboard from "./pages/Admin/Course Admin/AdminDashboard.jsx";
// import AdminCourses from "./pages/Admin/Course Admin/AdminCourses.jsx";
// import AdminCourseForm from "./pages/Admin/Course Admin/AdminCourseForm.jsx";
// import AdminPurchases from "./pages/Admin/Course Admin/AdminPurchases.jsx";
// import AdminUsers from "./pages/Admin/Course Admin/AdminUsers.jsx";
// import AdminAttendance from "./pages/Admin/Course Admin/AdminAttendance.jsx";
// import AdminCertificates from "./pages/Admin/Course Admin/AdminCertificates.jsx";

// import HomePages from "./pages/Courses/HomePage.jsx";
// import CoursesPage from "./pages/Courses/CoursesPage.jsx";
// import CourseDetailPage from "./pages/Courses/CourseDetail.jsx";

// import DashboardPage from "./pages/Courses/student/DashboardPage.jsx";
// import PurchasedCoursesPage from "./pages/Courses/student/PurchasedCoursesPage.jsx";
// import CoursePlayerPage from "./pages/Courses/student/CoursePlayerPage.jsx";
// import ReceiptPage from "./pages/Courses/student/ReceiptPage.jsx";
// import AttendancePage from "./pages/Courses/student/AttendancePage.jsx";
// import CertificatesPage from "./pages/Courses/student/CertificatesPage.jsx";
// import VerifyCertificate from "./component/VerifyCertificate.jsx";
// import ResourcesPortal from "./component/ResourcesPortal.jsx";

// function App() {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         <Route element={<UserLayout />}>
//           {/* Public routes*/}
//           <Route path="/" element={<Home />} />
//           <Route path="/study-material" element={<StudyMaterial />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           <Route path="/easyway-ai" element={<EasywayAi />} />
//           {/* <Route path="/courses" element={<Courses />} /> */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/sign-up" element={<SignUp />} />
//           <Route path="/syllabus" element={<Syllabus />} />
//           <Route path="/quiz" element={<QuizPlacement />} />
//           <Route path="/notes" element={<Notes />} />
//           <Route path="/pyq" element={<PYQ />} />
//           <Route path="/video-lectures" element={<VideoLectures />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/TAC" element={<TermsAndConditions />} />
//           <Route path="/algorithm-visualizer" element={<HomePage />} />
//           <Route path="/sorting" element={<SortingPage />} />
//           <Route path="/trees" element={<TreePage />} />

//           {/* courses */}

//           <Route path="/course" element={<HomePages />} />
//           <Route path="/courses" element={<CoursesPage />} />
//           <Route path="/courses/:id" element={<CourseDetailPage />} />
//           <Route
//             path="/verify-paid-course-certificate"
//             element={<VerifyCertificate />}
//           />

//           {/* Forgot Password */}
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           {/* Reset Password with token */}
//           <Route path="/reset-password/:token" element={<ResetPassword />} />

//           {/* Certificate */}

//           {/* Protected routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="/profile" element={<Profile />} />

//             {/* Dashboard - Shows All Resumes */}
//             <Route path="/resume/dashboard" element={<ResumeDashboard />} />

//             {/* Resume Editor - Specific Resume */}
//             <Route path="/editor/:id" element={<ResumeBuilder />} />

//             {/* <Route path="/resume-builder" element={<ResumeBuilder />} /> */}
//             <Route path="/code-analyzer" element={<CodeAnalyzer />} />
//             <Route path="//task-planner" element={<TodoList />} />
//             <Route path="/roadmap" element={<RoadmapList />} />
//             <Route path="/roadmap/:id" element={<Roadmap />} />

//             <Route path="/quiz/:quizId" element={<Quiz />} />
//             <Route path="/result" element={<Result />} />
//             <Route path="/certificates" element={<Certificates />} />
//             <Route path="/quizzes" element={<QuizzesList />} />
//             <Route path="/docs" element={<DocsList />} />
//             <Route path="/docs/:id" element={<DocDetails />} />

//             {/* courses */}

//             <Route path="/my-courses" element={<PurchasedCoursesPage />} />
//             <Route path="/learn/:courseId" element={<CoursePlayerPage />} />
//             <Route path="/receipt/:id" element={<ReceiptPage />} />
//             <Route path="/attendance" element={<AttendancePage />} />
//             <Route path="/certificate" element={<CertificatesPage />} />
//             <Route path="/dashboard" element={<DashboardPage />} />
//             <Route path="/learn/resource" element={<ResourcesPortal />} />
//           </Route>
//         </Route>
//         <Route path="/admin/login" element={<AdminLogin />} />
//         //without header and footer
//         <Route
//           path="/certificate/:certificateId"
//           element={<CertificateView />}
//         />
//         <Route element={<ProtectedRoute />}>
//           <Route path="/chatbot" element={<ChatBot />} />
//         </Route>
//         <Route element={<AdminLayout />}>
//           <Route element={<AdminProtectedRoute />}>
//             <Route path="/admin">
//               <Route path="users" element={<Users />} />
//               <Route path="manage-resource" element={<ManageResources />} />
//               <Route path="contacts" element={<AdminContacts />} />
//               <Route path="add-roadmap" element={<AdminRoadmap />} />
//               <Route path="create-quiz" element={<AdminCreateQuiz />} />
//               <Route path="docs" element={<AdminDocs />} />

//               {/* courses */}

//               <Route path="courses" element={<AdminCourses />} />
//               <Route path="courses/new" element={<AdminCourseForm />} />
//               <Route path="courses/edit/:id" element={<AdminCourseForm />} />
//               <Route path="purchases" element={<AdminPurchases />} />
//               <Route path="users/course" element={<AdminUsers />} />
//               <Route path="attendance" element={<AdminAttendance />} />
//               <Route path="certificates" element={<AdminCertificates />} />
//               <Route path="revenue" element={<AdminDashboard />} />
//             </Route>
//           </Route>
//         </Route>
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }

// export default App;
