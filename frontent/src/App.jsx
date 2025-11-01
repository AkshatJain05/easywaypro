import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import StudyMaterial from "./pages/Study Material/StudyMaterial.jsx";
import ContactUs from "./pages/Contact-Us/ContactUs.jsx";
import EasywayAi from "./pages/Easyway AI/EasywayAi.jsx";
import Courses from "./pages/Courses/Courses.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";
import RoadmapList from "./pages/Roadmap/RoadmapList.jsx";
import Profile from "./component/Profil.jsx";
import ResumeBuilder from "./pages/Easyway AI/Resume Builder/ResumeBuilder.jsx";
import Syllabus from "./pages/Study Material/Syllabus.jsx";
import QuizPlacement from "./pages/Study Material/Quiz/QuizPlacement.jsx";
import ChatBot from "./pages/Easyway AI/chatbot/ChatBot.jsx";
import CodeAnalyzer from "./pages/Easyway AI/Code Analyzer/CodeAnalyzer.jsx";
import TodoList from "./pages/TodoList/TodoList.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import UserLayout from "./component/UserLayout.jsx";
import NotFound from "./component/NotFound.jsx";
import PYQ from "./pages/Study Material/PYQ.jsx";
import Notes from "./pages/Study Material/Notes.jsx";
import VideoLectures from "./pages/Study Material/VideoLecture.jsx";
import ManageResources from "./pages/Admin/ManageResources.jsx";
import AdminContacts from "./pages/Admin/AdminContacts.jsx";
import AdminRoadmap from "./pages/Admin/AddRoadmap.jsx";
import AdminLayout from "./component/AdminLayout.jsx";
import Users from "./pages/Admin/Users.jsx";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import AdminProtectedRoute from "./component/AdminProtectedRoute.jsx";
import PrivacyPolicy from "./component/PrivacyPolicy.jsx";
import TermsAndConditions from "./component/Terms&Condition.jsx";

import HomePage from "./pages/Visualization/VisaulizationHomePage.jsx";
import SortingPage from "./pages/Visualization/SortingPage.jsx";
import TreePage from "./pages/Visualization/TreePage.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Quiz from "./pages/Certificate/Quiz.jsx";
import Result from "./pages/Certificate/Result.jsx";
import Certificates from "./pages/Certificate/Certificates.jsx";
import CertificateView from "./pages/Certificate/CertificateView.jsx";
import QuizzesList from "./pages/Certificate/QuizzesList.jsx";
import AdminCreateQuiz from "./pages/Admin/AdminCreateQuiz.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<UserLayout />}>
          {/* Public routes*/}
          <Route path="/" element={<Home />} />
          <Route path="/study-material" element={<StudyMaterial />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/easyway-ai" element={<EasywayAi />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/quiz" element={<QuizPlacement />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/video-lectures" element={<VideoLectures />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/TAC" element={<TermsAndConditions />} />

          <Route path="/algorithm-visualizer" element={<HomePage />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/trees" element={<TreePage />} />

          {/* Forgot Password */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Reset Password with token */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Certificate */}

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/code-analyzer" element={<CodeAnalyzer />} />
            <Route path="//task-planner" element={<TodoList />} />
            <Route path="/roadmap" element={<RoadmapList />} />
            <Route path="/roadmap/:id" element={<Roadmap />} />

            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/quizzes" element={<QuizzesList />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        //without header and footer
        <Route
          path="/certificate/:certificateId"
          element={<CertificateView />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/chatbot" element={<ChatBot />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin">
              <Route path="users" element={<Users />} />
              <Route path="manage-resource" element={<ManageResources />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="add-roadmap" element={<AdminRoadmap />} />
              <Route path="create-quiz" element={<AdminCreateQuiz />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
