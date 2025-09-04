import { Routes, Route } from "react-router-dom";
import Nav from "./component/Nav.jsx";
import Footer from "./component/Footer";

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

function App() {
  return (
    <>
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
          <Route path="/roadmap" element={<RoadmapList />} />
          <Route path="/roadmap/:id" element={<Roadmap />} />
          <Route path="/syllabus" element={<Syllabus />} />
          <Route path="/quiz" element={<QuizPlacement />} />
          <Route path="/notes" element={<Notes/>}/>
          <Route path="/pyq" element={<PYQ/>}/>
          <Route path="video-lectures" element={<VideoLectures/>}/>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/code-analyzer" element={<CodeAnalyzer />} />
            <Route path="/todo-list" element={<TodoList />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
