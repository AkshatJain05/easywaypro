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
        <Route path="/profile" element={<Profile />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
