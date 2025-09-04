import { Outlet } from "react-router-dom";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav className="transition-linear"/>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
