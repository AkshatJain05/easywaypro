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
import TodoList from "./pages/TodoList/TodoList.jsx"

function App() {
  return (
    <>
    <Nav className="transition-linear" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study-material" element={<StudyMaterial />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/easyway-ai" element={<EasywayAi />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/roadmap" element={<RoadmapList />} />
        <Route path="/roadmap/:id" element={<Roadmap />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/quiz" element={<QuizPlacement />} />
        <Route path="/chatbot" element={<ChatBot />} /> 
        <Route path="/code-analyzer" element={<CodeAnalyzer />} />
        <Route path="/todo-list" element={<TodoList />} />
        {/* <Route path="/upload" element={<UploadSection />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
